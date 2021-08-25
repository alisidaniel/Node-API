import firebase from 'firebase-admin';
import serviceAccount from '../config/fir-a7b5d-firebase-adminsdk-2cwkk-d1511402c0.json';
import config from '../config/config';
import Notification from '../server/models/notificationModel';

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as any),
    databaseURL: config.firebase.db
});

interface Ipayload {
    title: string;
    body: string;
    topic?: string;
    token: string;
    user: string;
}

interface handlers {
    sendNotifications(payload: Ipayload): any;
}

export default class notification implements handlers {
    async sendNotifications(payload: Ipayload) {
        try {
            let message;
            message = {
                notification: {
                    title: payload.title,
                    body: payload.body
                },
                token: payload.token
            };
            const response = await firebase.messaging().send(message);
            // persist notification to mongodb
            await Notification.create({
                user: payload.user,
                title: payload.title,
                body: payload.body
            });
            return response;
        } catch (e) {
            throw new Error(e);
        }
    }
}
