import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartModel = new Schema(
    {
        total: {
            type: Number,
            require: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        Products: [{ type: String, required: true }]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', cartModel);

export default Cart;
