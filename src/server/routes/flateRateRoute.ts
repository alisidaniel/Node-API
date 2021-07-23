import express from 'express';
import flatRateController from '../controllers/flateRateController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new flatRateController();

router.get('/', [isAdmin], controller.getAll);

router.get('/:id', [isAdmin], controller.getSingle);

router.post('/create', [isAdmin], controller.create);

router.put('/edit/:id', [isAdmin], controller.edit);

router.delete('/delete/:id', [isAdmin], controller.destory);

export default router;
