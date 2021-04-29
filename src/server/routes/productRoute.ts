import { router } from '@utils/router';
import ProductController from '@controllers/productController';

// GET ALL PRODUCTS
router.get('/', ProductController.getAllProducts);

// GET SINGLE PRODUCT
router.get('/:id', ProductController.getSingleProduct);

// CREATE SINGLE PRODUCT
router.post('/', ProductController.createProduct);

// EDIT SINGLE PRODUCT
router.put('/:id', ProductController.editSingleProduct);

// DELETE SINGLE PRODUCT
router.put('/:id', ProductController.deleteSingleProduct);

export default router;
