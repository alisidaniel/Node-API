import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@models/userModel';
import config from '@config/config';

export const accountVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers['Authorization'];
        let jwtPayload = <any>jwt.verify(token, config.auth.jwt);
        res.locals.jwtPayload = jwtPayload;
        const { userId, username } = jwtPayload;
        let user = await User.findOne({ _id: userId });
    } catch (e) {
        next({
            status: 401,
            message: e
        });
    }
};
