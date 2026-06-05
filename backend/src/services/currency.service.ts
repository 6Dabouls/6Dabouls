import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export const SUPPORTED_CURRENCIES = ['XOF', 'XAF', 'USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'MAD', 'CDF'];

const CONVERSION_FEE_RATE = 0.015; // 1.5%

const DEFAULT_RATES: Record<string, number> = {
  'XOF_USD': 0.00164, 'USD_XOF': 609.76,
  'XOF_EUR': 0.00152, 'EUR_XOF': 655.96,
  'XOF_GBP': 0.00130, 'GBP_XOF': 769.23,
  'XOF_XAF': 1.00,   'XAF_XOF': 1.00,
  'XOF_NGN': 1.31,   'NGN_XOF': 0.76,
  'XOF_GHS': 0.022,  'GHS_XOF': 45.45,
  'XOF_KES': 0.21,   'KES_XOF': 4.76,
  'XOF_MAD': 0.016,  'MAD_XOF': 62.50,
  'USD_EUR': 0.93,   'EUR_USD': 1.08,
};

export async function getExchangeRates(baseCurrency = 'XOF') {
  const base = baseCurrency.toUpperCase();
  const rates: Record<string, number> = {};

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === base) {
      rates[currency] = 1;
      continue;
    }

    const stored = await prisma.exchangeRate.findUnique({
      where: { fromCurrency_toCurrency: { fromCurrency: base, toCurrency: currency } },
    });

    if (stored) {
      rates[currency] = Number(stored.rate);
    } else {
      const key = `${base}_${currency}`;
      rates[currency] = DEFAULT_RATES[key] || 0;
    }
  }

  return { base, rates, timestamp: new Date() };
}

export async function getRate(from: string, to: string): Promise<number> {
  const fromCurrency = from.toUpperCase();
  const toCurrency = to.toUpperCase();

  if (fromCurrency === toCurrency) return 1;

  const stored = await prisma.exchangeRate.findUnique({
    where: { fromCurrency_toCurrency: { fromCurrency, toCurrency } },
  });

  if (stored) return Number(stored.rate);

  const key = `${fromCurrency}_${toCurrency}`;
  const rate = DEFAULT_RATES[key];
  if (!rate) throw new AppError(`Exchange rate not available for ${from}/${to}`, 404, 'RATE_NOT_FOUND');

  return rate;
}

export async function convertCurrency(
  userId: string,
  data: { amount: number; from: string; to: string }
) {
  if (data.amount <= 0) throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');
  if (data.amount < 100) throw new AppError('Minimum conversion is 100', 400, 'AMOUNT_TOO_SMALL');

  const from = data.from.toUpperCase();
  const to = data.to.toUpperCase();
  if (from === to) throw new AppError('Cannot convert to same currency', 400, 'SAME_CURRENCY');

  if (!SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)) {
    throw new AppError('Unsupported currency', 400, 'UNSUPPORTED_CURRENCY');
  }

  const rate = await getRate(from, to);
  const fee = Math.floor(data.amount * CONVERSION_FEE_RATE);
  const amountAfterFee = data.amount - fee;
  const convertedAmount = Math.floor(amountAfterFee * rate);

  // Get source wallet
  const sourceWallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: from } },
  });
  if (!sourceWallet) throw new AppError(`No ${from} wallet found`, 404, 'WALLET_NOT_FOUND');
  if (sourceWallet.status !== 'ACTIVE') throw new AppError('Source wallet is not active', 400);

  const available = Number(sourceWallet.balance) - Number(sourceWallet.frozenBalance);
  if (available < data.amount) throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');

  // Get or create destination wallet
  let destWallet = await prisma.wallet.findUnique({
    where: { userId_currency: { userId, currency: to } },
  });
  if (!destWallet) {
    destWallet = await prisma.wallet.create({
      data: { userId, currency: to, balance: 0 },
    });
  }

  // Execute conversion atomically
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: sourceWallet.id },
      data: { balance: { decrement: data.amount } },
    }),
    prisma.wallet.update({
      where: { id: destWallet.id },
      data: { balance: { increment: convertedAmount } },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: sourceWallet.id,
        toWalletId: destWallet.id,
        fromUserId: userId,
        toUserId: userId,
        amount: data.amount,
        fee,
        currency: from,
        type: 'CURRENCY_CONVERSION',
        status: 'COMPLETED',
        description: `Conversion ${from} → ${to}`,
        metadata: { from, to, rate, convertedAmount, fee },
      },
    }),
  ]);

  return {
    from, to, amount: data.amount, fee,
    convertedAmount, rate,
    timestamp: new Date(),
  };
}

export async function seedDefaultRates(): Promise<void> {
  try {
    for (const [pair, rate] of Object.entries(DEFAULT_RATES)) {
      const [from, to] = pair.split('_');
      await prisma.exchangeRate.upsert({
        where: { fromCurrency_toCurrency: { fromCurrency: from, toCurrency: to } },
        create: { fromCurrency: from, toCurrency: to, rate },
        update: { rate },
      });
    }
    logger.info('Exchange rates seeded');
  } catch (error) {
    logger.error('Failed to seed exchange rates:', error);
  }
}
