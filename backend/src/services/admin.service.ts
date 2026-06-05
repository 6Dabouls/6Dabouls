import { UserStatus, KYCLevel } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers, activeUsers, newUsersToday, newUsersMonth,
    totalTransactions, completedTransactions,
    pendingKYC, openTickets,
    dailyVolume, monthlyVolume,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.transaction.count(),
    prisma.transaction.count({ where: { status: 'COMPLETED' } }),
    prisma.kYCDocument.count({ where: { status: 'PENDING' } }),
    prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startOfDay } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  // Last 7 days stats
  const dailyStats = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return prisma.transaction.count({
        where: { createdAt: { gte: date, lt: nextDate }, status: 'COMPLETED' },
      }).then((count) => ({ date: date.toISOString().split('T')[0], count }));
    })
  );

  return {
    totalUsers, activeUsers, newUsersToday, newUsersMonth,
    totalTransactions, completedTransactions,
    pendingKYC, openTickets,
    dailyVolume: Number(dailyVolume._sum.amount || 0),
    monthlyVolume: Number(monthlyVolume._sum.amount || 0),
    dailyStats: dailyStats.reverse(),
  };
}

export async function getUsers(filters: {
  status?: UserStatus;
  kycLevel?: KYCLevel;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.kycLevel) where.kycLevel = filters.kycLevel;
  if (filters.role) where.role = filters.role;
  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search } },
      {
        profile: {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, phone: true, role: true, status: true,
        kycLevel: true, createdAt: true, lastLoginAt: true,
        profile: { select: { firstName: true, lastName: true } },
        _count: { select: { wallets: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      wallets: true,
      kycDocuments: { orderBy: { createdAt: 'desc' } },
      cards: { where: { status: { not: 'CANCELLED' } } },
    },
  });

  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  const { password, twoFASecret, ...safeUser } = user;
  return safeUser;
}

export async function updateUserStatus(userId: string, status: UserStatus, adminId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Cannot modify admin users', 403);

  const updated = await prisma.user.update({ where: { id: userId }, data: { status } });

  await prisma.auditLog.create({
    data: {
      userId: adminId,
      action: 'USER_STATUS_UPDATED',
      resource: 'user',
      resourceId: userId,
      details: { oldStatus: user.status, newStatus: status },
    },
  });

  return updated;
}

export async function getDailyReport(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const [newUsers, transactions, volume, byType] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.transaction.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.transaction.aggregate({
      where: { createdAt: { gte: start, lte: end }, status: 'COMPLETED' },
      _sum: { amount: true, fee: true },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { createdAt: { gte: start, lte: end }, status: 'COMPLETED' },
      _count: { id: true },
      _sum: { amount: true },
    }),
  ]);

  return {
    date,
    newUsers,
    totalTransactions: transactions,
    totalVolume: Number(volume._sum.amount || 0),
    totalFees: Number(volume._sum.fee || 0),
    byType: byType.map((t) => ({
      type: t.type,
      count: t._count.id,
      volume: Number(t._sum.amount || 0),
    })),
  };
}

export async function getMonthlyReport(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const [newUsers, transactions, volume] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.transaction.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.transaction.aggregate({
      where: { createdAt: { gte: start, lte: end }, status: 'COMPLETED' },
      _sum: { amount: true, fee: true },
    }),
  ]);

  return {
    year, month,
    newUsers,
    totalTransactions: transactions,
    totalVolume: Number(volume._sum.amount || 0),
    totalFees: Number(volume._sum.fee || 0),
  };
}
