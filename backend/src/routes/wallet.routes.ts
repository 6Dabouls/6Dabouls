import { Router } from 'express';
import * as walletController from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', walletController.getWallets);
router.post('/', walletController.createWallet);
router.get('/transactions', walletController.getTransactionHistory);
router.get('/:currency', walletController.getWallet);
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.post('/transfer', walletController.transfer);

export default router;
