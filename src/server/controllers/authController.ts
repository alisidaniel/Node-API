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

interface ILogin {
    email: string;
    password: string;
}
export default class AuthController<IAuth> {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { password, email, ...rest }: IUser = req.body;
            if (await userExist(email)) {
                return res.status(BAD_REQUEST).json({ message: 'User already exist' });
            }
            const user = new User({ email, password, ...rest });

            await user.save();

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

            const accountCheck = await userExist(email);
            if (!accountCheck) return res.status(NOT_FOUND).json({ message: NO_USER });
            const user = await User.findOne({ email });
            let isPasswordValid = await validatePassword(password, user.password);
            if (!isPasswordValid) return res.status(BAD_REQUEST).json({ message: IN_VALID_LOGIN });
            const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 }); // expires in 7hours
            const newUser = delete user.password;
            return res.status(SUCCESS).json({ token, newUser });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async sendPasswordResetToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { email }: IUser = req.body;
            let accountCheck = await userExist(email);
            if (!accountCheck) return res.status(NOT_FOUND).json({ message: NO_USER });
            let user = await User.findOne({ email });
            const token = await jwt.sign({ user }, config.auth.jwt, { expiresIn: 60 * 60 * 7 });
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
