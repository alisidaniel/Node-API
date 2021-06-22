import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import Card, { ICard } from '../models/cardModel';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import { getUserFromToken } from '../../utils';

interface IClass {
    create: (req: Request, res: Response, next: NextFunction) => any;
    edit: (req: Request, res: Response, next: NextFunction) => any;
    getUsercards: (req: Request, res: Response, next: NextFunction) => any;
    getSingle: (req: Request, res: Response, next: NextFunction) => any;
    getAll: (req: Request, res: Response, next: NextFunction) => any;
    delete: (req: Request, res: Response, next: NextFunction) => any;
}

export default class cardController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: ICard = req.body;
            const response = await Card.create({ ...rest });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { cardId } = req.params;
            const { ...rest }: ICard = req.body;
            const response = await Card.updateOne({ _id: cardId }, { $set: { ...rest } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'Not found' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getUsercards(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = await getUserFromToken(req);
            const response = await Card.find({ user: _id });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { cardId } = req.params;
            const response = await Card.findOne({ _id: cardId });
            if (!response) return res.status(NOT_FOUND).json({ message: 'Not found' });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Card.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { cardId } = req.params;
            const response = await Card.deleteOne({ _id: cardId });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'NOT FOUND' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
