import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import winston from 'winston';

interface Error {
    status?: number;
    message?: string;
}

const requestError = function (err: any, req: Request, res: Response, next: NextFunction) {
    winston.error(
        `${err.statusCode || 500} - ${err.statusMessage} - ${req.originalUrl} - ${req.method} - ${
            req.ip
        }`
    );

    console.log('Hello this is the sattsu', err.statusCode);
    //error
    //warn
    //verbose
    //debug
    //silly
};

export default requestError;
