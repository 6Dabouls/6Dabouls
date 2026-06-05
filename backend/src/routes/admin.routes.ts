import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'COMPLIANCE', 'FINANCE', 'SUPPORT'));

router.get('/dashboard/stats', adminController.getDashboardStats);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', authorize('ADMIN', 'COMPLIANCE'), adminController.updateUserStatus);

router.get('/kyc/pending', authorize('ADMIN', 'COMPLIANCE'), adminController.getPendingKYC);
router.put('/kyc/:id/validate', authorize('ADMIN', 'COMPLIANCE'), adminController.validateKYC);
router.put('/kyc/:id/reject', authorize('ADMIN', 'COMPLIANCE'), adminController.rejectKYC);

router.get('/transactions', adminController.getAllTransactions);

router.get('/reports/daily', authorize('ADMIN', 'FINANCE'), adminController.getDailyReport);
router.get('/reports/monthly', authorize('ADMIN', 'FINANCE'), adminController.getMonthlyReport);

router.get('/support/tickets', adminController.getAdminTickets);
router.put('/support/tickets/:id/status', adminController.updateTicketStatus);
router.post('/support/tickets/:id/messages', adminController.adminSendTicketMessage);

export default router;
