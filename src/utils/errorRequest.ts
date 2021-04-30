import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import winston from 'winston';

interface Error {
    status?: number;
    message?: string;
}

const requestError = function (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
) {
    winston.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    console.log('Hello this is the sattsu', err.status);
    //error
    //warn
    //verbose
    //debug
    //silly
    res.status(500).json({ message: err.message, status: err.status || 500 });
};

export default requestError;
