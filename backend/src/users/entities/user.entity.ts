import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, OneToOne,
} from 'typeorm';
import { UserRole, KycStatus } from '../../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  kycStatus: KycStatus;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true, select: false })
  twoFactorSecret: string;

  @Column({ nullable: true, select: false })
  emailVerificationToken: string;

  @Column({ nullable: true, select: false })
  phoneVerificationCode: string;

  @Column({ nullable: true })
  phoneVerificationExpiry: Date;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  appleId: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true })
  bannedReason: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ nullable: true })
  preferredCurrency: string;

  @Column({ type: 'jsonb', nullable: true })
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
