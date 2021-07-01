import { model, Schema, Document } from 'mongoose';

export interface ICard {
    user: string;
    account_name: string;
    account_no: string;
    bank_no: string;
    authorization_code: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    bin: string;
    country_code: string;
    reusable: string;
}

interface cardDocument extends ICard, Document {}

const cardModel = new Schema<cardDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        account_name: {
            type: String,
            required: true
        },
        account_no: {
            type: String,
            max: 10,
            required: true
        },
        bank_no: {
            type: String
        },
        authorization_code: {
            type: String,
            required: false
        },
        last4: {
            type: String,
            max_length: 4,
            required: false
        },
        exp_month: {
            type: String
        },
        exp_year: {
            type: String
        },
        bin: {
            type: String
        },
        country_code: {
            type: String
        },
        reusable: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

const Card = model('Card', cardModel);

export default Card;
