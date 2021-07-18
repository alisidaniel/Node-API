import express from 'express';
import contactController from '../controllers/contactController';

const router = express.Router();

const controller = new contactController();

router.get('/', controller.getAll);

router.post('/create', controller.create);

router.get('/:contactId', controller.getSingle);

router.put('/update/:contactId', controller.edit);

export default router;
