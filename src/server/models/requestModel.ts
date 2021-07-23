import { Document, model, Types, Schema } from 'mongoose';

export enum EStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Completed = 'Completed',
    Rejected = 'Rejected'
}

interface IProducts {
    productName: string;
    amount: number;
    quantity: number;
}

export interface IRequest {
    userId: string;
    products?: IProducts[];
    creator: string;
    image?: string;
}

interface OrderRequest extends IRequest, Document {}

const requestModel = new Schema<OrderRequest>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productName: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    image: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(EStatus),
        default: EStatus.Pending
    }
});

const orderRequest = model('orderRequest', requestModel);

export default orderRequest;
