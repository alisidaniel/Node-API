import CategoryController from '../controllers/categoryController';
import { router } from '../../utils/router';

router.post('/', CategoryController.create);

router.put('/:categoryId', CategoryController.edit);

router.get('/', CategoryController.getAll);

router.get('/:categoryId', CategoryController.getById);

router.delete('/:categoryId', CategoryController.destroy);

export default router;
