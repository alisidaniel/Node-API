import { Document, model, Types, Schema } from 'mongoose';

export interface ISetting {
    autoRefund: boolean;
}

interface settingDocument extends ISetting, Document {}

const settingsModel = new Schema<settingDocument>(
    {
        autoRefund: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Setting = model('Setting', settingsModel);

export default Setting;
