import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import winston from 'winston';
import moment from 'moment';

const getTimeStamp = (): string => new Date().toISOString();

const requestError = function (err: any, req: Request, res: Response, next: NextFunction) {
    winston.error(
        `${err.statusCode || 500} - ${err.statusMessage} - ${req.originalUrl} - ${req.method} - ${
            req.ip
        } -${moment(getTimeStamp()).format('MMMM Do YYYY, h:mm:ss a')}`
    );
    //error
    //warn
    //verbose
    //debug
    //silly
};

export default requestError;
