import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export type MobileMoneyProvider = 'MTN' | 'ORANGE' | 'MOOV' | 'WAVE';

export interface MobileMoneyResult {
  success: boolean;
  transactionRef: string;
  provider: MobileMoneyProvider;
  message: string;
}

async function simulateNetworkDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
}

export async function mtnDeposit(
  phone: string,
  amount: number,
  currency: string
): Promise<MobileMoneyResult> {
  await simulateNetworkDelay();
  logger.info(`MTN MoMo deposit: ${phone} ${amount} ${currency}`);

  // In production: call MTN MoMo Collections API
  const ref = `MTN-${uuidv4().slice(0, 8).toUpperCase()}`;
  return {
    success: true,
    transactionRef: ref,
    provider: 'MTN',
    message: `Dépôt MTN MoMo de ${amount} ${currency} initié`,
  };
}

export async function mtnWithdraw(
  phone: string,
  amount: number,
  currency: string
): Promise<MobileMoneyResult> {
  await simulateNetworkDelay();
  logger.info(`MTN MoMo withdrawal: ${phone} ${amount} ${currency}`);

  const ref = `MTN-${uuidv4().slice(0, 8).toUpperCase()}`;
  return {
    success: true,
    transactionRef: ref,
    provider: 'MTN',
    message: `Retrait MTN MoMo de ${amount} ${currency} initié`,
  };
}

export async function orangeDeposit(
  phone: string,
  amount: number,
  currency: string
): Promise<MobileMoneyResult> {
  await simulateNetworkDelay();
  logger.info(`Orange Money deposit: ${phone} ${amount} ${currency}`);

  const ref = `OM-${uuidv4().slice(0, 8).toUpperCase()}`;
  return {
    success: true,
    transactionRef: ref,
    provider: 'ORANGE',
    message: `Dépôt Orange Money de ${amount} ${currency} initié`,
  };
}

export async function orangeWithdraw(
  phone: string,
  amount: number,
  currency: string
): Promise<MobileMoneyResult> {
  await simulateNetworkDelay();
  logger.info(`Orange Money withdrawal: ${phone} ${amount} ${currency}`);

  const ref = `OM-${uuidv4().slice(0, 8).toUpperCase()}`;
  return {
    success: true,
    transactionRef: ref,
    provider: 'ORANGE',
    message: `Retrait Orange Money de ${amount} ${currency} initié`,
  };
}

export async function checkTransactionStatus(
  provider: MobileMoneyProvider,
  transactionId: string
): Promise<{ status: 'PENDING' | 'COMPLETED' | 'FAILED'; message: string }> {
  await simulateNetworkDelay();
  logger.info(`Checking status for ${provider} transaction: ${transactionId}`);

  return { status: 'COMPLETED', message: 'Transaction completed successfully' };
}

export async function processDeposit(
  phone: string,
  amount: number,
  currency: string,
  provider: MobileMoneyProvider
): Promise<MobileMoneyResult> {
  switch (provider) {
    case 'MTN':
      return mtnDeposit(phone, amount, currency);
    case 'ORANGE':
      return orangeDeposit(phone, amount, currency);
    default:
      return {
        success: false,
        transactionRef: '',
        provider,
        message: `Provider ${provider} not supported`,
      };
  }
}

export async function processWithdrawal(
  phone: string,
  amount: number,
  currency: string,
  provider: MobileMoneyProvider
): Promise<MobileMoneyResult> {
  switch (provider) {
    case 'MTN':
      return mtnWithdraw(phone, amount, currency);
    case 'ORANGE':
      return orangeWithdraw(phone, amount, currency);
    default:
      return {
        success: false,
        transactionRef: '',
        provider,
        message: `Provider ${provider} not supported`,
      };
  }
}
