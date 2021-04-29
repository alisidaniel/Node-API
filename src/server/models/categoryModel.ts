import { model, Schema } from 'mongoose';

const categoryModel = new Schema(
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
