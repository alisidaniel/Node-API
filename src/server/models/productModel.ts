import { model, Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    reference: string;
    user: string;
    name: string;
    description: string;
    image: string[];
    category: string;
    brand: string;
    unitPrice: number;
    stock: number;
    controlled: Boolean;
    formulation: string;
    reviews: { user: string; rate: number; comment: string }[];
    promo: { discount: string; startDate: Date; endDate: Date }[];
    variation: { name: string; variationType: string }[];
}

const productModel = new Schema<IProduct>(
    {
        reference: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: [
            {
                type: String,
                default: []
            }
        ],
        category: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        packagePrice: {
            type: Number,
            required: false
        },
        controlled: {
            type: Boolean,
            default: false
        },
        variation: [
            {
                name: String,
                price: Number,
                color: String,
                default: []
            }
        ],
        stock: {
            type: Number,
            default: 1
        },
        formulation: {
            type: String,
            required: false
        },
        reviews: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                rate: {
                    type: Number
                },
                comment: {
                    type: String
                }
            }
        ],
        promo: [
            {
                discount: Number,
                startDate: Date,
                endDate: Date
            }
        ],
        isVerified: {
            // When none verified item will not be shown to public users
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Product = model('Product', productModel);

export default Product;
