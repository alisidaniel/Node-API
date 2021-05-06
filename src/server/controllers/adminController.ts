import config from '../../config/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mailJob from '../jobs/email/emailJob';
import { consumeEmailJob } from '../jobs/email/consumeJob';
import Admin, { IAdmin } from '../models/adminModel';
import { IN_VALID_LOGIN, NO_USER } from '../types/messages';
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
    validatePassword
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
            console.log('got here ');
            const { password, email, ...rest }: IAdmin = req.body;
            const user = new Admin({ email, password, ...rest });
            await user.save();
            console.log(user);

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
}
