import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { KycStatus, DocumentType } from '../../common/enums';

@Entity('kyc_verifications')
export class KycVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Column({ type: 'enum', enum: DocumentType, nullable: true })
  documentType: DocumentType;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  documentFrontUrl: string;

  @Column({ nullable: true })
  documentBackUrl: string;

  @Column({ nullable: true })
  selfieUrl: string;

  @Column({ nullable: true })
  proofOfAddressUrl: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isAutoVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
