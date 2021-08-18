import express from 'express';
import adminController from '../controllers/adminController';
import deliveryManController from '../controllers/deliveryManController';
import { adminAccountExist, isAuthorized, isSuperAdmin } from '../middlewares/authMiddleware';
import { isActive } from '../middlewares/userMiddleware';

const deliveryMan = new deliveryManController();
const router = express.Router();

router.post('/auth/login', [isActive], adminController.login);

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

router.post('/refresh/token', adminController.refreshToken);

router.get('/delivery/men', deliveryMan.getAll);

router.get('/delivery/man/:id', deliveryMan.getSingle);

router.post('/add/delivery/man', deliveryMan.create);

router.put('/edit/delivery/man/:id', deliveryMan.edit);

router.delete('/delete/delivery/man/:id', deliveryMan.destory);

router.get('/delivery/list', deliveryMan.deliveryPicker);

router.put('/delivery/man/selector', deliveryMan.assignDeliveryMan);

export default router;
