import express from 'express';
import adminRoleController from '../controllers/adminRoleController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new adminRoleController();

router.get('/', [isAdmin], controller.getAll);

router.post('/create', [isAdmin], controller.create);

router.get('/:roleId', [isAdmin], controller.getSingle);

router.put('/update/:roleId', [isAdmin], controller.edit);

router.delete('/delete/:roleId', [isAdmin], controller.destory);

export default router;
