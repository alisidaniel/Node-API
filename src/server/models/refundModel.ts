import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const refundModel = new Schema(
    {
        reference: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        amount: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        additionInfo: {
            type: String,
            required: String
        },
        status: {
            type: String,
            enum: [0, 1, 2] // 0 - pending, 1 - Declined, 2 - Accepted
        }
    },
    {
        timestamps: true
    }
);

const Refund = mongoose.model('Refund', refundModel);

export default Refund;
