import express from 'express';
import orderController from '../controllers/orderController';
import { isAdmin } from '../middlewares/authMiddleware';
import { applyCouponValidate } from '../middlewares/couponMiddleware';
import { validatePayments } from '../middlewares/orderMidlleware';

const router = express.Router();

const controller = new orderController();

router.post('/request', controller.orderRequest);

router.post('/create', [applyCouponValidate, validatePayments], controller.order);

router.get('/', controller.getAllQuery);

router.get('/:orderId', controller.getQuery);

router.get('/user/orders', controller.getUserOrders);

router.post('/processing/:orderId', controller.processing);

router.post('/approve/:orderId/:userId', controller.approve);

router.post('/delivered/:orderId/:userId', controller.delivered);

router.post('/reject/:orderId/:userId', controller.reject);

export default router;
