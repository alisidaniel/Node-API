import express from 'express';
import couponController from '../controllers/couponController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new couponController();

router.get('/', [isAdmin], controller.getAll);

router.get('/:couponId', [isAdmin], controller.getSingle);

router.post('/create', [isAdmin], controller.create);

router.put('/update/:couponId', [isAdmin], controller.edit);

router.delete('/delete/:couponId', [isAdmin], controller.destory);

export default router;
