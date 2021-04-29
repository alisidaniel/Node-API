import { model, Schema } from 'mongoose';

const roleModel = new Schema(
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
