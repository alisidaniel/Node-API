import express from 'express';
import orderController from '../controllers/orderController';

const router = express.Router();

router.post('/request', orderController.orderRequest);

router.post('/create', orderController.order);

export default router;
