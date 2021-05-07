import { router } from '../../utils/router';
import AuthController from '../controllers/authController';
import {
    isAccountVerified,
    isAuthorized,
    userAccountExist,
    userTypeData
} from '../middlewares/authMiddleware';

router.post('/login', AuthController.login);

router.post('/register', [userAccountExist, userTypeData], AuthController.register);

router.post('/forgot/password', [userAccountExist], AuthController.sendPasswordResetToken);

router.post('/pssword/reset', [isAuthorized], AuthController.resetPassword);

router.post('/change/password', [isAuthorized, isAccountVerified], AuthController.changePassword);

router.post('/verify/email/:token', AuthController.verifyEmail);

export default router;
