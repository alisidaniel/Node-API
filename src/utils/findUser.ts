import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { NO_USER } from '../server/types/messages';
import User from '../server/models/userModel';
import config from '../config/config';
import { IRequest } from '../server/models/requestModel';
import Admin from '../server/models/adminModel';

export const getUserFromDatabase = async (email: string) => {
    try {
        let user = await User.findOne({ email: email });
        if (user) return user;
        throw new Error(NO_USER);
    } catch (e) {
        throw Error(e);
    }
};

export const getUserFromToken = async (req: Request) => {
    try {
        const token = <string>req.headers?.authorization?.split(' ')[1];
        if (!token) {
            throw Error('User Unauthorized');
        }
        const jwtPayload = await (<any>jwt.verify(token, config.auth.jwt));
        const { user } = jwtPayload;
        return user;
    } catch (e) {
        throw Error(e);
    }
};

export const getCreator = async (req: Request): Promise<string> => {
    try {
        const creator = await getUserFromToken(req);
        const user = await User.findById(creator._id);
        if (user) {
            // Do something
            return 'user';
        } else {
            const admin = await Admin.findById(creator._id);
            if (admin) return 'admin';
            return '';
        }
    } catch (e) {
        throw Error(e);
    }
};
