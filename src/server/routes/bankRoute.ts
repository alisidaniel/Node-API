import express from 'express';
import bankController from '../controllers/bankController';

const router = express.Router();

const controller = new bankController();

router.get('/', controller.getAll);

router.get('/:bankId', controller.getSingle);

router.get('/user/banks', controller.getUserbanks);

router.put('/edit/:bankId', controller.edit);

router.post('/add', controller.create);

router.delete('/delete/:bankId', controller.delete);

export default router;
