import { Router } from 'express';
import * as currencyController from '../controllers/currency.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/supported', currencyController.getSupportedCurrencies);
router.get('/rates', currencyController.getExchangeRates);
router.get('/rates/:from/:to', currencyController.getRate);
router.post('/convert', authenticate, currencyController.convertCurrency);

export default router;
