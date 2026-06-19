import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../common/enums';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private repo: Repository<Notification>) {}

  async create(userId: string, type: NotificationType, title: string, message: string, data?: any) {
    const notification = this.repo.create({ userId, type, title, message, data });
    return this.repo.save(notification);
  }

  getUserNotifications(userId: string, page = 1, limit = 20) {
    return this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async markAsRead(id: string, userId: string) {
    await this.repo.update({ id, userId }, { isRead: true, readAt: new Date() });
    return { message: 'Marked as read' };
  }

  async markAllAsRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    return { message: 'All notifications marked as read' };
  }

  getUnreadCount(userId: string) {
    return this.repo.count({ where: { userId, isRead: false } });
  }
}
