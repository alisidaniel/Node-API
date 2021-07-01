import express from 'express';
import cardController from '../controllers/cardController';

const router = express.Router();

const controller = new cardController();

router.get('/', controller.getAll);

router.get('/:cardId', controller.getSingle);

router.get('/user/cards', controller.getUsercards);

router.put('/edit/:cardId', controller.edit);

router.post('/add', controller.create);

router.delete('/delete/:cardId', controller.delete);

export default router;
