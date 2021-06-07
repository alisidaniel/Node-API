import { model, Schema, Document } from 'mongoose';

export enum EStatus {
    Pending = 'Pending',
    Open = 'Open',
    Closed = 'Closed'
}
export interface IDesK {
    subject: string;
    message: string;
}

interface DisputeDocument extends IDesK, Document {}

const disputeModel = new Schema<DisputeDocument>(
    {
        reference: {
            type: Number,
            require: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: EStatus, // 0 - pending, 1 - opend, 2 - closed
            default: EStatus.Pending
        }
    },
    {
        timestamps: true
    }
);

const Dispute = model('Dispute', disputeModel);

export default Dispute;
