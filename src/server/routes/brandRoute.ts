import express from 'express';
import brandController from '../controllers/brandController';
// import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new brandController();

router.get('/', controller.getAll);

router.post('/create', controller.create);

router.get('/:brandId', controller.getSingle);

router.put('/update/:brandId', controller.edit);

router.delete('/delete/:brandId', controller.destory);

export default router;
