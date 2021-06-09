import { model, Schema, Document } from 'mongoose';

export interface IBrand {
    name: string;
    logo?: string;
}

interface BrandDocument extends IBrand, Document {}

const brandModel = new Schema<BrandDocument>(
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
