import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartModel = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        Products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    default: null
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                variation: {
                    type: Schema.Types.ObjectId,
                    default: null
                }
            }
        ],
        total: {
            type: Number,
            require: false
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', cartModel);

export default Cart;
