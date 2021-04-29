import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const brandModel = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        logo:{
            type: String
        },
        status:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Brand = mongoose.model('Brand', brandModel);

export default Brand;
