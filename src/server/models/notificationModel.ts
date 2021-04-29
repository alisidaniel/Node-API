import { model, Schema } from 'mongoose';

const notificationModel = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: [0, 1] // 0 - open, 1 - closed
        }
    },
    {
        timestamps: true
    }
);

const Notification = model('Notification', notificationModel);

export default Notification;
