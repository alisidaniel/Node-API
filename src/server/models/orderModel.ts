import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderModel = new Schema(
    {
        reference:{
            type:String,
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
        quantity:{
            type: Number,
            required: false
        },
        variation: {
            type: Schema.Types.ObjectId,
            default: null
        },
        shipmentAddress: {
            type: String
        },

    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderModel);

export default Order;