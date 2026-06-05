import { KYCDocumentType } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { notifyKYCApproved, notifyKYCRejected } from './notification.service';
import { logger } from '../utils/logger';

export async function getKYCStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycLevel: true, phoneVerified: true, emailVerified: true },
  });
  if (!user) throw new AppError('User not found', 404);

  const documents = await prisma.kYCDocument.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return { kycLevel: user.kycLevel, phoneVerified: user.phoneVerified, documents };
}

export async function submitLevel2(
  userId: string,
  files: { idDocumentPath?: string; selfiePath?: string },
  documentType: KYCDocumentType = 'NATIONAL_ID'
) {
  if (!files.idDocumentPath || !files.selfiePath) {
    throw new AppError('Both ID document and selfie are required', 400, 'MISSING_FILES');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (user.kycLevel === 'LEVEL_2' || user.kycLevel === 'LEVEL_3') {
    const pending = await prisma.kYCDocument.findFirst({
      where: { userId, status: 'PENDING', type: { in: ['NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE'] } },
    });
    if (pending) throw new AppError('KYC document already under review', 400, 'ALREADY_PENDING');
  }

  await prisma.$transaction([
    prisma.kYCDocument.create({
      data: {
        userId,
        type: documentType,
        fileUrl: `/${files.idDocumentPath.replace(/\\/g, '/')}`,
        status: 'PENDING',
      },
    }),
    prisma.kYCDocument.create({
      data: {
        userId,
        type: 'SELFIE',
        fileUrl: `/${files.selfiePath.replace(/\\/g, '/')}`,
        status: 'PENDING',
      },
    }),
  ]);

  logger.info(`KYC Level 2 submitted by user ${userId}`);
}

export async function submitLevel3(
  userId: string,
  filePath: string,
  address: string
) {
  if (!filePath) throw new AppError('Proof of address document required', 400, 'MISSING_FILE');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (user.kycLevel !== 'LEVEL_2') {
    throw new AppError('Level 2 KYC must be approved first', 400, 'LEVEL_2_REQUIRED');
  }

  const pending = await prisma.kYCDocument.findFirst({
    where: { userId, status: 'PENDING', type: 'PROOF_OF_ADDRESS' },
  });
  if (pending) throw new AppError('Address verification already under review', 400, 'ALREADY_PENDING');

  await Promise.all([
    prisma.kYCDocument.create({
      data: {
        userId,
        type: 'PROOF_OF_ADDRESS',
        fileUrl: `/${filePath.replace(/\\/g, '/')}`,
        status: 'PENDING',
      },
    }),
    prisma.profile.update({
      where: { userId },
      data: { address },
    }),
  ]);

  logger.info(`KYC Level 3 submitted by user ${userId}`);
}

export async function validateDocument(documentId: string, adminId: string) {
  const document = await prisma.kYCDocument.findUnique({
    where: { id: documentId },
    include: { user: { select: { id: true, kycLevel: true } } },
  });

  if (!document) throw new AppError('Document not found', 404);
  if (document.status !== 'PENDING') {
    throw new AppError('Document already reviewed', 400, 'ALREADY_REVIEWED');
  }

  await prisma.kYCDocument.update({
    where: { id: documentId },
    data: { status: 'APPROVED', reviewedBy: adminId, reviewedAt: new Date() },
  });

  // Check if we should upgrade KYC level
  const userId = document.userId;
  const currentLevel = document.user.kycLevel;
  let newLevel = currentLevel;

  if (currentLevel === 'LEVEL_1' && ['NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE'].includes(document.type)) {
    const hasSelfie = await prisma.kYCDocument.findFirst({
      where: { userId, type: 'SELFIE', status: 'APPROVED' },
    });
    if (hasSelfie) newLevel = 'LEVEL_2';
  } else if (currentLevel === 'LEVEL_2' && document.type === 'PROOF_OF_ADDRESS') {
    newLevel = 'LEVEL_3';
  }

  if (newLevel !== currentLevel) {
    await prisma.user.update({ where: { id: userId }, data: { kycLevel: newLevel } });
    await notifyKYCApproved(userId, newLevel);
  }

  return { documentId, newLevel };
}

export async function rejectDocument(
  documentId: string,
  adminId: string,
  reason: string
) {
  const document = await prisma.kYCDocument.findUnique({ where: { id: documentId } });
  if (!document) throw new AppError('Document not found', 404);
  if (document.status !== 'PENDING') throw new AppError('Document already reviewed', 400);

  await prisma.kYCDocument.update({
    where: { id: documentId },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  await notifyKYCRejected(document.userId, document.type, reason);
}

export async function getPendingDocuments() {
  return prisma.kYCDocument.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        select: {
          id: true, email: true, phone: true, kycLevel: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}
