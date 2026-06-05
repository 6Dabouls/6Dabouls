import api from './api';
import { ExchangeRates } from '@/types';

export async function getExchangeRates(base = 'XOF'): Promise<ExchangeRates> {
  const res = await api.get('/currency/rates', { params: { base } });
  return res.data.data;
}

export async function getRate(from: string, to: string): Promise<number> {
  const res = await api.get(`/currency/rates/${from}/${to}`);
  return res.data.data.rate;
}

export async function convertCurrency(data: { amount: number; from: string; to: string }) {
  const res = await api.post('/currency/convert', data);
  return res.data.data;
}
