import config from '../../config/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mailJob from '../jobs/email/emailJob';
import { consumeEmailJob } from '../jobs/email/consumeJob';
import Admin, { IAdmin } from '../models/adminModel';
import AdminType, { IAdminType } from '../models/adminTypeModel';
import {
    IN_VALID_LOGIN,
    NO_USER,
    DELETED_SUCCESS,
    UPDATE_SUCCESS,
    NOT_FOUND as NOT_FOUND_M
} from '../types/messages';
import {
    BAD_REQUEST,
    FORBIDEN,
    NOT_FOUND,
    SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED
} from '../types/statusCode';
import {
    getUserFromDatabase,
    getUserFromToken,
    hashPassword,
    userExist,
    validatePassword,
    singleUpload
} from '../../utils';

interface IAuth<T> {
    login: () => T;
    register: () => T;
    sendPasswordResetToken: () => T;
    resetPassword: () => T;
}

interface ILogin {
    email: string;
    password: string;
}

export default class adminController<IAuth> {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { password, email, ...rest }: IAdmin = req.body;
            const user = new Admin({ email, password, ...rest });
            await user.save();

            // Dispatch email
            const userId = user._id;
            const type = 'Confirm Email';
            const title = 'Thank you for registering with Midlman';
            const emailQueue = new mailJob('emailQueue');
            emailQueue.addJob('EmailVerification', { email, userId, type, title });
            emailQueue.consumeJob('EmailVerification', await consumeEmailJob);

            return res.status(SUCCESS).json({
                message: 'Successfully registered, please proceed to confirm your mail'
            });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: ILogin = req.body;

            if (!email || !password) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Please provide and email and password' });
            }
            const user = await Admin.findOne({ email });
            if (user) {
                const isPasswordValid = await validatePassword(password, user.password);
                if (!isPasswordValid)
                    return res.status(BAD_REQUEST).json({ message: IN_VALID_LOGIN });
                const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 }); // expires in 7hours
                return res.status(SUCCESS).json({ token, user });
            }
            return res.status(NOT_FOUND).json({ message: IN_VALID_LOGIN });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async sendPasswordResetToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { email }: IAdmin = req.body;
            const accountCheck = await userExist(email);
            if (!accountCheck) return res.status(NOT_FOUND).json({ message: NO_USER });
            const user = await Admin.findOne({ email });
            if (user) {
                const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 });
                // Dispatch email
                const type = 'Reset Password';
                const title = 'Click below link to reset your password';
                const emailQueue = new mailJob('emailQueue');
                emailQueue.addJob('resetPassword', { email, token, type, title });
                emailQueue.consumeJob('resetPassword', await consumeEmailJob);
                return res
                    .status(SUCCESS)
                    .json({ message: 'Password reset link have been sent to your email' });
            }
            return res.status(NOT_FOUND).json({ message: NO_USER });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: IAdmin = req.body;
            await Admin.updateOne(
                { email },
                {
                    $set: {
                        password: password
                    }
                }
            );
            return res.status(SUCCESS).json({ message: 'Successfully reset password.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e });
        }
    }

    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenUser = await getUserFromToken(req);

            if (!tokenUser) {
                return res
                    .status(UNAUTHORIZED)
                    .json({ message: 'User must be logined in to change password' });
            }

            const dbUser = await getUserFromDatabase(tokenUser.email);

            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Please provide your old and new password' });
            }
            const isValidPass = await validatePassword(oldPassword, dbUser.password);

            if (isValidPass) {
                const newHashpass = await hashPassword(newPassword);
                const user = await Admin.updateOne(
                    { email: tokenUser.email },
                    {
                        $set: {
                            password: newHashpass
                        }
                    }
                );

                return res.status(SUCCESS).json({ message: 'Successfully updated password.' });
            }
            return res.status(FORBIDEN).json({ message: 'Old password incorrect' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const response = await Admin.updateOne({ _id: adminId }, { $set: { ...req.body } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async uploadPhoto(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const { photo } = req.body;
            if (!photo)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field(s) photo can not be empty.' });
            const photoUri = await singleUpload({
                base64: photo,
                id: `${new Date().getTime()}`,
                path: 'adminPhoto',
                type: 'image'
            });
            const response = await Admin.updateOne({ _id: adminId }, { $set: { photo: photoUri } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async administratorChangeTypes(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminType, adminId } = req.body;
            const response = await Admin.updateOne(
                { _id: adminId },
                { $set: { adminType: adminType } }
            );
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Unsuccessful' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async adminCreateType(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, status }: IAdminType = req.body;
            const response = await AdminType.create({ name, status });
            return res.status(SUCCESS).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    static async adminQueryAllTypes(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AdminType.find();
            return res.status(SUCCESS).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    static async adminQuerySingleType(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await AdminType.findOne({ _id: id });
            return res.status(SUCCESS).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    static async adminEditType(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, status }: IAdminType = req.body;
            const response = await AdminType.updateOne({ _id: id }, { $set: { name, status } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Unsuccessful' });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    static async adminDeleteType(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await AdminType.deleteOne({ _id: id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    static async superAdminProfileUpdate(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.body;
            const response = await Admin.updateOne({ _id: adminId }, { $set: { ...req.body } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Unsuccessful' });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }
}
