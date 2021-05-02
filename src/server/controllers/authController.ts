import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from './../models/userModel';
import { IN_VALID_LOGIN, NO_USER } from '../types/messages';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import config from '../../config/config';
import { validatePassword, userExist } from '../../utils';

interface IAuth<T> {
    login: () => T;
    register: () => T;
    sendPasswordResetToken: () => T;
    resetPassword: () => T;
}
export default class AuthController<IAuth> {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, ...rest }: IUser = req.body;
            if (!req.body) return res.status(BAD_REQUEST).json({ message: 'Empty field(s).' });
            console.log(email);
            if (!userExist(email)) {
                return res.status(NOT_FOUND).json({ message: NO_USER });
            }
            const user = new User(rest);
            await user.save();
            // const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 });   // the user need to confirm their email... so we don't need to send them a token yet

            return res.status(SUCCESS).json({
                // token,
                message: 'Successfully registered, please proceed to confirm your mail'
            });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: Partial<IUser> = req.body;
            if (email && password) {
                let accountCheck = await userExist(email);
                if (!accountCheck) return res.status(NOT_FOUND).json({ message: NO_USER });
                let user = await User.findOne({ email });
                let isPasswordValid = await validatePassword(password, user.password);
                if (!isPasswordValid)
                    return res.status(BAD_REQUEST).json({ message: IN_VALID_LOGIN });
                const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 });
                return res.status(SUCCESS).json({ token, user });
            } else {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Please provide and email and password' });
            }
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e });
        }
    }

    static async sendPasswordResetToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { email }: IUser = req.body;
            let accountCheck = await userExist(email);
            if (!accountCheck) return res.status(NOT_FOUND).json({ message: NO_USER });
            let user = await User.findOne({ email });
            const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 });
            // send link with token to user email to change password
            // add email dispatch here
            return res
                .status(SUCCESS)
                .json({ message: 'Password reset link have been sent to your email' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e });
        }
    }

    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: IUser = req.body;

            await User.updateOne(
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
}
