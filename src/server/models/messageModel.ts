import { model, Schema } from 'mongoose';

const messageModel = new Schema(
    {
        // user model ie admin or user
        onModel: {
            type: String,
            required: true,
            enum: ['User', 'Admin']
        },
        sender: {
            type: Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        receiver: {
            type: Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            enum: ['seen', 'unseen'] // 0 - open, 1 - closed
        }
    },
    {
        timestamps: true
    }
);

const Message = model('Message', messageModel);

export default Message;
