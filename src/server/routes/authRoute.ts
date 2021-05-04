import { router } from '../../utils/router';
import AuthController from '../controllers/authController';
import { isAccountVerified, isAuthorized } from '../middlewares/authMiddleware';

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/reset/password/token', AuthController.sendPasswordResetToken);

router.post('/reset/password', AuthController.resetPassword);

router.post('/change/password', [isAuthorized, isAccountVerified], AuthController.changePassword);

export default router;
