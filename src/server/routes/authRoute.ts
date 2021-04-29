import { router } from '@utils/router';
import AuthController from '@controllers/authController';
import { checkJwt } from '@middlewares/checkJWT';

router.get('/', AuthController.test);

// router.post('/login', AuthController.login);

// router.post('/register', AuthController.register);

// router.

export default router;
