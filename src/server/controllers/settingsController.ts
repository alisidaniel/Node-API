import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR, SUCCESS, BAD_REQUEST } from '../types/statusCode';
import { UPDATE_SUCCESS, NOT_FOUND, DELETED_SUCCESS } from '../types/messages';
import Setting, { ISetting } from '../models/settingsModel';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    getQuery(req: Request, res: Response, next: NextFunction): any;
    getAllQuery(req: Request, res: Response, next: NextFunction): any;
    update(req: Request, res: Response, next: NextFunction): any;
    delete(req: Request, res: Response, next: NextFunction): any;
}

export default class settingsController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { autoRefund }: ISetting = req.body;
            const exist = await Setting.find();
            if (exist.length > 0)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'You can not have two settings. Try update.' });
            const response = await Setting.create({
                autoRefund
            });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getQuery(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { settingId } = req.params;
            const response = await Setting.findById(settingId);
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAllQuery(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const response = await Setting.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { settingId } = req.params;
            const response = await Setting.updateOne({ _id: settingId }, { $set: { ...req.body } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Error occured.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { settingId } = req.params;
            const response = await Setting.findByIdAndDelete(settingId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
