import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { InvestmentStatus } from '../../common/enums';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.PENDING })
  status: InvestmentStatus;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ownershipPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalReturnsReceived: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  expectedAnnualReturn: number;

  @Column({ nullable: true })
  maturityDate: Date;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringFrequency: string;

  @Column({ nullable: true })
  recurringAmount: number;

  @Column({ nullable: true })
  nextRecurringDate: Date;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
