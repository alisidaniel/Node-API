import { Request, Response, NextFunction } from 'express';
import {
    BAD_REQUEST,
    FORBIDEN,
    NOT_FOUND,
    SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED
} from '../types/statusCode';
import paystackService from '../../utils/paystack';
import Order, { EType, EStatus as IStatus } from '../models/orderModel';
import orderRequest, { IRequest, EStatus } from '../models/requestModel';
import { getUserFromToken } from '../../utils';
import Cart from '../models/cartModel';
import Coupon from '../models/couponModel';

export const validatePayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderRequestId, transactionRef, type, couponId } = req.body;
        const { _id } = await getUserFromToken(req);
        // verify transaction
        const response = await paystackService.verifyTransaction(transactionRef);
        if (!response)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'Payment verification failed, please try again.' });

        // check amount paid
        const getResponse = await paystackService.getTransaction(transactionRef);

        // get coupon amount here
        let couponPrice;
        if (couponId.trim() !== '') {
            const coupon = await Coupon.findById(couponId);
            couponPrice = coupon.discount;
        } else {
            couponPrice = 0;
        }

        if (type === EType.Cart) {
            // get user cart total
            const cartOrder = await Cart.findOne({ user: _id });
            if (getResponse.data.amount !== cartOrder.total - couponPrice)
                // check if amount it equals for cart order
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Paid amount was incorrect. Please try again.' });
        } else if (type === EType.Checkout) {
            //get order request items and sum total
            const orderRequestData = await orderRequest.findById(orderRequestId);
            let sum: number;
            let items = orderRequestData.products;

            sum = items
                .map((item: any) => item.amount)
                .reduce((a: number, amount: number) => a + amount, 0);

            if (getResponse.data.amount !== sum - couponPrice)
                // check if amount it equals for checkout
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Paid amount was incorrect. Please try again.' });
        }

        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};
