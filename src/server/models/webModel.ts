import { model, Schema, Document } from 'mongoose';

export interface IWeb {
    heroImage: string;
    missionPhoto: String;
    vissionPhoto: string;
}

interface WebDocument extends IWeb, Document {}

const webModel = new Schema<WebDocument>(
    {
        heroImage: {
            type: String,
            required: false
        },
        missonPhoto: {
            type: String,
            required: false
        },
        vissionPhoto: {
            type: String,
            required: false
        },
        banner: {
            type: [String]
        },

        teamSection: {}
    },
    {
        timestamps: true
    }
);

const WebContent = model('WebContent', webModel);

export default WebContent;
