import express from 'express';
import transferController from '../controllers/transferController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new transferController();

router.get('/', controller.getAll);

router.get('/:id', controller.getSingle);

router.get('/user/:userId', controller.getUserTransfer);

router.post('/create', controller.create);

router.put('/edit/:id', controller.edit);

router.put('/', [isAdmin], controller.approveOrReject);

router.delete('/delete/:id', controller.deletetransfer);

export default router;
