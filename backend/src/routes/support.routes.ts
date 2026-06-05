import { Router } from 'express';
import * as supportController from '../controllers/support.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/tickets', supportController.getTickets);
router.post('/tickets', supportController.createTicket);
router.get('/tickets/:id', supportController.getTicket);
router.post('/tickets/:id/messages', supportController.sendMessage);

export default router;
