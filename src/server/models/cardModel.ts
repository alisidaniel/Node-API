import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

const Card = mongoose.model('Card', cardModel);

export default Card;
