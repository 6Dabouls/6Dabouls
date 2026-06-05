import api from './api';
import { ApiResponse, Wallet, Transaction, Pagination } from '@/types';

export async function getWallets(): Promise<Wallet[]> {
  const res = await api.get<ApiResponse<Wallet[]>>('/wallet');
  return res.data.data || [];
}

export async function getWallet(currency: string): Promise<Wallet> {
  const res = await api.get<ApiResponse<Wallet>>(`/wallet/${currency}`);
  return res.data.data!;
}

export async function deposit(data: {
  amount: number; currency: string; provider: string; phone: string; description?: string;
}): Promise<Transaction> {
  const res = await api.post<ApiResponse<Transaction>>('/wallet/deposit', data);
  return res.data.data!;
}

export async function withdraw(data: {
  amount: number; currency: string; provider: string; phone: string; description?: string;
}): Promise<Transaction> {
  const res = await api.post<ApiResponse<Transaction>>('/wallet/withdraw', data);
  return res.data.data!;
}

export async function transfer(data: {
  amount: number; currency: string; recipientIdentifier: string; description?: string;
}): Promise<{ amount: number; fee: number; currency: string; recipient: { id: string; name: string } }> {
  const res = await api.post('/wallet/transfer', data);
  return res.data.data;
}

export async function getTransactionHistory(filters?: {
  type?: string; status?: string; currency?: string;
  startDate?: string; endDate?: string; page?: number; limit?: number;
}): Promise<{ transactions: Transaction[]; pagination: Pagination }> {
  const res = await api.get('/wallet/transactions', { params: filters });
  return { transactions: res.data.transactions || [], pagination: res.data.pagination };
}

export async function createWallet(currency: string): Promise<Wallet> {
  const res = await api.post<ApiResponse<Wallet>>('/wallet', { currency });
  return res.data.data!;
}
