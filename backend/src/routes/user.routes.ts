import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';

const router = Router();

// /api/users/
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, uploadSingle("avatar"), userController.updateProfile);

export default router;
