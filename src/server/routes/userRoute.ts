import express from 'express';
import UserController from '../controllers/userController';

const router = express.Router();

router.put('/edit/profile', UserController.editProfile);

export default router;
