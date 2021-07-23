import { Request, Response, NextFunction } from 'express';
import FlatRate, { IFlateR } from '..//models/flatRateModel';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    edit(req: Request, res: Response, next: NextFunction): any;
    getAll(req: Request, res: Response, next: NextFunction): any;
    getSingle(req: Request, res: Response, next: NextFunction): any;
    destory(req: Request, res: Response, next: NextFunction): any;
}

export default class flatRateController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: IFlateR = req.body;
            const response = await FlatRate.create({ ...rest });
            return res.status(200).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { ...rest }: IFlateR = req.body;
            const response = await FlatRate.updateOne({ _id: id }, { $set: { rest } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'Not found' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await FlatRate.find();
            return res.status(200).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await FlatRate.findById(id);
            return res.status(200).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async destory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await FlatRate.deleteOne({ _id: id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'NOT FOUND' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
