import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { KycVerification } from '../kyc/entities/kyc.entity';
import { Transaction } from '../payments/entities/transaction.entity';
import { Investment } from '../investments/entities/investment.entity';
import { ProjectStatus, PaymentStatus, KycStatus } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(KycVerification) private kycRepo: Repository<KycVerification>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(Investment) private investRepo: Repository<Investment>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalProjects, pendingKyc, pendingWithdrawals] = await Promise.all([
      this.usersRepo.count(),
      this.projectsRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
      this.kycRepo.count({ where: { status: KycStatus.UNDER_REVIEW } }),
      this.txRepo.count({ where: { status: PaymentStatus.PROCESSING } }),
    ]);

    const totalFunded = await this.projectsRepo
      .createQueryBuilder('p')
      .select('SUM(p.raisedAmount)', 'total')
      .getRawOne();

    const totalInvestments = await this.investRepo
      .createQueryBuilder('i')
      .select('SUM(i.amount)', 'total')
      .getRawOne();

    return {
      totalUsers,
      totalProjects,
      pendingKyc,
      pendingWithdrawals,
      totalFunded: totalFunded?.total || 0,
      totalInvestments: totalInvestments?.total || 0,
    };
  }

  banUser(userId: string, reason: string) {
    return this.usersRepo.update(userId, { isBanned: true, bannedReason: reason });
  }

  unbanUser(userId: string) {
    return this.usersRepo.update(userId, { isBanned: false, bannedReason: null });
  }

  getPendingWithdrawals(page = 1, limit = 20) {
    return this.txRepo.findAndCount({
      where: { status: PaymentStatus.PROCESSING },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  approveWithdrawal(txId: string) {
    return this.txRepo.update(txId, { status: PaymentStatus.COMPLETED, processedAt: new Date() });
  }

  rejectWithdrawal(txId: string, reason: string) {
    return this.txRepo.update(txId, { status: PaymentStatus.FAILED, failureReason: reason });
  }

  getRevenueReport(startDate: Date, endDate: Date) {
    return this.txRepo
      .createQueryBuilder('tx')
      .select(['tx.type', 'SUM(tx.amount) as total', 'COUNT(*) as count'])
      .where('tx.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('tx.status = :status', { status: PaymentStatus.COMPLETED })
      .groupBy('tx.type')
      .getRawMany();
  }
}
