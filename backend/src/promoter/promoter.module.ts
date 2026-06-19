import { Module } from '@nestjs/common';
import { PromoterController } from './promoter.controller';
import { ProjectsModule } from '../projects/projects.module';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [ProjectsModule, InvestmentsModule],
  controllers: [PromoterController],
})
export class PromoterModule {}
