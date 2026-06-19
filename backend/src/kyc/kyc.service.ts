import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycVerification } from './entities/kyc.entity';
import { User } from '../users/entities/user.entity';
import { KycStatus } from '../common/enums';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(KycVerification) private repo: Repository<KycVerification>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getStatus(userId: string) {
    const kyc = await this.repo.findOne({ where: { userId } });
    return kyc || { userId, status: KycStatus.PENDING };
  }

  async submitDocuments(userId: string, dto: any) {
    let kyc = await this.repo.findOne({ where: { userId } });

    if (kyc && kyc.status === KycStatus.APPROVED) {
      throw new BadRequestException('KYC already approved');
    }

    if (!kyc) {
      kyc = this.repo.create({ userId });
    }

    Object.assign(kyc, dto);
    kyc.status = KycStatus.UNDER_REVIEW;
    return this.repo.save(kyc);
  }

  async review(kycId: string, adminId: string, approved: boolean, reason?: string) {
    const kyc = await this.repo.findOne({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC record not found');

    kyc.status = approved ? KycStatus.APPROVED : KycStatus.REJECTED;
    kyc.reviewedBy = adminId;
    kyc.reviewedAt = new Date();
    if (!approved) kyc.rejectionReason = reason;

    await this.repo.save(kyc);
    await this.usersRepo.update(kyc.userId, { kycStatus: kyc.status });

    return kyc;
  }

  findPending(page = 1, limit = 20) {
    return this.repo.findAndCount({
      where: { status: KycStatus.UNDER_REVIEW },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });
  }
}
