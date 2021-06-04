import express from 'express';
import disputeController from '../controllers/disputeController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new disputeController();

router.get('/user', controller.getQuery);

router.get('/', controller.getAllQuery);

router.post('/create', controller.create);

router.put('/open/:disputeId', [isAdmin], controller.open);

router.put('/close/:disputeId', [isAdmin], controller.close);

router.put('/update/:disputeId', controller.update);

router.delete('/delete/:disputeId', controller.delete);

export default router;
