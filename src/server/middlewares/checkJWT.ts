import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['auth'];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.auth.jwt);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).json('Unthorized');
        return;
    }
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.auth.jwt, {
        expiresIn: '1h'
    });
    res.setHeader('token', newToken);

    next();
};
