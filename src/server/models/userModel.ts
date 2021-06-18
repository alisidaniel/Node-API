import { Document, model, Types, Schema } from 'mongoose';
import { hashPassword } from '../../utils';
export enum EUserType {
    Express = 'Express',
    Portal = 'Express'
}
enum EGender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export interface IUser {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    address?: Map<string, string>;
    username: string;
    password: string;
    gender?: EGender;
    ePin?: number;
    photo?: string;
    businessType?: string;
    cacDoc?: string;
    licenseDoc?: string;
    documentVerified?: boolean;
    userType: EUserType;
    walletBalance?: number;
    health_description?: Map<string, string>;
}

interface UserDocument extends IUser, Document {
    address: Types.Map<string>;
    health_description: Types.Map<string>;
    fullName: string;
    findOneOrCreate: any;
}

const userModel = new Schema<UserDocument>(
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
        username: {
            type: String,
            unique: true,
            lowercase: true,
            min: 3,
            max: 100,
            required: false
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
            required: false,
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
            enum: [0, 1],
            default: 0,
            required: false
        },
        active: {
            type: Boolean,
            default: false
        },
        ePin: {
            type: Number,
            required: false
        },
        photo: {
            type: String,
            required: false
        },
        businessType: {
            type: String,
            required: false
        },
        cacDoc: {
            type: String
        },
        licenseDoc: {
            type: String
        },
        documentVerified: {
            type: Boolean,
            default: false
        },
        userType: {
            type: String,
            enum: [0, 1],
            default: 0,
            required: true
        },
        walletBalance: {
            type: Number,
            default: 0
        },
        health_description: {
            type: Map,
            of: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

userModel.statics.findOneOrCreate = function findOneOrCreate(condition, doc, callback) {
    const self = this;
    self.findOne(condition, (err: any, result: any) => {
        return result
            ? callback(err, result)
            : self.create(doc, (err, result) => {
                  return callback(err, result);
              });
    });
};

// VIRTUALS *//
userModel.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName || ''} ${this.middleName || ''} ${this.lastName || ''}`;
});

//* METHODS *//
userModel.methods.getUserType = function (this: UserDocument) {
    return this.userType == 'Express' ? 'Express' : 'Portal';
};

//* MIDDLEWARE *//
userModel.pre<UserDocument>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password); //import a hasPassword function
    }
});

const User = model('User', userModel);

export default User;
