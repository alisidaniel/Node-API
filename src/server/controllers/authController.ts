import express, { Request, Response, NextFunction } from 'express';

interface IAuth<T> {
    login: () => T;
    register: () => T;
    sendPasswordResetToken: () => T;
    resetPassword: () => T;
}
export default class AuthController<IAuth> {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ message: 'hello world' });
        } catch (e) {
            next(e);
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {}

    static async sendPasswordResetToken(req: Request, res: Response, next: NextFunction) {}

    static async resetPassword(req: Request, res: Response, next: NextFunction) {}
}
