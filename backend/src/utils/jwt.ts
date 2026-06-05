import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
}

export function generateAccessToken(userId: string, role: UserRole): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not configured');

  const payload: AccessTokenPayload = { userId, role, type: 'access' };
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'],
    issuer: 'neero-api',
    audience: 'neero-client',
  };

  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');

  const payload: RefreshTokenPayload = { userId, type: 'refresh' };
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    issuer: 'neero-api',
    audience: 'neero-client',
  };

  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not configured');

  const decoded = jwt.verify(token, secret, {
    issuer: 'neero-api',
    audience: 'neero-client',
  }) as AccessTokenPayload;

  if (decoded.type !== 'access') {
    throw new jwt.JsonWebTokenError('Invalid token type');
  }

  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');

  const decoded = jwt.verify(token, secret, {
    issuer: 'neero-api',
    audience: 'neero-client',
  }) as RefreshTokenPayload;

  if (decoded.type !== 'refresh') {
    throw new jwt.JsonWebTokenError('Invalid token type');
  }

  return decoded;
}

export function getRefreshTokenExpiry(): Date {
  const days = parseInt((process.env.JWT_REFRESH_EXPIRES_IN || '7d').replace('d', ''));
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
