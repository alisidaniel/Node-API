import firebase from 'firebase-admin';
import serviceAccount from '../config/fir-a7b5d-firebase-adminsdk-2cwkk-d1511402c0.json';
import config from '../config/config';
// import

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as any),
    databaseURL: config.firebase.db
});

interface Ipayload {
    title: string;
    body: string;
    topic?: string;
    token: string;
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
            return response;
        } catch (e) {
            throw new Error(e);
        }
    }
}
