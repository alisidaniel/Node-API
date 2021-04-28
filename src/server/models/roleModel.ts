import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

const Role = mongoose.model('Role', roleModel);

export default Role;
