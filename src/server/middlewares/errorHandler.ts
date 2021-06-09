import { Request, Response, NextFunction } from 'express';
import { router } from '../../utils/router';

router.get('*', (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
});

router.post('*', (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
});
router.put('*', (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
});

router.patch('*', (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
});

router.delete('*', (request: Request, response: Response, next: NextFunction) => {
    const error = new Error('Invalid api route');
    next(
        response.status(404).json({
            message: error.message
        })
    );
});

export default router;
