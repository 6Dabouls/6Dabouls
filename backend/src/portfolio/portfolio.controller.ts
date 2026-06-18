import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private service: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get portfolio summary' })
  getSummary(@CurrentUser() user) {
    return this.service.getSummary(user.id);
  }

  @Get('returns')
  @ApiOperation({ summary: 'Get returns history' })
  getReturns(@CurrentUser() user, @Query('page') page: number, @Query('limit') limit: number) {
    return this.service.getReturnsHistory(user.id, page, limit);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(@CurrentUser() user, @Query('page') page: number, @Query('limit') limit: number) {
    return this.service.getTransactionHistory(user.id, page, limit);
  }
}
