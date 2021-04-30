import { router } from '@utils/router';
import AuthController from '@controllers/authController';
import { checkJwt } from '@middlewares/checkJWT';

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/reset/password/token', AuthController.sendPasswordResetToken);

// router.post('/reset/password', AuthController.resetPassword);

export default router;
