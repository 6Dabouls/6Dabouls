import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { processDeposit, processWithdrawal, MobileMoneyProvider } from './mobilemoney.service';
import { notifyDeposit, notifyWithdrawal, notifyTransferSent, notifyTransferReceived } from './notification.service';
import { logger } from '../utils/logger';

const TRANSFER_FEE_RATE = 0.005; // 0.5%
const MIN_TRANSFER_FEE = 100; // 100 XOF minimum fee

export async function getWallets(userId: string) {
  return prisma.wallet.findMany({
    where: { userId },
    orderBy: { currency: 'asc' },
  });
}

export async function getWallet(userId: string, currency: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: currency.toUpperCase() } },
  });
  if (!wallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  return wallet;
}

export async function createWallet(userId: string, currency: string) {
  const existing = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: currency.toUpperCase() } },
  });
  if (existing) throw new AppError('Wallet already exists for this currency', 409, 'WALLET_EXISTS');

  return prisma.wallet.create({
    data: { userId, currency: currency.toUpperCase(), balance: 0 },
  });
}

export async function deposit(
  userId: string,
  data: {
    amount: number;
    currency: string;
    provider: MobileMoneyProvider;
    phone: string;
    description?: string;
  }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');
  if (data.amount < 100) throw new AppError('Minimum deposit is 100 XOF', 400, 'AMOUNT_TOO_SMALL');
  if (data.amount > 10000000) throw new AppError('Maximum deposit is 10,000,000 XOF', 400, 'AMOUNT_TOO_LARGE');

  const wallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: data.currency.toUpperCase() } },
  });
  if (!wallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  if (wallet.status !== 'ACTIVE') throw new AppError('Wallet is not active', 400, 'WALLET_INACTIVE');

  // Create pending transaction
  const transaction = await prisma.transaction.create({
    data: {
      toWalletId: wallet.id,
      toUserId: userId,
      amount: data.amount,
      currency: data.currency.toUpperCase(),
      type: 'DEPOSIT',
      status: 'PROCESSING',
      description: data.description || `Dépôt via ${data.provider}`,
      metadata: { provider: data.provider, phone: data.phone },
    },
  });

  try {
    // Call Mobile Money API
    const result = await processDeposit(data.phone, data.amount, data.currency, data.provider);

    if (!result.success) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED', externalRef: result.transactionRef },
      });
      throw new AppError('Mobile Money deposit failed', 400, 'MOMO_FAILED');
    }

    // Update wallet balance and complete transaction
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: data.amount } },
      }),
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED', externalRef: result.transactionRef },
      }),
    ]);

    await notifyDeposit(userId, data.amount.toString(), data.currency, data.provider);

    return prisma.transaction.findUnique({ where: { id: transaction.id } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'FAILED' },
    });
    logger.error('Deposit failed:', error);
    throw new AppError('Deposit processing failed', 500, 'DEPOSIT_FAILED');
  }
}

export async function withdraw(
  userId: string,
  data: {
    amount: number;
    currency: string;
    provider: MobileMoneyProvider;
    phone: string;
    description?: string;
  }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');

  const wallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: data.currency.toUpperCase() } },
  });
  if (!wallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  if (wallet.status !== 'ACTIVE') throw new AppError('Wallet is not active', 400, 'WALLET_INACTIVE');

  const available = Number(wallet.balance) - Number(wallet.frozenBalance);
  if (available < data.amount) {
    throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
  }

  // Freeze the amount
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { frozenBalance: { increment: data.amount } },
  });

  const transaction = await prisma.transaction.create({
    data: {
      fromWalletId: wallet.id,
      fromUserId: userId,
      amount: data.amount,
      currency: data.currency.toUpperCase(),
      type: 'WITHDRAWAL',
      status: 'PROCESSING',
      description: data.description || `Retrait vers ${data.provider}`,
      metadata: { provider: data.provider, phone: data.phone },
    },
  });

  try {
    const result = await processWithdrawal(data.phone, data.amount, data.currency, data.provider);

    if (!result.success) {
      // Unfreeze
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { frozenBalance: { decrement: data.amount } },
      });
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });
      throw new AppError('Withdrawal failed', 400, 'WITHDRAWAL_FAILED');
    }

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: data.amount },
          frozenBalance: { decrement: data.amount },
        },
      }),
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED', externalRef: result.transactionRef },
      }),
    ]);

    await notifyWithdrawal(userId, data.amount.toString(), data.currency);

    return prisma.transaction.findUnique({ where: { id: transaction.id } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { frozenBalance: { decrement: data.amount } },
    });
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' } });
    logger.error('Withdrawal failed:', error);
    throw new AppError('Withdrawal processing failed', 500, 'WITHDRAWAL_FAILED');
  }
}

export async function transfer(
  senderId: string,
  data: {
    amount: number;
    currency: string;
    recipientIdentifier: string;
    description?: string;
  }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');
  if (data.amount < 100) throw new AppError('Minimum transfer is 100', 400, 'AMOUNT_TOO_SMALL');

  // Find recipient
  const recipient = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.recipientIdentifier }, { phone: data.recipientIdentifier }],
      status: 'ACTIVE',
    },
    include: { profile: true },
  });

  if (!recipient) throw new AppError('Recipient not found', 404, 'RECIPIENT_NOT_FOUND');
  if (recipient.id === senderId) throw new AppError('Cannot transfer to yourself', 400, 'SELF_TRANSFER');

  // Get wallets
  const senderWallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId: senderId, currency: data.currency.toUpperCase() } },
  });
  if (!senderWallet) throw new AppError('Sender wallet not found', 404, 'WALLET_NOT_FOUND');
  if (senderWallet.status !== 'ACTIVE') throw new AppError('Sender wallet is not active', 400);

  // Get or create recipient wallet
  let recipientWallet = await prisma.wallet.findUnique({
    where: {
      userId_currency: { userId: recipient.id, currency: data.currency.toUpperCase() },
    },
  });
  if (!recipientWallet) {
    recipientWallet = await prisma.wallet.create({
      data: { userId: recipient.id, currency: data.currency.toUpperCase(), balance: 0 },
    });
  }

  // Calculate fee
  const fee = Math.max(
    Math.floor(data.amount * TRANSFER_FEE_RATE),
    MIN_TRANSFER_FEE
  );
  const totalDeduction = data.amount + fee;

  const available = Number(senderWallet.balance) - Number(senderWallet.frozenBalance);
  if (available < totalDeduction) {
    throw new AppError(
      `Insufficient balance. Need ${totalDeduction} ${data.currency} (including ${fee} fee)`,
      400,
      'INSUFFICIENT_BALANCE'
    );
  }

  const senderName = `${(await prisma.profile.findUnique({ where: { userId: senderId } }))?.firstName || ''} ${(await prisma.profile.findUnique({ where: { userId: senderId } }))?.lastName || ''}`.trim() || 'Utilisateur';
  const recipientName = `${recipient.profile?.firstName || ''} ${recipient.profile?.lastName || ''}`.trim() || 'Utilisateur';

  // Execute transfer atomically
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: totalDeduction } },
    }),
    prisma.wallet.update({
      where: { id: recipientWallet.id },
      data: { balance: { increment: data.amount } },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: senderWallet.id,
        toWalletId: recipientWallet.id,
        fromUserId: senderId,
        toUserId: recipient.id,
        amount: data.amount,
        fee,
        currency: data.currency.toUpperCase(),
        type: 'TRANSFER_OUT',
        status: 'COMPLETED',
        description: data.description || `Transfert à ${recipientName}`,
      },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: senderWallet.id,
        toWalletId: recipientWallet.id,
        fromUserId: senderId,
        toUserId: recipient.id,
        amount: data.amount,
        fee: 0,
        currency: data.currency.toUpperCase(),
        type: 'TRANSFER_IN',
        status: 'COMPLETED',
        description: data.description || `Transfert de ${senderName}`,
      },
    }),
  ]);

  await Promise.all([
    notifyTransferSent(senderId, data.amount.toString(), data.currency, recipientName),
    notifyTransferReceived(recipient.id, data.amount.toString(), data.currency, senderName),
  ]);

  return {
    amount: data.amount,
    fee,
    currency: data.currency,
    recipient: {
      id: recipient.id,
      name: recipientName,
      identifier: data.recipientIdentifier,
    },
  };
}

export async function getTransactionHistory(
  userId: string,
  filters: {
    type?: string;
    status?: string;
    currency?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) {
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);
  const skip = (page - 1) * limit;

  const where: any = {
    OR: [{ fromUserId: userId }, { toUserId: userId }],
  };

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.currency) where.currency = filters.currency.toUpperCase();
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
