import { Request, Response } from 'express';
import * as kycService from '../services/kyc.service';
import { AppError } from '../middleware/error.middleware';

export async function getKYCStatus(req: Request, res: Response) {
  const status = await kycService.getKYCStatus(req.user!.id);
  res.json({ success: true, data: status });
}

export async function submitLevel2(req: Request, res: Response) {
  const files = req.files as Record<string, Express.Multer.File[]>;

  const idDocument = files?.['idDocument']?.[0];
  const selfie = files?.['selfie']?.[0];

  await kycService.submitLevel2(
    req.user!.id,
    { idDocumentPath: idDocument?.path, selfiePath: selfie?.path },
    req.body.documentType
  );

  res.status(201).json({
    success: true,
    data: { message: 'KYC Level 2 documents submitted. Under review.' },
  });
}

export async function submitLevel3(req: Request, res: Response) {
  const file = req.file;
  if (!file) throw new AppError('Proof of address file required', 400, 'MISSING_FILE');
  if (!req.body.address) throw new AppError('Address is required', 400, 'MISSING_ADDRESS');

  await kycService.submitLevel3(req.user!.id, file.path, req.body.address);

  res.status(201).json({
    success: true,
    data: { message: 'KYC Level 3 documents submitted. Under review.' },
  });
}
