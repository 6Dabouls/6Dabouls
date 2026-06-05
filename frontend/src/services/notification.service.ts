import api from './api';
import { Notification, Pagination } from '@/types';

export async function getNotifications(page = 1, limit = 20): Promise<{ notifications: Notification[]; pagination: Pagination }> {
  const res = await api.get('/notifications', { params: { page, limit } });
  return { notifications: res.data.notifications || [], pagination: res.data.pagination };
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get('/notifications/unread-count');
  return res.data.data.count;
}

export async function markAsRead(id: string): Promise<void> {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.put('/notifications/read-all');
}
