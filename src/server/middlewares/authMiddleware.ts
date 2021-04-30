import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@models/userModel';
import config from '@config/config';
import { UNAUTHORIZED } from '../types/statusCode';
import { ACCOUNT_INACTIVE } from '../types/messages';

export const isAccountVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers?.authorization?.split(' ')[1];
        let jwtPayload = <any>jwt.verify(token, config.auth.jwt);
        res.locals.jwtPayload = jwtPayload;
        const { userId } = jwtPayload;
        let user = await User.findOne({ _id: userId });
        if (!user.active) {
            return res.status(UNAUTHORIZED).json({ message: ACCOUNT_INACTIVE });
        }
        next();
    } catch (e) {
        next({
            status: 401,
            message: e
        });
    }
};

// export const
