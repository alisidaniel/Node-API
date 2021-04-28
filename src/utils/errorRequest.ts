import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import winston from 'winston';

const requestError = function (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
) {
    winston.error(`${err || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    //error
    //warn
    //verbose
    //debug
    //silly

    res.status(500).json({ message: err, status: err || 500 });
};

export default requestError;
