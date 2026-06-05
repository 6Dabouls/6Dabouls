import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', cardController.getCards);
router.post('/virtual', cardController.createVirtualCard);
router.post('/physical', cardController.orderPhysicalCard);
router.get('/:id', cardController.getCard);
router.put('/:id/status', cardController.updateCardStatus);
router.put('/:id/limits', cardController.updateCardLimits);
router.delete('/:id', cardController.cancelCard);

export default router;
