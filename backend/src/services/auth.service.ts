import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import { generateOTP, hashOTP, verifyOTP as verifyOTPCode, calculateExpiryTime, isExpired } from '../utils/otp';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/email';
import { logger } from '../utils/logger';

export interface RegisterDTO {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
  twoFAToken?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register(data: RegisterDTO): Promise<{ user: any; tokens: AuthTokens }> {
  if (!data.email && !data.phone) {
    throw new AppError('Email or phone is required', 400, 'MISSING_IDENTIFIER');
  }

  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  if (data.phone) {
    const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existing) throw new AppError('Phone already registered', 409, 'PHONE_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      kycLevel: 'LEVEL_1',
      status: 'ACTIVE',
      phoneVerified: !!data.phone,
      emailVerified: false,
      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
      wallets: {
        create: { currency: 'XOF', balance: 0 },
      },
    },
    include: { profile: true, wallets: true },
  });

  const tokens = await generateTokens(user.id, user.role, {});

  if (data.email && (data.firstName || data.lastName)) {
    sendWelcomeEmail(data.email, data.firstName || '').catch((e) =>
      logger.error('Welcome email failed:', e)
    );
  }

  await logAudit(user.id, 'USER_REGISTERED', 'user', user.id);

  const { password: _, twoFASecret: __, ...safeUser } = user;
  return { user: safeUser, tokens };
}

export async function login(data: LoginDTO): Promise<{ user: any; tokens: AuthTokens; requiresTwoFA?: boolean }> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.identifier },
        { phone: data.identifier },
      ],
    },
    include: { profile: true },
  });

  if (!user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  if (user.lockedUntil && new Date() < user.lockedUntil) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account locked. Try again in ${minutesLeft} minutes`,
      403,
      'ACCOUNT_LOCKED'
    );
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    const failedCount = user.failedLoginCount + 1;
    const updates: any = { failedLoginCount: failedCount };
    if (failedCount >= 5) {
      updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await prisma.user.update({ where: { id: user.id }, data: updates });
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  if (user.status === 'SUSPENDED') throw new AppError('Account suspended', 403, 'ACCOUNT_SUSPENDED');
  if (user.status === 'CLOSED') throw new AppError('Account closed', 403, 'ACCOUNT_CLOSED');

  if (user.twoFAEnabled) {
    if (!data.twoFAToken) {
      return { user: null, tokens: { accessToken: '', refreshToken: '' }, requiresTwoFA: true };
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFASecret!,
      encoding: 'base32',
      token: data.twoFAToken,
      window: 1,
    });
    if (!valid) throw new AppError('Invalid 2FA token', 401, 'INVALID_2FA');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: data.ipAddress,
    },
  });

  const tokens = await generateTokens(user.id, user.role, {
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });

  await logAudit(user.id, 'USER_LOGIN', 'user', user.id, { ip: data.ipAddress });

  const { password: _, twoFASecret: __, ...safeUser } = user;
  return { user: safeUser, tokens };
}

export async function logout(refreshToken: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
}

export async function refreshTokens(
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
): Promise<AuthTokens> {
  const payload = verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.revoked || new Date() > storedToken.expiresAt) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new AppError('User not found', 401, 'USER_NOT_FOUND');

  await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { revoked: true } });

  return generateTokens(user.id, user.role, { ipAddress, userAgent });
}

export async function sendOTP(userId: string, type: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  await prisma.oTPCode.deleteMany({ where: { userId, type } });

  const otp = generateOTP();
  const hashedCode = await hashOTP(otp);
  const expiresAt = calculateExpiryTime(10);

  await prisma.oTPCode.create({
    data: { userId, code: hashedCode, type, expiresAt },
  });

  if (user.email) {
    await sendOTPEmail(user.email, otp, type).catch((e) =>
      logger.error('OTP email failed:', e)
    );
  }

  logger.info(`OTP ${type} generated for user ${userId}: ${otp} (dev only)`);
}

export async function verifyOTP(userId: string, code: string, type: string): Promise<void> {
  const otpRecord = await prisma.oTPCode.findFirst({
    where: { userId, type, used: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) throw new AppError('OTP not found or already used', 400, 'INVALID_OTP');
  if (isExpired(otpRecord.expiresAt)) throw new AppError('OTP expired', 400, 'OTP_EXPIRED');

  const valid = await verifyOTPCode(code, otpRecord.code);
  if (!valid) throw new AppError('Invalid OTP', 400, 'INVALID_OTP');

  await prisma.oTPCode.update({ where: { id: otpRecord.id }, data: { used: true } });

  if (type === 'phone_verification') {
    await prisma.user.update({
      where: { id: userId },
      data: { phoneVerified: true, status: 'ACTIVE' },
    });
  } else if (type === 'email_verification') {
    await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
  }
}

export async function forgotPassword(identifier: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });

  if (!user) return; // Don't reveal if user exists

  await sendOTP(user.id, 'reset');
}

export async function resetPassword(
  identifier: string,
  otp: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });

  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  await verifyOTP(user.id, otp, 'reset');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, failedLoginCount: 0, lockedUntil: null },
  });

  // Revoke all refresh tokens
  await prisma.refreshToken.updateMany({
    where: { userId: user.id },
    data: { revoked: true },
  });

  await logAudit(user.id, 'PASSWORD_RESET', 'user', user.id);
}

export async function setup2FA(userId: string): Promise<{ secret: string; qrCodeUrl: string; otpAuthUrl: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const secret = speakeasy.generateSecret({
    name: `Neero (${user.email || user.phone})`,
    issuer: 'Neero',
    length: 20,
  });

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

  // Store temporarily (will be confirmed on enable)
  await prisma.user.update({
    where: { id: userId },
    data: { twoFASecret: secret.base32 },
  });

  return {
    secret: secret.base32,
    qrCodeUrl,
    otpAuthUrl: secret.otpauth_url!,
  };
}

export async function enable2FA(userId: string, token: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFASecret) {
    throw new AppError('2FA setup required first', 400, '2FA_NOT_SETUP');
  }

  const valid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!valid) throw new AppError('Invalid 2FA token', 400, 'INVALID_2FA');

  await prisma.user.update({ where: { id: userId }, data: { twoFAEnabled: true } });
  await logAudit(userId, '2FA_ENABLED', 'user', userId);
}

export async function disable2FA(userId: string, password: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new AppError('Invalid password', 401, 'INVALID_PASSWORD');

  await prisma.user.update({
    where: { id: userId },
    data: { twoFAEnabled: false, twoFASecret: null },
  });
  await logAudit(userId, '2FA_DISABLED', 'user', userId);
}

async function generateTokens(
  userId: string,
  role: any,
  meta: { ipAddress?: string; userAgent?: string }
): Promise<AuthTokens> {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  });

  return { accessToken, refreshToken };
}

async function logAudit(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { userId, action, resource, resourceId, details: details || {} },
    });
  } catch (e) {
    logger.error('Audit log failed:', e);
  }
}
