import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectStatus, EnergyType, RiskLevel } from '../../common/enums';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  coordinates: string;

  @Column()
  promoterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'promoterId' })
  promoter: User;

  @Column({ type: 'enum', enum: EnergyType })
  energyType: EnergyType;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.MEDIUM })
  riskLevel: RiskLevel;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalBudget: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  raisedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  expectedReturn: number;

  @Column()
  durationMonths: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  capacityMW: number;

  @Column({ nullable: true })
  annualProductionMWh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  fundingProgress: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 1 })
  minimumInvestment: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maximumInvestment: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ type: 'jsonb', nullable: true })
  videos: string[];

  @Column({ type: 'jsonb', nullable: true })
  documents: { name: string; url: string; type: string }[];

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ default: 0 })
  investorCount: number;

  @Column({ nullable: true })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
