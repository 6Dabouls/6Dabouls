import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('investments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private service: InvestmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Invest in a project' })
  invest(@CurrentUser() user, @Body() dto: any) {
    return this.service.invest(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user investments' })
  getUserInvestments(@CurrentUser() user, @Query('page') page: number, @Query('limit') limit: number) {
    return this.service.getUserInvestments(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get investment details' })
  getOne(@Param('id') id: string, @CurrentUser() user) {
    return this.service.getInvestmentById(id, user.id);
  }

  @Get(':id/returns')
  @ApiOperation({ summary: 'Get investment returns history' })
  getReturns(@Param('id') id: string) {
    return this.service.getReturns(id);
  }
}
