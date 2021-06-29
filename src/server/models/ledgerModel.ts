import { model, Schema } from 'mongoose';

const transactionEnums = ['001', '002', '003', '004'];

export enum directionType {
    Debit = 'Debit',
    Credit = 'Credit'
}

const ledgerModel = new Schema(
    {
        reference: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        oldBalance: {
            type: Number,
            required: true
        },
        newBalance: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        entity: {
            type: String //this should house the model name
        },
        entityId: {
            type: Schema.Types.ObjectId
        },
        transactionCode: {
            type: String,
            required: true,
            enum: transactionEnums
        },
        direction: {
            type: String,
            enum: [directionType],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Ledger = model('Ledger', ledgerModel);

export default Ledger;
