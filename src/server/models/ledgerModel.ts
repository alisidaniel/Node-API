import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const transactionEnums = ["001", "002"];

const ledgerModel = new Schema(
    {
        reference:{
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        oldBalance:{
            type: Number,
            required: true
        },
        newBalance:{
            type: Number,
            required: true
        },
        transactionType:{  //  0 specify debit, 1 - specifies credit
            type: Number,
            enum: [0, 1], 
        },
        description:{
            type: String,
            required: true
        },
        entity: {
            type: String, //this should house the model name
        },
        entityId: {
            type: Schema.Types.ObjectId,
        },
        transactionCode:{
            type: String,
            required: true,
            enum: transactionEnums
        }
    },
    {
        timestamps: true
    }
);

const Ledger = mongoose.model('Ledger', ledgerModel);

export default Ledger;
