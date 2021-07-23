import express from 'express';
import adminController from '../controllers/adminController';
import { adminAccountExist, isAuthorized, isSuperAdmin } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/auth/login', adminController.login);

router.post('/auth/register', [adminAccountExist], adminController.register);

router.post('/auth/password/reset', [isAuthorized], adminController.resetPassword);

router.post('/auth/forgot/password', [adminAccountExist], adminController.sendPasswordResetToken);

router.post('/auth/change/password', [isAuthorized], adminController.changePassword);

router.put('/update/:adminId', adminController.updateProfile);

router.put('/upload/photo/:adminId', adminController.uploadPhoto);

router.put('/update/admin/type', [isSuperAdmin], adminController.administratorChangeTypes);

router.post('/create/type', [isSuperAdmin], adminController.adminCreateType);

router.get('/type', [isSuperAdmin], adminController.adminQueryAllTypes);

router.get('/type/:id', [isSuperAdmin], adminController.adminQuerySingleType);

router.put('/type/:id', [isSuperAdmin], adminController.adminEditType);

router.put('/superadmin/change/profile', [isSuperAdmin], adminController.superAdminProfileUpdate);

router.delete('/type/delete/:id', [isSuperAdmin], adminController.adminDeleteType);

export default router;
