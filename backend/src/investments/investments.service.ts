import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { InvestmentReturn } from './entities/return.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { InvestmentStatus, ProjectStatus, KycStatus } from '../common/enums';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment) private repo: Repository<Investment>,
    @InjectRepository(InvestmentReturn) private returnsRepo: Repository<InvestmentReturn>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async invest(userId: string, dto: { projectId: string; amount: number; isRecurring?: boolean; recurringFrequency?: string }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required before investing');
    }

    const project = await this.projectsRepo.findOne({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Project is not accepting investments');
    }

    if (dto.amount < project.minimumInvestment) {
      throw new BadRequestException(`Minimum investment is ${project.minimumInvestment}`);
    }
    if (project.maximumInvestment && dto.amount > project.maximumInvestment) {
      throw new BadRequestException(`Maximum investment is ${project.maximumInvestment}`);
    }

    const remaining = project.targetAmount - project.raisedAmount;
    if (dto.amount > remaining) {
      throw new BadRequestException(`Only ${remaining} remaining to fund this project`);
    }

    if (user.walletBalance < dto.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const ownershipPercentage = (dto.amount / project.targetAmount) * 100;
    const maturityDate = new Date(project.endDate);

    const investment = this.repo.create({
      userId,
      projectId: dto.projectId,
      amount: dto.amount,
      currency: project.currency || 'XOF',
      status: InvestmentStatus.ACTIVE,
      ownershipPercentage,
      expectedAnnualReturn: project.expectedReturn,
      maturityDate,
      isRecurring: dto.isRecurring || false,
      recurringFrequency: dto.recurringFrequency,
    });

    await this.repo.save(investment);

    // Update project raised amount
    project.raisedAmount += dto.amount;
    project.investorCount += 1;
    project.fundingProgress = (project.raisedAmount / project.targetAmount) * 100;
    if (project.raisedAmount >= project.targetAmount) {
      project.status = ProjectStatus.FUNDED;
    }
    await this.projectsRepo.save(project);

    // Deduct from user wallet
    await this.usersRepo.update(userId, { walletBalance: () => `"walletBalance" - ${dto.amount}` });

    return investment;
  }

  getUserInvestments(userId: string, page = 1, limit = 10) {
    return this.repo.findAndCount({
      where: { userId },
      relations: ['project'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getInvestmentById(id: string, userId: string) {
    const investment = await this.repo.findOne({
      where: { id },
      relations: ['project', 'user'],
    });
    if (!investment) throw new NotFoundException('Investment not found');
    if (investment.userId !== userId) throw new ForbiddenException();
    return investment;
  }

  getReturns(investmentId: string) {
    return this.returnsRepo.find({
      where: { investmentId },
      order: { createdAt: 'DESC' },
    });
  }

  async distributeReturns(projectId: string, amount: number, periodStart: Date, periodEnd: Date) {
    const investments = await this.repo.find({
      where: { projectId, status: InvestmentStatus.ACTIVE },
    });

    const returns = investments.map((inv) => {
      const returnAmount = (inv.ownershipPercentage / 100) * amount;
      return this.returnsRepo.create({
        investmentId: inv.id,
        userId: inv.userId,
        projectId,
        amount: returnAmount,
        currency: inv.currency,
        periodStart,
        periodEnd,
      });
    });

    await this.returnsRepo.save(returns);

    // Credit users' wallets
    for (const ret of returns) {
      await this.usersRepo.update(ret.userId, {
        walletBalance: () => `"walletBalance" + ${ret.amount}`,
      });
      await this.repo.update(ret.investmentId, {
        totalReturnsReceived: () => `"totalReturnsReceived" + ${ret.amount}`,
      });
    }

    return returns;
  }
}
