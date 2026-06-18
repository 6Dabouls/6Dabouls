import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, EnergyType, RiskLevel } from '../common/enums';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active projects with filters' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects' })
  getFeatured() {
    return this.service.getFeatured();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/updates')
  @ApiOperation({ summary: 'Get project news and updates' })
  getUpdates(@Param('id') id: string) {
    return this.service.getUpdates(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROMOTER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new project (Promoter)' })
  create(@CurrentUser() user, @Body() dto: any) {
    return this.service.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id') id: string, @CurrentUser() user, @Body() dto: any) {
    return this.service.update(id, user.id, user.role, dto);
  }

  @Post(':id/updates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROMOTER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add project update (Promoter)' })
  addUpdate(@Param('id') id: string, @CurrentUser() user, @Body() dto: any) {
    return this.service.addUpdate(id, user.id, dto);
  }
}
