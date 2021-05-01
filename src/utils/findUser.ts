import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { NO_USER } from 'server/types/messages';
import User from '../server/models/userModel';
import config from '../config/config';

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
        const jwtPayload = await (<any>jwt.verify(token, config.auth.jwt));
        const { user } = jwtPayload;
        return user;
    } catch (e) {
        throw Error(e);
    }
};
