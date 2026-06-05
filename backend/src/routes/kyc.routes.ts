import { Router } from 'express';
import * as kycController from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadFields, uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/status', kycController.getKYCStatus);
router.post('/level2', uploadFields([{ name: 'idDocument', maxCount: 1 }, { name: 'selfie', maxCount: 1 }]), kycController.submitLevel2);
router.post('/level3', uploadSingle('proofOfAddress'), kycController.submitLevel3);

export default router;
