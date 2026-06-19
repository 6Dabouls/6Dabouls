import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from '../projects/projects.service';
import { InvestmentsService } from '../investments/investments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('promoter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PROMOTER, UserRole.ADMIN)
@Controller('promoter')
export class PromoterController {
  constructor(
    private projectsService: ProjectsService,
    private investmentsService: InvestmentsService,
  ) {}

  @Get('projects')
  @ApiOperation({ summary: 'Get promoter projects' })
  getMyProjects(@CurrentUser() user) {
    return this.projectsService.findAll({});
  }

  @Post('projects')
  @ApiOperation({ summary: 'Submit new project' })
  submitProject(@CurrentUser() user, @Body() dto: any) {
    return this.projectsService.create(user.id, dto);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update project' })
  updateProject(@Param('id') id: string, @CurrentUser() user, @Body() dto: any) {
    return this.projectsService.update(id, user.id, user.role, dto);
  }

  @Post('projects/:id/updates')
  @ApiOperation({ summary: 'Publish project update' })
  publishUpdate(@Param('id') id: string, @CurrentUser() user, @Body() dto: any) {
    return this.projectsService.addUpdate(id, user.id, dto);
  }

  @Post('projects/:id/distribute-returns')
  @ApiOperation({ summary: 'Distribute returns to investors' })
  distributeReturns(
    @Param('id') id: string,
    @Body() dto: { amount: number; periodStart: string; periodEnd: string },
  ) {
    return this.investmentsService.distributeReturns(
      id,
      dto.amount,
      new Date(dto.periodStart),
      new Date(dto.periodEnd),
    );
  }
}
