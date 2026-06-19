import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ProjectsService } from '../projects/projects.service';
import { KycService } from '../kyc/kyc.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private projectsService: ProjectsService,
    private kycService: KycService,
    private usersService: UsersService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard statistics' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  getUsers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
    return this.usersService.findAll(page, limit, search);
  }

  @Put('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  banUser(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.banUser(id, dto.reason);
  }

  @Put('users/:id/unban')
  @ApiOperation({ summary: 'Unban a user' })
  unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Get('projects/pending')
  @ApiOperation({ summary: 'List pending projects' })
  getPendingProjects() {
    return this.projectsService.findAll({ status: 'pending_review' as any });
  }

  @Put('projects/:id/approve')
  @ApiOperation({ summary: 'Approve a project' })
  approveProject(@Param('id') id: string, @CurrentUser() user) {
    return this.projectsService.approve(id, user.id);
  }

  @Put('projects/:id/reject')
  @ApiOperation({ summary: 'Reject a project' })
  rejectProject(@Param('id') id: string, @CurrentUser() user, @Body() dto: { reason: string }) {
    return this.projectsService.reject(id, user.id, dto.reason);
  }

  @Get('kyc/pending')
  @ApiOperation({ summary: 'List pending KYC verifications' })
  getPendingKyc(@Query('page') page: number, @Query('limit') limit: number) {
    return this.kycService.findPending(page, limit);
  }

  @Put('kyc/:id/review')
  @ApiOperation({ summary: 'Review KYC submission' })
  reviewKyc(@Param('id') id: string, @CurrentUser() user, @Body() dto: { approved: boolean; reason?: string }) {
    return this.kycService.review(id, user.id, dto.approved, dto.reason);
  }

  @Get('withdrawals/pending')
  @ApiOperation({ summary: 'List pending withdrawals' })
  getPendingWithdrawals(@Query('page') page: number) {
    return this.adminService.getPendingWithdrawals(page);
  }

  @Put('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal' })
  approveWithdrawal(@Param('id') id: string) {
    return this.adminService.approveWithdrawal(id);
  }

  @Put('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal' })
  rejectWithdrawal(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.rejectWithdrawal(id, dto.reason);
  }

  @Get('reports/revenue')
  @ApiOperation({ summary: 'Revenue report' })
  getRevenueReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.adminService.getRevenueReport(new Date(startDate), new Date(endDate));
  }
}
