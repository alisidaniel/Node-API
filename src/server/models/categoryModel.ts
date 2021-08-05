import { model, Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    subcategory: string[];
    coverImage: string;
    icon: string;
    status: boolean;
}

const categoryModel = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true
        },
        subcategory: [String],
        coverImage: {
            type: String
        },
        icon: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Category = model('Category', categoryModel);

export default Category;
