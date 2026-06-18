import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Investment } from './investment.entity';

@Entity('investment_returns')
export class InvestmentReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investmentId: string;

  @ManyToOne(() => Investment)
  @JoinColumn({ name: 'investmentId' })
  investment: Investment;

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

  @Column({ default: 'XOF' })
  currency: string;

  @Column()
  periodStart: Date;

  @Column()
  periodEnd: Date;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
