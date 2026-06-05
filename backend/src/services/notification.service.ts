import { NotificationType } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(
  userId: string,
  data: CreateNotificationData
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {},
      },
    });
  } catch (error) {
    logger.error('Failed to create notification:', error);
  }
}

export async function getNotifications(
  userId: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function markAsRead(userId: string, notificationId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(userId: string, notificationId: string): Promise<void> {
  await prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });
}

// Helper notification creators
export async function notifyDeposit(
  userId: string,
  amount: string,
  currency: string,
  provider: string
): Promise<void> {
  await createNotification(userId, {
    type: 'DEPOSIT_RECEIVED',
    title: 'Dépôt reçu',
    message: `Votre dépôt de ${amount} ${currency} via ${provider} a été effectué avec succès.`,
    metadata: { amount, currency, provider },
  });
}

export async function notifyWithdrawal(
  userId: string,
  amount: string,
  currency: string
): Promise<void> {
  await createNotification(userId, {
    type: 'WITHDRAWAL_COMPLETED',
    title: 'Retrait effectué',
    message: `Votre retrait de ${amount} ${currency} a été effectué avec succès.`,
    metadata: { amount, currency },
  });
}

export async function notifyTransferSent(
  userId: string,
  amount: string,
  currency: string,
  recipientName: string
): Promise<void> {
  await createNotification(userId, {
    type: 'TRANSFER_SENT',
    title: 'Transfert envoyé',
    message: `Vous avez envoyé ${amount} ${currency} à ${recipientName}.`,
    metadata: { amount, currency, recipientName },
  });
}

export async function notifyTransferReceived(
  userId: string,
  amount: string,
  currency: string,
  senderName: string
): Promise<void> {
  await createNotification(userId, {
    type: 'TRANSFER_RECEIVED',
    title: 'Transfert reçu',
    message: `Vous avez reçu ${amount} ${currency} de ${senderName}.`,
    metadata: { amount, currency, senderName },
  });
}

export async function notifyPayment(
  userId: string,
  amount: string,
  currency: string,
  description: string
): Promise<void> {
  await createNotification(userId, {
    type: 'PAYMENT_COMPLETED',
    title: 'Paiement effectué',
    message: `Paiement de ${amount} ${currency} pour "${description}" confirmé.`,
    metadata: { amount, currency, description },
  });
}

export async function notifyKYCApproved(userId: string, level: string): Promise<void> {
  await createNotification(userId, {
    type: 'KYC_APPROVED',
    title: 'Vérification approuvée',
    message: `Votre vérification d'identité niveau ${level} a été approuvée. Vos limites ont été mises à jour.`,
    metadata: { level },
  });
}

export async function notifyKYCRejected(
  userId: string,
  level: string,
  reason: string
): Promise<void> {
  await createNotification(userId, {
    type: 'KYC_REJECTED',
    title: 'Vérification refusée',
    message: `Votre vérification niveau ${level} a été refusée. Raison : ${reason}. Veuillez soumettre à nouveau.`,
    metadata: { level, reason },
  });
}
