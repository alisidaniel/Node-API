import { NextFunction, Request, Response } from 'express';
import { adminExist, userExist } from '../../utils';
import { getUserFromDatabase, getUserFromToken } from '../../utils/findUser';
import Admin, { IAdmin } from '../models/adminModel';
import User, { EUserType, IUser } from '../models/userModel';
import {
    ACCOUNT_INACTIVE,
    UNAUTHORIZED as MESSAGE_UNAUTHORIZED,
    USER_EXIST
} from '../types/messages';
import { BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED } from '../types/statusCode';

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

export const userTypeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = req.body;
        if (user.userType === EUserType.Portal) {
            if (!user.cacDoc || !user.licenseDoc) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Please provide a CAC and license document' });
            }
            next();
        }
        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id } = await getUserFromToken(req);
        const adminExist = await Admin.findById(_id);
        if (!adminExist)
            return res.status(UNAUTHORIZED).json({ message: 'User must be an admin.' });
        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};
