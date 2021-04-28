import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const disputeModel = new Schema(
    {
        reference: {
            type: Number,
            require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        subject:{
            type: String,
            required: true
        },
        message:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: [0,1,2]   // 0 - pending, 1 - opend, 2 - closed 
        }
    },
    {
        timestamps: true
    }
);

const Dispute = mongoose.model('Dispute', disputeModel);

export default Dispute;
