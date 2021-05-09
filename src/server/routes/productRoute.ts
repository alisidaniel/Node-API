import { router } from '../../utils/router';
import ProductController from '../controllers/productController';

// GET ALL PRODUCTS
router.get('/', ProductController.getAllProducts);

// GET SINGLE PRODUCT
router.get('/:productId', ProductController.getSingleProduct);

// CREATE SINGLE PRODUCT
router.post('/create', ProductController.createProduct);

// EDIT SINGLE PRODUCT
router.put('/:productId', ProductController.editSingleProduct);

// DELETE SINGLE PRODUCT
router.delete('/:productId', ProductController.deleteSingleProduct);

export default router;
