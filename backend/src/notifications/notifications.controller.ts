import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getAll(@CurrentUser() user, @Query('page') page: number, @Query('limit') limit: number) {
    return this.service.getUserNotifications(user.id, page, limit);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  getUnreadCount(@CurrentUser() user) {
    return this.service.getUnreadCount(user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Param('id') id: string, @CurrentUser() user) {
    return this.service.markAsRead(id, user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user) {
    return this.service.markAllAsRead(user.id);
  }
}
