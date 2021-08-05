import { model, Schema, Document } from 'mongoose';

export interface IMessage {
    user: string;
    admin: string;
    message: string;
    status?: boolean;
}

interface MessageDocument extends IMessage, Document {}

const messageModel = new Schema<MessageDocument>(
    {
        onModel: {
            type: String,
            required: true,
            enum: ['User', 'Admin']
        },
        admin: {
            type: Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        user: {
            type: Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        message: {
            type: String,
            required: true
        },
        file: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Message = model('Message', messageModel);

export default Message;
