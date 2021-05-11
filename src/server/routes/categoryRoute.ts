import express from 'express';
import CategoryController from '../controllers/categoryController';

const router = express.Router();

router.post('/', CategoryController.create);

router.put('/:categoryId', CategoryController.edit);

router.get('/', CategoryController.getAll);

router.get('/:categoryId', CategoryController.getById);

router.delete('/:categoryId', CategoryController.destroy);

export default router;
