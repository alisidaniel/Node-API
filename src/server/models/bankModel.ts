import { model, Schema, Document } from 'mongoose';

export interface IBank {
    account_name: string;
    account_no: string;
    bank_no: string;
    user: string;
}

interface bankDocument extends IBank, Document {}

const bankModel = new Schema<bankDocument>(
    {
        account_name: {
            type: String,
            required: false
        },
        account_no: {
            type: String,
            max: 10,
            required: false
        },
        bank_no: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Bank = model('Bank', bankModel);

export default Bank;
