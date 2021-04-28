import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categoryModel = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        subcategory: [String],

    },
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', categoryModel);

export default Category;
