import { model, Schema, Document } from 'mongoose';

export enum IStatus {
    Pending = 'Pending',
    Rejected = 'Rejected',
    Approved = 'Approved'
}

export interface IWithdraw {
    reference: string;
    amount: number;
    user: string;
    account_number: string;
}

interface withdrawDocument extends IWithdraw, Document {}

const withdrawModel = new Schema<withdrawDocument>(
    {
        reference: {
            type: String,
            require: true
        },
        amount: {
            type: Number,
            require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        account_number: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: IStatus,
            default: IStatus.Pending
        }
    },
    {
        timestamps: true
    }
);

const Withdraw = model('Withdraw', withdrawModel);

export default Withdraw;
