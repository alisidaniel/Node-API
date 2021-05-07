import { model, Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    subcategory: string[];
}

const categoryModel = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true
        },
        subcategory: [String]
    },
    {
        timestamps: true
    }
);

const Category = model('Category', categoryModel);

export default Category;
