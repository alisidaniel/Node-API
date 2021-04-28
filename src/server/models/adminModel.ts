import { Document, Model, model, Types, Schema, Query } from 'mongoose';


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
            type: Number,
            enum: [0, 1],
            default: 0,
            required: false
        },
        active: {
            type: Boolean,
            default: false
        },
        roles:{
            type: String,
            enum: []
        },
        photo: {
            type: String,
            required: false
        },
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
adminModel.pre<AdminDocument>('save', function (next) {
    if (this.isModified('password')) {
        // this.password = hashPassword(this.password)  //import a hasPassword function
    }
});

const Admin = model('Admin', adminModel);

export default Admin;
