import { NextFunction, Request, Response } from 'express';
import { getUserFromToken } from '../../utils/findUser';

import { BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED } from '../types/statusCode';

export const isActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { active } = await getUserFromToken(req);
        if (!active)
            return res.status(UNAUTHORIZED).json({ message: 'Account has been disabled.' });
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({ message: err.message });
    }
};
