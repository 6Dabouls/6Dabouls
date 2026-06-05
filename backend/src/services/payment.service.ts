import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { notifyPayment } from './notification.service';
import { logger } from '../utils/logger';

const PAYMENT_LINKS: Map<string, { userId: string; amount: number; currency: string; description: string; expiresAt: Date }> = new Map();

export async function generateQRCode(
  userId: string,
  data: { amount: number; currency: string; description?: string }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400);

  const payload = JSON.stringify({
    type: 'neero_payment',
    userId,
    amount: data.amount,
    currency: data.currency.toUpperCase(),
    description: data.description || '',
    timestamp: Date.now(),
  });

  const qrCodeDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    width: 300,
  });

  return { qrCode: qrCodeDataUrl, payload };
}

export async function processQRPayment(
  payerId: string,
  qrData: string
) {
  let parsedData: any;
  try {
    parsedData = JSON.parse(qrData);
  } catch {
    throw new AppError('Invalid QR code', 400, 'INVALID_QR');
  }

  if (parsedData.type !== 'neero_payment') throw new AppError('Invalid payment QR code', 400);
  if (parsedData.userId === payerId) throw new AppError('Cannot pay yourself', 400, 'SELF_PAYMENT');

  const age = Date.now() - parsedData.timestamp;
  if (age > 5 * 60 * 1000) throw new AppError('QR code expired', 400, 'QR_EXPIRED');

  const payerWallet = await prisma.wallet.findUnique({
    where: {
      userId_currency: { userId: payerId, currency: parsedData.currency },
    },
  });
  if (!payerWallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const available = Number(payerWallet.balance) - Number(payerWallet.frozenBalance);
  if (available < parsedData.amount) throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');

  let recipientWallet = await prisma.wallet.findUnique({
    where: {
      userId_currency: { userId: parsedData.userId, currency: parsedData.currency },
    },
  });
  if (!recipientWallet) {
    recipientWallet = await prisma.wallet.create({
      data: { userId: parsedData.userId, currency: parsedData.currency, balance: 0 },
    });
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: payerWallet.id },
      data: { balance: { decrement: parsedData.amount } },
    }),
    prisma.wallet.update({
      where: { id: recipientWallet.id },
      data: { balance: { increment: parsedData.amount } },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: payerWallet.id,
        toWalletId: recipientWallet.id,
        fromUserId: payerId,
        toUserId: parsedData.userId,
        amount: parsedData.amount,
        currency: parsedData.currency,
        type: 'PAYMENT',
        status: 'COMPLETED',
        description: parsedData.description || 'Paiement QR',
      },
    }),
  ]);

  await notifyPayment(payerId, parsedData.amount.toString(), parsedData.currency, parsedData.description || 'Paiement QR');

  return { success: true, amount: parsedData.amount, currency: parsedData.currency };
}

export async function generatePaymentLink(
  userId: string,
  data: { amount: number; currency: string; description?: string; expiresInHours?: number }
) {
  const linkId = uuidv4();
  const expiresAt = new Date(Date.now() + (data.expiresInHours || 24) * 60 * 60 * 1000);

  PAYMENT_LINKS.set(linkId, {
    userId,
    amount: data.amount,
    currency: data.currency.toUpperCase(),
    description: data.description || '',
    expiresAt,
  });

  const link = `${process.env.FRONTEND_URL}/pay/${linkId}`;

  return { linkId, link, amount: data.amount, currency: data.currency, expiresAt };
}

export async function processPaymentLink(payerId: string, linkId: string) {
  const linkData = PAYMENT_LINKS.get(linkId);
  if (!linkData) throw new AppError('Payment link not found or expired', 404, 'LINK_NOT_FOUND');
  if (new Date() > linkData.expiresAt) {
    PAYMENT_LINKS.delete(linkId);
    throw new AppError('Payment link expired', 400, 'LINK_EXPIRED');
  }
  if (linkData.userId === payerId) throw new AppError('Cannot pay yourself', 400, 'SELF_PAYMENT');

  // Reuse QR payment logic
  PAYMENT_LINKS.delete(linkId);

  const payerWallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId: payerId, currency: linkData.currency } },
  });
  if (!payerWallet) throw new AppError('Wallet not found', 404);

  const available = Number(payerWallet.balance) - Number(payerWallet.frozenBalance);
  if (available < linkData.amount) throw new AppError('Insufficient balance', 400);

  let recipientWallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId: linkData.userId, currency: linkData.currency } },
  });
  if (!recipientWallet) {
    recipientWallet = await prisma.wallet.create({
      data: { userId: linkData.userId, currency: linkData.currency, balance: 0 },
    });
  }

  await prisma.$transaction([
    prisma.wallet.update({ where: { id: payerWallet.id }, data: { balance: { decrement: linkData.amount } } }),
    prisma.wallet.update({ where: { id: recipientWallet.id }, data: { balance: { increment: linkData.amount } } }),
    prisma.transaction.create({
      data: {
        fromWalletId: payerWallet.id,
        toWalletId: recipientWallet.id,
        fromUserId: payerId,
        toUserId: linkData.userId,
        amount: linkData.amount,
        currency: linkData.currency,
        type: 'PAYMENT',
        status: 'COMPLETED',
        description: linkData.description || 'Paiement via lien',
      },
    }),
  ]);

  return { success: true, amount: linkData.amount, currency: linkData.currency };
}

export type BillType = 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'TV' | 'PHONE' | 'OTHER';

export async function payBill(
  userId: string,
  data: {
    billType: BillType;
    billerCode: string;
    amount: number;
    currency: string;
    accountNumber: string;
    description?: string;
  }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400);

  const wallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: data.currency.toUpperCase() } },
  });
  if (!wallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const available = Number(wallet.balance) - Number(wallet.frozenBalance);
  if (available < data.amount) throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');

  // Simulate biller API call
  await new Promise((r) => setTimeout(r, 300));

  const billTypeLabels: Record<BillType, string> = {
    ELECTRICITY: 'Électricité', WATER: 'Eau', INTERNET: 'Internet',
    TV: 'Télévision', PHONE: 'Téléphonie', OTHER: 'Facture',
  };

  const description = data.description || `${billTypeLabels[data.billType]} - ${data.accountNumber}`;

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: data.amount } },
    });

    return tx.transaction.create({
      data: {
        fromWalletId: wallet.id,
        fromUserId: userId,
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        type: 'PAYMENT',
        status: 'COMPLETED',
        description,
        metadata: { billType: data.billType, billerCode: data.billerCode, accountNumber: data.accountNumber },
      },
    });
  });

  await notifyPayment(userId, data.amount.toString(), data.currency, description);

  return transaction;
}
