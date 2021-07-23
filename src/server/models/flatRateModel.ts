import { model, Schema, Document } from 'mongoose';

export interface IFlateR {
    name: string;
    amount: number;
    location: string;
}

interface FlateRateDocument extends IFlateR, Document {}

const flatRateModel = new Schema<FlateRateDocument>(
    {
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const FlatRate = model('FlatRate', flatRateModel);

export default FlatRate;
