import express from 'express';
import cartContoller from '../controllers/cartController';
import { variationExist, productExist } from '../middlewares/cartMiddleware';

const router = express.Router();

router.post('/add', [productExist, variationExist], cartContoller.addToCart);

router.put('/edit', [productExist, variationExist], cartContoller.updateCartItem);

router.delete('/item/delete/:productId', cartContoller.deleteItemFromCart);

router.delete('/delete', cartContoller.deleteCart);

export default router;
