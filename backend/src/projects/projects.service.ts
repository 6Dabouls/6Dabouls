import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectUpdate } from './entities/project-update.entity';
import { ProjectStatus, EnergyType, RiskLevel, UserRole } from '../common/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    @InjectRepository(ProjectUpdate) private updatesRepo: Repository<ProjectUpdate>,
  ) {}

  async findAll(filters: {
    page?: number;
    limit?: number;
    country?: string;
    region?: string;
    energyType?: EnergyType;
    riskLevel?: RiskLevel;
    minReturn?: number;
    maxReturn?: number;
    minDuration?: number;
    maxDuration?: number;
    status?: ProjectStatus;
    search?: string;
  }) {
    const { page = 1, limit = 12 } = filters;
    const qb = this.repo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.promoter', 'promoter');

    if (filters.status) qb.andWhere('project.status = :status', { status: filters.status });
    else qb.andWhere('project.status = :status', { status: ProjectStatus.ACTIVE });

    if (filters.country) qb.andWhere('project.country = :country', { country: filters.country });
    if (filters.region) qb.andWhere('project.region ILIKE :region', { region: `%${filters.region}%` });
    if (filters.energyType) qb.andWhere('project.energyType = :energyType', { energyType: filters.energyType });
    if (filters.riskLevel) qb.andWhere('project.riskLevel = :riskLevel', { riskLevel: filters.riskLevel });
    if (filters.minReturn) qb.andWhere('project.expectedReturn >= :minReturn', { minReturn: filters.minReturn });
    if (filters.maxReturn) qb.andWhere('project.expectedReturn <= :maxReturn', { maxReturn: filters.maxReturn });
    if (filters.search) {
      qb.andWhere('project.name ILIKE :search OR project.description ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    return qb
      .orderBy('project.isFeatured', 'DESC')
      .addOrderBy('project.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findOne(id: string) {
    const project = await this.repo.findOne({
      where: { id },
      relations: ['promoter'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(promoterId: string, dto: any) {
    const project = this.repo.create({ ...dto, promoterId, status: ProjectStatus.PENDING_REVIEW });
    return this.repo.save(project);
  }

  async update(id: string, userId: string, userRole: UserRole, dto: any) {
    const project = await this.findOne(id);
    if (project.promoterId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Cannot update this project');
    }
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async approve(id: string, adminId: string) {
    const project = await this.findOne(id);
    project.status = ProjectStatus.ACTIVE;
    project.reviewedBy = adminId;
    project.reviewedAt = new Date();
    return this.repo.save(project);
  }

  async reject(id: string, adminId: string, reason: string) {
    const project = await this.findOne(id);
    project.status = ProjectStatus.CANCELLED;
    project.reviewedBy = adminId;
    project.reviewedAt = new Date();
    project.rejectionReason = reason;
    return this.repo.save(project);
  }

  async addUpdate(projectId: string, authorId: string, dto: any) {
    const project = await this.findOne(projectId);
    const update = this.updatesRepo.create({ ...dto, projectId, authorId });
    return this.updatesRepo.save(update);
  }

  getUpdates(projectId: string) {
    return this.updatesRepo.find({
      where: { projectId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  getFeatured() {
    return this.repo.find({
      where: { status: ProjectStatus.ACTIVE, isFeatured: true },
      relations: ['promoter'],
      take: 6,
    });
  }

  getStats() {
    return this.repo
      .createQueryBuilder('p')
      .select([
        'COUNT(*) as total',
        'SUM(p.raisedAmount) as totalRaised',
        'SUM(p.targetAmount) as totalTarget',
        'COUNT(DISTINCT p.energyType) as energyTypes',
      ])
      .where('p.status = :status', { status: ProjectStatus.ACTIVE })
      .getRawOne();
  }
}
