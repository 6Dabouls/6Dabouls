import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async updateProfile(userId: string, dto: any) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    user.password = await bcrypt.hash(newPassword, 12);
    await this.repo.save(user);
    return { message: 'Password changed successfully' };
  }

  async updateNotificationPreferences(userId: string, preferences: any) {
    await this.repo.update(userId, { notificationPreferences: preferences });
    return { message: 'Preferences updated' };
  }

  findAll(page = 1, limit = 20, search?: string) {
    const qb = this.repo.createQueryBuilder('user');
    if (search) {
      qb.where(
        'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search}%` },
      );
    }
    return qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
