import express from 'express';
import orderController from '../controllers/orderController';

const router = express.Router();

const controller = new orderController();

router.post('/request', controller.orderRequest);

router.post('/create', controller.order);

router.get('/', controller.getAllQuery);

router.get('/:orderId', controller.getQuery);

router.get('/user/orders', controller.getUserOrders);

router.post('/processing/:orderId', controller.processing);

router.post('/approve/:orderId', controller.approve);

router.post('/reject/:orderId', controller.reject);

export default router;
