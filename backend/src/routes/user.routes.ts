import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);
router.put('/me/password', userController.changePassword);
router.post('/me/picture', uploadSingle('picture'), userController.uploadProfilePicture);
router.delete('/me', userController.deleteAccount);
router.get('/search', userController.searchUsers);

export default router;
