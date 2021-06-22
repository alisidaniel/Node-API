import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import Bank, { IBank } from '../models/bankModel';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import { getUserFromToken } from '../../utils';

interface IClass {
    create: (req: Request, res: Response, next: NextFunction) => any;
    edit: (req: Request, res: Response, next: NextFunction) => any;
    getSingle: (req: Request, res: Response, next: NextFunction) => any;
    getAll: (req: Request, res: Response, next: NextFunction) => any;
    getUserbanks: (req: Request, res: Response, next: NextFunction) => any;
    delete: (req: Request, res: Response, next: NextFunction) => any;
}

export default class bankController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: IBank = req.body;
            const response = await Bank.create({ ...rest });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { bankId } = req.params;
            const { ...rest }: IBank = req.body;
            const response = await Bank.updateOne({ _id: bankId }, { $set: { ...rest } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'Not found' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getUserbanks(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = await getUserFromToken(req);
            const response = await Bank.find({ user: _id });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { bankId } = req.params;
            const response = await Bank.findOne({ _id: bankId });
            if (!response) return res.status(NOT_FOUND).json({ message: 'Not found' });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Bank.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { bankId } = req.params;
            const response = await Bank.deleteOne({ _id: bankId });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'NOT FOUND' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
