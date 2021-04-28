import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productModel = new Schema(
    {
        reference:{
            type: String,
            required: true
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
                default: [],
            },
        ],
        category: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        unitPrice:{
            type: Number,
            required: true
        },
        packagePrice:{
            type: Number,
            required: false
        },
        variation:[
            {
                name: String,
                price: Number,
                color: String,
                default: [],
              },
        ],
        stock:{
            type: Number,
            default: 1
        },
        formulation:{
            type: String,
            required: false
        },
        reviews: [
            {
                user:{
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                rate:{
                    type: Number,
                },
                comment:{
                    type: String
                }
            }
        ],
        promo:[
            {
                discount: Number,
                startDate: Date,
                endDate: Date
            }
        ],
        isVerified:{  // When none verified item will not be shown to public users
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productModel);

export default Product;
