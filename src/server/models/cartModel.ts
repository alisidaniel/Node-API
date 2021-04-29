import { model, Schema } from 'mongoose';

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

const Cart = model('Cart', cartModel);

export default Cart;
