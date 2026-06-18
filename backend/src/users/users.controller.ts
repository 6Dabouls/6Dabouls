import { Controller, Get, Put, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user) {
    return user;
  }

  @Put('me')
  @ApiOperation({ summary: 'Update user profile' })
  updateMe(@CurrentUser() user, @Body() dto: any) {
    return this.service.updateProfile(user.id, dto);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser() user, @Body() dto: any) {
    return this.service.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }

  @Put('me/notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateNotifications(@CurrentUser() user, @Body() dto: any) {
    return this.service.updateNotificationPreferences(user.id, dto);
  }
}
