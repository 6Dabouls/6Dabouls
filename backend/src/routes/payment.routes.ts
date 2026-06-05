import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/qr/generate', paymentController.generateQRCode);
router.post('/qr/pay', paymentController.processQRPayment);
router.post('/link/generate', paymentController.generatePaymentLink);
router.post('/link/pay/:linkId', paymentController.processPaymentLink);
router.post('/bills', paymentController.payBill);

export default router;
