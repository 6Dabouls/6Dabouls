import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, wallets: { select: { currency: true, balance: true, status: true } } },
  });

  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  const { password, twoFASecret, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  }
) {
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  return profile;
}

export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}

export async function uploadProfilePicture(userId: string, filePath: string): Promise<string> {
  const url = `/${filePath.replace(/\\/g, '/')}`;
  await prisma.profile.update({ where: { userId }, data: { profilePicture: url } });
  return url;
}

export async function deleteAccount(userId: string, password: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid password', 401, 'INVALID_PASSWORD');

  // Check no pending transactions
  const pending = await prisma.transaction.count({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
      status: { in: ['PENDING', 'PROCESSING'] },
    },
  });
  if (pending > 0) {
    throw new AppError(
      'Cannot delete account with pending transactions',
      400,
      'PENDING_TRANSACTIONS'
    );
  }

  await prisma.user.update({ where: { id: userId }, data: { status: 'CLOSED' } });
}

export async function searchUsers(query: string, excludeUserId: string) {
  if (!query || query.length < 3) return [];

  const users = await prisma.user.findMany({
    where: {
      id: { not: excludeUserId },
      status: 'ACTIVE',
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query } },
      ],
    },
    select: {
      id: true,
      email: true,
      phone: true,
      profile: { select: { firstName: true, lastName: true, profilePicture: true } },
    },
    take: 10,
  });

  return users;
}
