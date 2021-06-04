import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import paystackService from '../../utils/paystack';
import orderRequest, { IRequest, EStatus } from '../models/requestModel';
import Order, { EType } from '../models/orderModel';
import { getCreator, getUserFromToken } from '../../utils';
import Cart from '../models/cardModel';

interface IProducts {
    product: string;
    quantity: number;
    variation: string[];
}

interface IOrder {
    products?: IProducts[];
    userId: string;
    orderRequestId?: string;
    transactionRef: string;
    shipmentAddress: string;
    type: string;
}

export default class orderController {
    static async order(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                products,
                orderRequestId,
                transactionRef,
                shipmentAddress,
                type
            }: IOrder = req.body;
            const { _id } = await getUserFromToken(req);
            const cartItem = await Cart.find();
            console.log(cartItem);
            if (type.trim() === '' || !Object.values(EType).includes(type as EType))
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field (Type) must be Cart or Checkout' });
            // verify transaction
            const response = await paystackService.verifyTransaction(transactionRef);
            if (!response)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Payment was unsuccessful, please try again.' });

            if (type === EType.Cart) {
                // generate order
                const cartItem = await Cart.findOne({ user: _id });
                console.log(cartItem);
                if (!cartItem)
                    return res.status(BAD_REQUEST).json({ message: 'User cart not found.' });
                cartItem.products.forEach(async (item: any) => {
                    await Order.create({
                        user: _id,
                        product: item.product,
                        quantity: item.quantity,
                        variation: item.variation,
                        shipmentAddress: shipmentAddress
                    });
                });
                // Clear user cart
                await Cart.updateOne({ user: _id }, { $set: { products: [] } });
                return res.status(SUCCESS).json({ message: 'Order created successfully' });
            } else if (type === EType.Checkout) {
                // do something order
                if (products) {
                    // check if requestId is valid
                    const response = await orderRequest.findById(orderRequestId);
                    if (!response)
                        return res.status(BAD_REQUEST).json({ message: 'Invalid order(id).' });
                    products.forEach(async (item: any) => {
                        await Order.create({
                            productName: item.productName,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                            type: EType.Checkout
                        });
                    });
                    // update request that has been ordered.
                    await orderRequest.updateOne(
                        { _id: orderRequestId },
                        {
                            $set: {
                                status: EStatus.Completed
                            }
                        }
                    );
                    return res.status(SUCCESS).json({ message: 'Order created successfully' });
                }
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field (products) can not be null.' });
            } else {
                return res.status(BAD_REQUEST).json({ message: 'Error occured' });
            }
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async orderRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, products }: IRequest = req.body;
            const userType = await getCreator(req);
            if (products) {
                if (products.length === 0 || !userId)
                    return res.status(BAD_REQUEST).json({ message: 'Field(s) can not be null.' });
                const response = await orderRequest.create({
                    user: userId,
                    products,
                    status: userType === 'admin' ? 'Approved' : 'Pending'
                });
                return res.status(SUCCESS).json({ response });
            }
            return res.status(BAD_REQUEST).json({ message: 'Field (products) can not be null.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
