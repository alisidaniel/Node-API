import { model, Schema, Document } from 'mongoose';

export interface IRoles {
    name: string;
}

interface RoleDocument extends IRoles, Document {}

const roleModel = new Schema<RoleDocument>(
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

const Role = model('Role', roleModel);

export default Role;
