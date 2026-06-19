import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { PaymentStatus, TransactionType, PaymentMethod } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async deposit(userId: string, dto: { amount: number; paymentMethod: PaymentMethod; currency?: string }) {
    if (dto.amount <= 0) throw new BadRequestException('Invalid amount');

    const tx = this.txRepo.create({
      userId,
      type: TransactionType.DEPOSIT,
      amount: dto.amount,
      currency: dto.currency || 'XOF',
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.PENDING,
      description: `Deposit via ${dto.paymentMethod}`,
      externalTransactionId: uuidv4(),
    });

    await this.txRepo.save(tx);

    // Simulate payment processing - in production, integrate with Stripe/Mobile Money
    setTimeout(async () => {
      await this.txRepo.update(tx.id, {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date(),
      });
      await this.usersRepo.update(userId, {
        walletBalance: () => `"walletBalance" + ${dto.amount}`,
      });
    }, 2000);

    return tx;
  }

  async withdraw(userId: string, dto: { amount: number; paymentMethod: PaymentMethod; accountDetails: any }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.walletBalance < dto.amount) throw new BadRequestException('Insufficient balance');

    const tx = this.txRepo.create({
      userId,
      type: TransactionType.WITHDRAWAL,
      amount: dto.amount,
      currency: 'XOF',
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.PROCESSING,
      description: 'Withdrawal request',
      metadata: { accountDetails: dto.accountDetails },
    });

    await this.txRepo.save(tx);
    await this.usersRepo.update(userId, {
      walletBalance: () => `"walletBalance" - ${dto.amount}`,
    });

    return tx;
  }

  getTransactions(userId: string, page = 1, limit = 20, type?: TransactionType) {
    const where: any = { userId };
    if (type) where.type = type;
    return this.txRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  getWalletBalance(userId: string) {
    return this.usersRepo.findOne({
      where: { id: userId },
      select: ['id', 'walletBalance', 'preferredCurrency'],
    });
  }

  findAllTransactions(page = 1, limit = 20, status?: PaymentStatus) {
    const where: any = {};
    if (status) where.status = status;
    return this.txRepo.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
