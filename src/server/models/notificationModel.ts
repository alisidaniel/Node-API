import { model, Schema, Document } from 'mongoose';

export interface INotify {
    user: string;
    title: string;
    body: string;
    seen: boolean;
}

interface NotificationDocument extends INotify, Document {}

const notificationModel = new Schema<NotificationDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        seen: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notification = model('Notification', notificationModel);

export default Notification;
