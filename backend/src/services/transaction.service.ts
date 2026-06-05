import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function getTransactions(
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
  const page = Math.max(filters.page || 1, 1);
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
      include: {
        fromUser: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } },
        toUser: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getTransaction(userId: string, transactionId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: {
      fromUser: {
        select: { id: true, phone: true, email: true, profile: { select: { firstName: true, lastName: true } } },
      },
      toUser: {
        select: { id: true, phone: true, email: true, profile: { select: { firstName: true, lastName: true } } },
      },
    },
  });

  if (!transaction) throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  return transaction;
}

export async function getAdminTransactions(filters: {
  type?: string;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(filters.page || 1, 1);
  const limit = Math.min(filters.limit || 50, 200);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.userId) where.OR = [{ fromUserId: filters.userId }, { toUserId: filters.userId }];
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
      include: {
        fromUser: { select: { id: true, email: true, phone: true, profile: { select: { firstName: true, lastName: true } } } },
        toUser: { select: { id: true, email: true, phone: true, profile: { select: { firstName: true, lastName: true } } } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
