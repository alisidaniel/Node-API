import { Request, Response, NextFunction } from 'express';
import WebContent, { IWeb } from '../models/webModel';
import { SERVER_ERROR, SUCCESS, BAD_REQUEST, NOT_FOUND } from '../types/statusCode';
import { UPDATE_SUCCESS, NOT_FOUND as NOT_FOUND_M, DELETED_SUCCESS } from '../types/messages';
import { contentResolver } from '../../utils';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    getAll(req: Request, res: Response, next: NextFunction): any;
    getSingle(req: Request, res: Response, next: NextFunction): any;
    destory(req: Request, res: Response, next: NextFunction): any;
}

export default class webController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: IWeb = req.body;
            const data = await contentResolver(rest, req.body.id);
            return res.status(SUCCESS).json({ data });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await WebContent.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await WebContent.findById(id);
            if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async destory(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await WebContent.deleteOne({ _id: req.params.id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
