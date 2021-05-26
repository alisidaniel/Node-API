import { model, Schema, Document } from 'mongoose';

const cartModel = new Schema<Document>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        products: [
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
                    type: [String],
                    default: []
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

cartModel.pre<Document>('save', async function (next) {});

const Cart = model('Cart', cartModel);

export default Cart;
