import express from 'express';
import blogController from '../controllers/blogController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new blogController();

router.get('/', controller.getAll);

router.post('/create', [isAdmin], controller.create);

router.get('/:blogId', controller.getSingle);

router.get('/filter/:tag', controller.filter);

router.put('/update/:blogId', [isAdmin], controller.edit);

router.delete('/delete/:blogId', [isAdmin], controller.destory);

export default router;
