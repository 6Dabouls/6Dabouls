import api from './api';
import { ApiResponse, Card } from '@/types';

export async function getCards(): Promise<Card[]> {
  const res = await api.get<ApiResponse<Card[]>>('/cards');
  return res.data.data || [];
}

export async function getCard(id: string, reveal = false): Promise<Card> {
  const res = await api.get<ApiResponse<Card>>(`/cards/${id}`, { params: { reveal } });
  return res.data.data!;
}

export async function createVirtualCard(data: { cardholderName: string; currency?: string }): Promise<Card> {
  const res = await api.post<ApiResponse<Card>>('/cards/virtual', data);
  return res.data.data!;
}

export async function orderPhysicalCard(data: { cardholderName: string; deliveryAddress: string }): Promise<Card> {
  const res = await api.post<ApiResponse<Card>>('/cards/physical', data);
  return res.data.data!;
}

export async function updateCardStatus(id: string, status: 'ACTIVE' | 'BLOCKED'): Promise<Card> {
  const res = await api.put<ApiResponse<Card>>(`/cards/${id}/status`, { status });
  return res.data.data!;
}

export async function updateCardLimits(id: string, dailyLimit: number): Promise<Card> {
  const res = await api.put<ApiResponse<Card>>(`/cards/${id}/limits`, { dailyLimit });
  return res.data.data!;
}

export async function cancelCard(id: string): Promise<void> {
  await api.delete(`/cards/${id}`);
}
