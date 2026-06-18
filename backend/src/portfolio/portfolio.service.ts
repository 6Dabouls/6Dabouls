import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from '../investments/entities/investment.entity';
import { InvestmentReturn } from '../investments/entities/return.entity';
import { Transaction } from '../payments/entities/transaction.entity';
import { InvestmentStatus, TransactionType } from '../common/enums';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Investment) private investRepo: Repository<Investment>,
    @InjectRepository(InvestmentReturn) private returnsRepo: Repository<InvestmentReturn>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  async getSummary(userId: string) {
    const investments = await this.investRepo.find({
      where: { userId },
      relations: ['project'],
    });

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.totalReturnsReceived), 0);
    const activeInvestments = investments.filter((i) => i.status === InvestmentStatus.ACTIVE).length;

    const byEnergyType = investments.reduce((acc: any, inv) => {
      const type = inv.project?.energyType || 'unknown';
      acc[type] = (acc[type] || 0) + Number(inv.amount);
      return acc;
    }, {});

    const avgReturn = investments.length
      ? investments.reduce((sum, inv) => sum + Number(inv.expectedAnnualReturn || 0), 0) / investments.length
      : 0;

    return {
      totalInvested,
      totalReturns,
      netValue: totalInvested + totalReturns,
      activeInvestments,
      totalInvestments: investments.length,
      averageAnnualReturn: avgReturn,
      byEnergyType,
      investments,
    };
  }

  async getReturnsHistory(userId: string, page = 1, limit = 20) {
    return this.returnsRepo.findAndCount({
      where: { userId },
      relations: ['project', 'investment'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getTransactionHistory(userId: string, page = 1, limit = 20) {
    return this.txRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
