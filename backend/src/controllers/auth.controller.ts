import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';

function handleValidation(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR');
  }
}

export const registerValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  body('phone').optional().matches(/^\+?[0-9]{8,15}$/).withMessage('Invalid phone number'),
];

export async function register(req: Request, res: Response) {
  handleValidation(req);
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
}

export const loginValidation = [
  body('identifier').notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export async function login(req: Request, res: Response) {
  handleValidation(req);
  const result = await authService.login({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  if (result.requiresTwoFA) {
    res.json({ success: true, data: { requiresTwoFA: true } });
    return;
  }

  res.json({ success: true, data: result });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.json({ success: true, data: { message: 'Logged out successfully' } });
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  const tokens = await authService.refreshTokens(refreshToken, req.ip, req.get('user-agent'));
  res.json({ success: true, data: tokens });
}

export async function sendOTP(req: Request, res: Response) {
  const { type } = req.body;
  if (!['phone_verification', 'email_verification', 'reset'].includes(type)) {
    throw new AppError('Invalid OTP type', 400, 'INVALID_OTP_TYPE');
  }
  await authService.sendOTP(req.user!.id, type);
  res.json({ success: true, data: { message: 'OTP sent successfully' } });
}

export async function verifyOTP(req: Request, res: Response) {
  const { code, type } = req.body;
  if (!code || !type) throw new AppError('Code and type are required', 400);
  await authService.verifyOTP(req.user!.id, code, type);
  res.json({ success: true, data: { message: 'OTP verified successfully' } });
}

export async function forgotPassword(req: Request, res: Response) {
  const { identifier } = req.body;
  if (!identifier) throw new AppError('Email or phone is required', 400);
  await authService.forgotPassword(identifier);
  res.json({ success: true, data: { message: 'If the account exists, an OTP has been sent' } });
}

export async function resetPassword(req: Request, res: Response) {
  const { identifier, otp, newPassword } = req.body;
  if (!identifier || !otp || !newPassword) {
    throw new AppError('identifier, otp, and newPassword are required', 400);
  }
  if (newPassword.length < 8) throw new AppError('Password must be at least 8 characters', 400);
  await authService.resetPassword(identifier, otp, newPassword);
  res.json({ success: true, data: { message: 'Password reset successfully' } });
}

export async function setup2FA(req: Request, res: Response) {
  const result = await authService.setup2FA(req.user!.id);
  res.json({ success: true, data: result });
}

export async function enable2FA(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) throw new AppError('2FA token is required', 400);
  await authService.enable2FA(req.user!.id, token);
  res.json({ success: true, data: { message: '2FA enabled successfully' } });
}

export async function disable2FA(req: Request, res: Response) {
  const { password } = req.body;
  if (!password) throw new AppError('Password is required', 400);
  await authService.disable2FA(req.user!.id, password);
  res.json({ success: true, data: { message: '2FA disabled successfully' } });
}
