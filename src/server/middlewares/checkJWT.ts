import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers?.authorization?.split(' ')[1];
    try {
        let jwtPayload;
        jwtPayload = <any>jwt.verify(token, config.auth.jwt);
        res.locals.jwtPayload = jwtPayload;
        const { userId, username } = jwtPayload;
        const newToken = jwt.sign({ userId, username }, config.auth.jwt, {
            expiresIn: '1h'
        });
        res.setHeader('token', newToken);

        next();
    } catch (error) {
        res.status(401).json('UnAuthorized');
        return;
    }
};
