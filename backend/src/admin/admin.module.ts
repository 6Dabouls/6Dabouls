import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { KycVerification } from '../kyc/entities/kyc.entity';
import { Transaction } from '../payments/entities/transaction.entity';
import { Investment } from '../investments/entities/investment.entity';
import { ProjectsModule } from '../projects/projects.module';
import { KycModule } from '../kyc/kyc.module';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, KycVerification, Transaction, Investment]),
    ProjectsModule,
    KycModule,
    InvestmentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
