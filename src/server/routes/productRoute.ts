import express from 'express';
import ProductController from '../controllers/productController';

const router = express.Router();

// GET ALL PRODUCTS
router.get('/', ProductController.getAllProducts);

// GET SINGLE PRODUCT
router.get('/:productId', ProductController.getSingleProduct);

// PRODUCT SEARCH
router.get('/search/filter', ProductController.productSearch);

// CREATE SINGLE PRODUCT
router.post('/create', ProductController.createProduct);

// EDIT SINGLE PRODUCT
router.put('/:productId', ProductController.editSingleProduct);

// DELETE SINGLE PRODUCT
router.delete('/:productId', ProductController.deleteSingleProduct);

export default router;
