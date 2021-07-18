import { unique } from 'faker';
import { Document, model, Types, Schema } from 'mongoose';
import { hashPassword } from '../../utils';

export interface IAdmin {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    address: Map<string, string>;
    username: string;
    roles: string;
    password: string;
    active: boolean;
    photo?: string;
    available: boolean;
}

enum userType {
    MALE = 'Male',
    FEMALE = 'Female'
}

interface AdminDocument extends IAdmin, Document {
    address: Types.Map<string>;
    fullName: string;
}

const adminModel = new Schema<AdminDocument>(
    {
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 100
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 225
        },
        address: {
            type: Map,
            of: String,
            required: false
        },
        gender: {
            type: String,
            enum: Object.values(userType),
            default: userType.MALE,
            required: false
        },
        active: {
            type: Boolean,
            default: false
        },
        roles: {
            type: [String]
        },
        photo: {
            type: String,
            required: false,
            default: null
        },
        available: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// VIRTUALS *//
adminModel.virtual('fullName').get(function (this: AdminDocument) {
    return this.firstName + this.middleName + this.lastName;
});

//* MIDDLEWARE *//
adminModel.pre<AdminDocument>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password); //import a hasPassword function
    }
});

// adminModel.pre<AdminDocument>('update', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await hashPassword(this.password); //import a hasPassword function
//     }
// });

const Admin = model('Admin', adminModel);

export default Admin;
