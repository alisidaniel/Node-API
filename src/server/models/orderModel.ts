import { Document, model, Types, Schema } from 'mongoose';

export enum EStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    Return = 'Return',
    Completed = 'Completed'
}

export enum EType {
    Cart = 'Cart',
    Checkout = 'Checkout'
}

export interface IOrder {
    user: string;
    type: EStatus;
}

interface OrderDocument extends IOrder, Document {}

const orderModel = new Schema<OrderDocument>(
    {
        reference: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        variation: {
            type: [Schema.Types.ObjectId]
        },
        shipmentAddress: {
            type: String,
            required: true
        },
        productName: {
            // required when it's a checkout Order
            type: String
        },
        unitPrice: {
            // required when it's a checkout Order
            type: Number,
            required: false
        },
        type: {
            type: String,
            enum: Object.values(EType),
            default: EType.Cart
        },
        status: {
            type: String,
            enum: Object.values(EStatus),
            default: EStatus.Pending
        }
    },
    {
        timestamps: true
    }
);

const Order = model('Order', orderModel);

export default Order;
