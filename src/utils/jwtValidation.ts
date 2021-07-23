import { Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const signAccessToken = async (user: any) => {
    try {
        const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 }); // expires in 7hours
        return token;
    } catch (e) {
        throw Error(e);
    }
};

export const verifyAccessToken = async (req: Request) => {
    try {
        const token = <string>req.headers?.authorization?.split(' ')[1];
        if (!token) {
            throw Error('User Unauthorized');
        }
        jwt.verify(token, config.auth.jwt, (err: any, payload: any) => {
            if (err) throw Error('Access token invalid.');
            const { user } = payload;
            return user;
        });
    } catch (e) {
        throw Error(e);
    }
};

export const signRefreshToken = async (user: any) => {
    try {
        const token = await jwt.sign({ user }, config.auth.refresh, { expiresIn: '1y' }); // expires in 7hours
        return token;
    } catch (e) {
        throw Error(e);
    }
};

export const verifyRefreshToken = async (refreshToken: any) => {
    try {
        jwt.verify(refreshToken, config.auth.refresh, (err: any, payload: any) => {
            if (err) throw Error('Refresh token invalid.');
            const { user } = payload;
            return user;
        });
    } catch (e) {
        throw Error(e);
    }
};
