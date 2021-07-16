import { model, Schema, Document } from 'mongoose';

export interface Icontact {
    fullname: string;
    email: string;
    phone: string;
    message: string;
}

interface ContactDocument extends Icontact, Document {}

const contactModel = new Schema<ContactDocument>(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Contact = model('Contact', contactModel);

export default Contact;
