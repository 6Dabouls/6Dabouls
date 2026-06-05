import api from './api';
import { Transaction, Pagination } from '@/types';

export async function getTransactions(filters?: {
  type?: string; status?: string; currency?: string;
  startDate?: string; endDate?: string; page?: number; limit?: number;
}): Promise<{ transactions: Transaction[]; pagination: Pagination }> {
  const res = await api.get('/transactions', { params: filters });
  return { transactions: res.data.transactions || [], pagination: res.data.pagination };
}

export async function getTransaction(id: string): Promise<Transaction> {
  const res = await api.get(`/transactions/${id}`);
  return res.data.data;
}
