import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import paystackService from '../../utils/paystack';
import orderRequest, { IRequest, EStatus } from '../models/requestModel';
import Order, { EType, EStatus as IStatus } from '../models/orderModel';
import { getCreator, getUserFromToken } from '../../utils';
import Cart from '../models/cartModel';
import { NOT_FOUND } from '../types/messages';

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

interface IClass {
    getQuery(req: Request, res: Response, next: NextFunction): any;
    getAllQuery(req: Request, res: Response, next: NextFunction): any;
    getUserOrders(req: Request, res: Response, next: NextFunction): any;
    order(req: Request, res: Response, next: NextFunction): any;
    orderRequest(req: Request, res: Response, next: NextFunction): any;
    processing(req: Request, res: Response, next: NextFunction): any;
    reject(req: Request, res: Response, next: NextFunction): any;
    approve(req: Request, res: Response, next: NextFunction): any;
}

export default class orderController implements IClass {
    public async order(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                products,
                orderRequestId,
                transactionRef,
                shipmentAddress,
                type
            }: IOrder = req.body;
            const { _id } = await getUserFromToken(req);
            if (type.trim() === '' || !Object.values(EType).includes(type as EType))
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field (Type) must be Cart or Checkout' });

            if (!shipmentAddress || shipmentAddress.trim() === '')
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field (shipmentAddress) must be provided.' });
            // verify transaction
            const response = await paystackService.verifyTransaction(transactionRef);
            if (!response)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Payment was unsuccessful, please try again.' });

            if (type === EType.Cart) {
                // generate order
                const cartItem = await Cart.findOne({ user: _id });
                if (!cartItem)
                    return res.status(BAD_REQUEST).json({ message: 'User cart not found.' });
                if (cartItem.products.length === 0)
                    return res.status(BAD_REQUEST).json({ message: 'Cart is empty.' });
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
                            user: req.body.userId,
                            productName: item.productName,
                            unitPrice: item.amount,
                            quantity: item.quantity,
                            shipmentAddress,
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

    public async orderRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, products }: IRequest = req.body;
            const userType = await getCreator(req);
            if (products) {
                if (products.length === 0 || !userId)
                    return res.status(BAD_REQUEST).json({ message: 'Field(s) can not be null.' });
                const response = await orderRequest.create({
                    user: userId,
                    products,
                    status: userType === 'admin' ? EStatus.Approved : EStatus.Pending
                });
                return res.status(SUCCESS).json({ response });
            }
            return res.status(BAD_REQUEST).json({ message: 'Field (products) can not be null.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getQuery(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            const response = await Order.findById(orderId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAllQuery(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Order.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getUserOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = await getUserFromToken(req);
            const response = await Order.find({ user: _id });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async processing(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            const response = await Order.updateOne(
                { _id: orderId },
                { $set: { status: IStatus.Processing } }
            );
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: 'Dispatched Order' });
            return res.status(BAD_REQUEST).json({ message: 'Error occured.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async approve(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            const response = await Order.updateOne(
                { _id: orderId },
                { $set: { status: IStatus.Completed } }
            );
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: 'Order approved.' });
            return res.status(BAD_REQUEST).json({ message: 'Error occured.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async reject(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
