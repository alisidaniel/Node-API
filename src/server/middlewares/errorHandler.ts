import { Request, Response, NextFunction } from 'express';

const errorHandler = (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
};

export default errorHandler;
