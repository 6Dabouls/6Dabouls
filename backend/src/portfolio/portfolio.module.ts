import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Investment } from '../investments/entities/investment.entity';
import { InvestmentReturn } from '../investments/entities/return.entity';
import { Transaction } from '../payments/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, InvestmentReturn, Transaction])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
