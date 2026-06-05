import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import {
  generateCardNumber,
  generateCVV,
  encryptCardNumber,
  decryptCardNumber,
  maskCardNumber,
  generateTrackingNumber,
} from '../utils/crypto';

export async function getCards(userId: string) {
  const cards = await prisma.card.findMany({
    where: { userId, status: { not: 'CANCELLED' } },
    select: {
      id: true,
      type: true,
      maskedNumber: true,
      expiryMonth: true,
      expiryYear: true,
      cardholderName: true,
      status: true,
      dailyLimit: true,
      currency: true,
      createdAt: true,
      trackingNumber: true,
      activatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return cards;
}

export async function getCard(userId: string, cardId: string, revealSensitive = false) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId },
  });

  if (!card) throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');

  const result: any = {
    id: card.id,
    type: card.type,
    maskedNumber: card.maskedNumber,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cardholderName: card.cardholderName,
    status: card.status,
    dailyLimit: card.dailyLimit,
    currency: card.currency,
    createdAt: card.createdAt,
    activatedAt: card.activatedAt,
    trackingNumber: card.trackingNumber,
  };

  if (revealSensitive) {
    result.cardNumber = decryptCardNumber(card.cardNumber);
    result.cvv = decryptCardNumber(card.cvv);
  }

  return result;
}

export async function createVirtualCard(
  userId: string,
  data: { cardholderName: string; currency?: string }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.kycLevel === 'NONE') throw new AppError('KYC verification required', 403, 'KYC_REQUIRED');

  const existingVirtual = await prisma.card.findFirst({
    where: { userId, type: 'VIRTUAL', status: { in: ['ACTIVE', 'BLOCKED'] } },
  });
  if (existingVirtual) throw new AppError('You already have an active virtual card', 409, 'CARD_EXISTS');

  const cardNumber = generateCardNumber();
  const cvv = generateCVV();
  const now = new Date();
  const expiryYear = now.getFullYear() + 3;
  const expiryMonth = now.getMonth() + 1;

  const card = await prisma.card.create({
    data: {
      userId,
      type: 'VIRTUAL',
      cardNumber: encryptCardNumber(cardNumber),
      maskedNumber: maskCardNumber(cardNumber),
      cvv: encryptCardNumber(cvv),
      expiryMonth,
      expiryYear,
      cardholderName: data.cardholderName.toUpperCase(),
      currency: (data.currency || 'XOF').toUpperCase(),
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
  });

  return {
    id: card.id,
    type: card.type,
    maskedNumber: card.maskedNumber,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cardholderName: card.cardholderName,
    status: card.status,
    currency: card.currency,
    // Reveal on creation only
    cardNumber,
    cvv,
  };
}

export async function orderPhysicalCard(
  userId: string,
  data: { cardholderName: string; deliveryAddress: string }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (user.kycLevel !== 'LEVEL_2' && user.kycLevel !== 'LEVEL_3') {
    throw new AppError('Level 2 KYC required for physical card', 403, 'KYC_REQUIRED');
  }

  const existingPhysical = await prisma.card.findFirst({
    where: { userId, type: 'PHYSICAL', status: { in: ['ACTIVE', 'BLOCKED', 'PENDING_ACTIVATION'] } },
  });
  if (existingPhysical) throw new AppError('You already have a physical card', 409, 'CARD_EXISTS');

  const cardNumber = generateCardNumber();
  const cvv = generateCVV();
  const now = new Date();
  const expiryYear = now.getFullYear() + 4;
  const expiryMonth = now.getMonth() + 1;

  const card = await prisma.card.create({
    data: {
      userId,
      type: 'PHYSICAL',
      cardNumber: encryptCardNumber(cardNumber),
      maskedNumber: maskCardNumber(cardNumber),
      cvv: encryptCardNumber(cvv),
      expiryMonth,
      expiryYear,
      cardholderName: data.cardholderName.toUpperCase(),
      deliveryAddress: data.deliveryAddress,
      status: 'PENDING_ACTIVATION',
      trackingNumber: generateTrackingNumber(),
    },
  });

  return {
    id: card.id,
    type: card.type,
    maskedNumber: card.maskedNumber,
    status: card.status,
    trackingNumber: card.trackingNumber,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

export async function updateCardStatus(
  userId: string,
  cardId: string,
  status: 'ACTIVE' | 'BLOCKED'
) {
  const card = await prisma.card.findFirst({ where: { id: cardId, userId } });
  if (!card) throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');
  if (card.status === 'EXPIRED' || card.status === 'CANCELLED') {
    throw new AppError('Cannot update status of expired or cancelled card', 400);
  }

  return prisma.card.update({ where: { id: cardId }, data: { status } });
}

export async function updateCardLimits(userId: string, cardId: string, dailyLimit: number) {
  if (dailyLimit <= 0 || dailyLimit > 5000000) {
    throw new AppError('Daily limit must be between 1 and 5,000,000', 400, 'INVALID_LIMIT');
  }

  const card = await prisma.card.findFirst({ where: { id: cardId, userId } });
  if (!card) throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');

  return prisma.card.update({ where: { id: cardId }, data: { dailyLimit } });
}

export async function cancelCard(userId: string, cardId: string) {
  const card = await prisma.card.findFirst({ where: { id: cardId, userId } });
  if (!card) throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');

  return prisma.card.update({ where: { id: cardId }, data: { status: 'CANCELLED' } });
}
