import express from 'express';
import { isAdmin } from '../middlewares/authMiddleware';
import settingController from '../controllers/settingsController';

const router = express.Router();

const controller = new settingController();

router.post('/create', [isAdmin], controller.create);

router.put('/update/:settingId', [isAdmin], controller.update);

router.get('/', [isAdmin], controller.getAllQuery);

router.get('/:settingId', [isAdmin], controller.getQuery);

router.delete('/delete/:settingId', [isAdmin], controller.delete);

export default router;
