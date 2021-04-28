import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productModel = new Schema(
    {
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
        image: {
            type: Array,
            of: String,
            require: true
        },
        category: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        packakageType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productModel);

export default Product;
