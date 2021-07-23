import express from 'express';
import webController from '../controllers/webController';

const router = express.Router();

const controller = new webController();

router.put('/add', controller.create);

router.get('/', controller.getAll);

router.get('/:id', controller.getSingle);

router.delete('/delete/:id', controller.destory);

export default router;
