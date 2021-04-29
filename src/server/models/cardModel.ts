import { model, Schema } from 'mongoose';

const cardModel = new Schema(
    {
        accountNumber: {
            type: String,
            require: false
        },
        accountCode: {
            type: String,
            require: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const Card = model('Card', cardModel);

export default Card;
