import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers?.authorization?.split(' ')[1];
        let jwtPayload = <any>jwt.verify(token, config.auth.jwt);
        res.locals.jwtPayload = jwtPayload;
        const user = jwtPayload;
        const newToken = jwt.sign(user, config.auth.jwt, {
            expiresIn: '1h'
        });
        res.setHeader('token', newToken);

        next();
    } catch (error) {
        next({
            message: 'Unthorized',
            status: 401
        });
    }
};
