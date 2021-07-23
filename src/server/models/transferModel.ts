import { model, Schema, Document } from 'mongoose';

export enum IStatus {
    Pending = 'Pending',
    Rejected = 'Rejected',
    Approved = 'Approved'
}

export interface ITransfer {
    user: string;
    depositor: string;
    amount: string;
    image: string;
    status: string;
}

interface transferDocument extends ITransfer, Document {}

const transferModel = new Schema<transferDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        depositor: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(IStatus),
            default: IStatus.Pending
        }
    },
    { timestamps: true }
);

const Transfer = model('Transfer', transferModel);

export default Transfer;
