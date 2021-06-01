import { model, Schema, Document } from 'mongoose';
import Product from '../models/productModel';

interface IProducts {
    product: string;
    quantity: number;
    variation: string[];
}
interface ICart {
    user: string;
    products: IProducts[];
    total: number;
}

interface CartDocument extends ICart, Document {}

const cartModel = new Schema<CartDocument>(
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
                    type: [Schema.Types.ObjectId]
                }
            }
        ],
        total: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

cartModel.pre<CartDocument>(/^(updateOne)/, async function (next) {
    let cart: any = this;
    const items = cart._update.$set.products;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        let product = await Product.findOne({ _id: items[i].product });
        sum += parseInt(product.unitPrice) * parseInt(items[i].quantity);
        for (let j = 0; j < items[i].variation.length; j++) {
            const variationItems = product.variation.filter(
                (element: any) => element._id == `${items[i].variation[j]}`
            );
            // add variation price to sum
            const { price } = variationItems[0];
            sum += parseInt(price);
        }
    }
    this.set({ total: sum });
});

cartModel.pre<CartDocument>(/^(save)/, async function (next) {
    let self: any = this;
    const items = self.products;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        let product = await Product.findOne({ _id: items[i].product });
        sum += parseInt(product.unitPrice) * parseInt(items[i].quantity);
        for (let j = 0; j < items[i].variation.length; j++) {
            const variationItems = product.variation.filter(
                (element: any) => element._id == `${items[i].variation[j]}`
            );
            // add variation price to sum
            const { price } = variationItems[0];
            sum += parseInt(price);
        }
    }
    this.total = sum;
});

const Cart = model('Cart', cartModel);

export default Cart;
