import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR, SUCCESS, BAD_REQUEST } from '../types/statusCode';
import { UPDATE_SUCCESS, NOT_FOUND, DELETED_SUCCESS } from '../types/messages';
import Dispute, { IDesK, EStatus } from '../models/disputeModel';
import { getUserFromToken } from '../../utils';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    getQuery(req: Request, res: Response, next: NextFunction): any;
    getAllQuery(req: Request, res: Response, next: NextFunction): any;
    update(req: Request, res: Response, next: NextFunction): any;
    close(req: Request, res: Response, next: NextFunction): any;
    delete(req: Request, res: Response, next: NextFunction): any;
}

export default class disputeController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { subject, message }: IDesK = req.body;
            const { _id } = await getUserFromToken(req);
            const response = await Dispute.create({
                user: _id,
                subject,
                message
            });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getQuery(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            // const
            const { _id } = await getUserFromToken(req);
            const response = await Dispute.findOne({ user: _id });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAllQuery(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const response = await Dispute.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { subject, message }: IDesK = req.body;
            const { disputeId } = req.params;
            if (!subject || !message)
                return res.status(BAD_REQUEST).json({ message: 'Field(s) can not be null.' });
            const state = await Dispute.findById(disputeId);
            if (!state) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            if (state.status === EStatus.Open)
                return res.status(BAD_REQUEST).json({ message: 'Dispute is open can not edit.' });
            const response = await Dispute.findByIdAndUpdate(
                { _id: disputeId },
                {
                    $set: { subject, message }
                }
            );
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async open(req: Request, res: Response, next: NextFunction) {
        try {
            const { disputeId } = req.params;
            const response = await Dispute.findByIdAndUpdate(disputeId, {
                $set: { status: EStatus.Open }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: 'Successfully opened.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async close(req: Request, res: Response, next: NextFunction) {
        try {
            const { disputeId } = req.params;
            const response = await Dispute.findByIdAndUpdate(disputeId, {
                $set: { status: EStatus.Closed }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: 'Successfully closed dispute.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { disputeId } = req.params;
            const response = await Dispute.findByIdAndDelete(disputeId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
