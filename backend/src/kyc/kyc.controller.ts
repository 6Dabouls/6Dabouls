import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(private service: KycService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  getStatus(@CurrentUser() user) {
    return this.service.getStatus(user.id);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  submit(@CurrentUser() user, @Body() dto: any) {
    return this.service.submitDocuments(user.id, dto);
  }
}
