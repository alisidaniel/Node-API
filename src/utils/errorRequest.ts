import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import winston from 'winston';

const requestError = function (err: any, req: Request, res: Response, next: NextFunction) {
    winston.error(
        `${err.statusCode || 500} - ${err.statusMessage} - ${req.originalUrl} - ${req.method} - ${
            req.ip
        }`
    );

    //error
    //warn
    //verbose
    //debug
    //silly
    res.status(500).json({ message: err.message, status: err.status || 500 });
};

export default requestError;
