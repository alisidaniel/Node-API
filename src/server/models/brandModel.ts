import { model, Schema } from 'mongoose';

const brandModel = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        logo: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Brand = model('Brand', brandModel);

export default Brand;
