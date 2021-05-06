import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import Admin, { IAdmin } from '../models/adminModel';
import { BAD_REQUEST, UNAUTHORIZED, SERVER_ERROR } from '../types/statusCode';
import {
    ACCOUNT_INACTIVE,
    UNAUTHORIZED as MESSAGE_UNAUTHORIZED,
    USER_EXIST
} from '../types/messages';
import { getUserFromDatabase, getUserFromToken } from '../../utils/findUser';
import { userExist, adminExist } from '../../utils';

export const isAccountVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromToken(req);
        let response = await User.findOne({ _id: user._id });
        if (!response.active) {
            return res.status(UNAUTHORIZED).json({ message: ACCOUNT_INACTIVE });
        }
        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
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
        return res.status(SERVER_ERROR).json({ message: e.message });
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
        return res.status(SERVER_ERROR).json({ message: e.message });
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
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};

export const userAccountExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { email }: IUser = req.body;
        let user = await userExist(email);
        if (user) {
            return res.status(BAD_REQUEST).json({ message: USER_EXIST });
        }
        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};

export const adminAccountExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { email }: IAdmin = req.body;
        console.log(email, 'got here with email');
        let user = await adminExist(email);
        if (user) {
            return res.status(BAD_REQUEST).json({ message: USER_EXIST });
        }
        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};
