import { Request, Response, NextFunction } from 'express';
import { UserRole, KYCLevel } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        kycLevel: KYCLevel;
        status: string;
      };
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401, 'NO_TOKEN');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, kycLevel: true, status: true },
  });

  if (!user) throw new AppError('User not found', 401, 'USER_NOT_FOUND');
  if (user.status === 'SUSPENDED') throw new AppError('Account suspended', 403, 'ACCOUNT_SUSPENDED');
  if (user.status === 'CLOSED') throw new AppError('Account closed', 403, 'ACCOUNT_CLOSED');

  req.user = user;
  next();
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
    }
    next();
  };
}

export function requireKYC(level: KYCLevel) {
  const levels: Record<KYCLevel, number> = {
    NONE: 0,
    LEVEL_1: 1,
    LEVEL_2: 2,
    LEVEL_3: 3,
  };

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    if (levels[req.user.kycLevel] < levels[level]) {
      throw new AppError(
        `KYC level ${level} required for this operation`,
        403,
        'INSUFFICIENT_KYC'
      );
    }
    next();
  };
}

export function requireVerified(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) throw new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED');
  if (req.user.status === 'PENDING_VERIFICATION') {
    throw new AppError('Account not verified', 403, 'ACCOUNT_NOT_VERIFIED');
  }
  next();
}
