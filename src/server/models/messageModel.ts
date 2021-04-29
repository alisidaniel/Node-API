import { model, Schema } from 'mongoose';

const messageModel = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            enum: [0, 1] // 0 - open, 1 - closed
        }
    },
    {
        timestamps: true
    }
);

const Message = model('Message', messageModel);

export default Message;
