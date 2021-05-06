import { router } from '../../utils/router';
import UserController from '../controllers/userController';

router.put('/edit/profile', UserController.editProfile);

export default router;
