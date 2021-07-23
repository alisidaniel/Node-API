import { model, Schema, Document } from 'mongoose';

export interface IAdminType {
    name: string;
    status?: boolean;
}

interface AdminTypeDocument extends IAdminType, Document {}

const adminTypeModel = new Schema<AdminTypeDocument>(
    {
        name: {
            type: String,
            required: true
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

const AdminType = model('AdminType', adminTypeModel);

export default AdminType;
