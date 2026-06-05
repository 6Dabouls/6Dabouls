import api from './api';
import { ApiResponse, AuthTokens, User } from '@/types';

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
  twoFAToken?: string;
}

export async function register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
  const res = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data);
  return res.data.data!;
}

export async function login(data: LoginData): Promise<{ user: User; tokens: AuthTokens; requiresTwoFA?: boolean }> {
  const res = await api.post<ApiResponse<{ user: User; tokens: AuthTokens; requiresTwoFA?: boolean }>>('/auth/login', data);
  return res.data.data!;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}

export async function sendOTP(type: string): Promise<void> {
  await api.post('/auth/send-otp', { type });
}

export async function verifyOTP(code: string, type: string): Promise<void> {
  await api.post('/auth/verify-otp', { code, type });
}

export async function forgotPassword(identifier: string): Promise<void> {
  await api.post('/auth/forgot-password', { identifier });
}

export async function resetPassword(identifier: string, otp: string, newPassword: string): Promise<void> {
  await api.post('/auth/reset-password', { identifier, otp, newPassword });
}

export async function setup2FA(): Promise<{ secret: string; qrCodeUrl: string }> {
  const res = await api.get<ApiResponse<{ secret: string; qrCodeUrl: string }>>('/auth/2fa/setup');
  return res.data.data!;
}

export async function enable2FA(token: string): Promise<void> {
  await api.post('/auth/2fa/enable', { token });
}

export async function disable2FA(password: string): Promise<void> {
  await api.post('/auth/2fa/disable', { password });
}
