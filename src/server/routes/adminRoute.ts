import express from 'express';
import adminController from '../controllers/adminController';
import { adminAccountExist, isAuthorized } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/auth/login', adminController.login);

router.post('/auth/register', [adminAccountExist], adminController.register);

router.post('/auth/password/reset', [isAuthorized], adminController.resetPassword);

router.post('/auth/forgot/password', [adminAccountExist], adminController.sendPasswordResetToken);

router.post('/auth/change/password', [isAuthorized], adminController.changePassword);

router.put('/update/:adminId', adminController.updateProfile);

router.put('/upload/photo/:adminId', adminController.uploadPhoto);

export default router;
