import { router } from '../../utils/router';
import adminController from '../controllers/adminController';
import { isAuthorized, adminAccountExist } from '../middlewares/authMiddleware';

router.post('/auth/login', adminController.login);

router.post('/auth/register', [adminAccountExist], adminController.register);

router.post('/auth/password/reset', [isAuthorized], adminController.resetPassword);

router.post('/auth/forgot/password', [adminAccountExist], adminController.sendPasswordResetToken);

router.post('/auth/change/password', [isAuthorized], adminController.changePassword);

export default router;
