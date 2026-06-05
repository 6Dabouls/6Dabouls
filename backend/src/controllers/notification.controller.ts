import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export async function getNotifications(req: Request, res: Response) {
  const { page, limit } = req.query;
  const result = await notificationService.getNotifications(
    req.user!.id,
    page ? parseInt(page as string) : 1,
    limit ? parseInt(limit as string) : 20
  );
  res.json({ success: true, ...result });
}

export async function getUnreadCount(req: Request, res: Response) {
  const count = await notificationService.getUnreadCount(req.user!.id);
  res.json({ success: true, data: { count } });
}

export async function markAsRead(req: Request, res: Response) {
  await notificationService.markAsRead(req.user!.id, req.params.id);
  res.json({ success: true, data: { message: 'Notification marked as read' } });
}

export async function markAllAsRead(req: Request, res: Response) {
  await notificationService.markAllAsRead(req.user!.id);
  res.json({ success: true, data: { message: 'All notifications marked as read' } });
}

export async function deleteNotification(req: Request, res: Response) {
  await notificationService.deleteNotification(req.user!.id, req.params.id);
  res.json({ success: true, data: { message: 'Notification deleted' } });
}
