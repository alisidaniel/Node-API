import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { UNAUTHORIZED } from '../types/statusCode';
import { ACCOUNT_INACTIVE, UNAUTHORIZED as MESSAGE_UNAUTHORIZED } from '../types/messages';
import { getUserFromDatabase, getUserFromToken } from '../../utils/findUser';

export const isAccountVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromToken(req);
        let response = await User.findOne({ _id: user._id });
        if (!response.active) {
            return res.status(UNAUTHORIZED).json({ message: ACCOUNT_INACTIVE });
        }
        next();
    } catch (e) {
        return res.status(UNAUTHORIZED).json({ message: e.message });
    }
};

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(UNAUTHORIZED).json({ message: ACCOUNT_INACTIVE });
        }
        next();
    } catch (e) {
        return res.status(UNAUTHORIZED).json({ message: e.message });
    }
};

export const isPortal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromToken(req);
        const response = await getUserFromDatabase(user.email);
        if (response.userType !== 1)
            return res.status(UNAUTHORIZED).json({ message: MESSAGE_UNAUTHORIZED });
        next();
    } catch (e) {
        next({
            status: 401,
            message: e
        });
    }
};

export const isExpress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromToken(req);
        const response = await getUserFromDatabase(user.email);
        if (response.userType !== 0)
            return res.status(UNAUTHORIZED).json({ message: MESSAGE_UNAUTHORIZED });
        next();
    } catch (e) {
        next({
            status: 401,
            message: e
        });
    }
};
