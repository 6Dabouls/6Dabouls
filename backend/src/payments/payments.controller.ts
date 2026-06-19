import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet balance' })
  getWallet(@CurrentUser() user) {
    return this.service.getWalletBalance(user.id);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit funds' })
  deposit(@CurrentUser() user, @Body() dto: any) {
    return this.service.deposit(user.id, dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw funds' })
  withdraw(@CurrentUser() user, @Body() dto: any) {
    return this.service.withdraw(user.id, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(@CurrentUser() user, @Query('page') page: number, @Query('limit') limit: number, @Query('type') type: any) {
    return this.service.getTransactions(user.id, page, limit, type);
  }
}
