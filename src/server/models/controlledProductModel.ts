import { model, Schema, Document } from 'mongoose';

const controlleModel = new Schema<Document>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        photo: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Controlled = model('Controlled', controlleModel);

export default Controlled;
