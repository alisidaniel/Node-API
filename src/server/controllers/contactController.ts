import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import Contact, { Icontact } from '../models/contactModel';

interface IClass {
    create: (req: Request, res: Response, next: NextFunction) => any;
    edit: (req: Request, res: Response, next: NextFunction) => any;
    getSingle: (req: Request, res: Response, next: NextFunction) => any;
    getAll: (req: Request, res: Response, next: NextFunction) => any;
}

export default class contactController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: Icontact = req.body;
            const response = await Contact.create({ ...rest });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: Icontact = req.body;
            const { contactId } = req.params;
            const response = await Contact.updateOne({ _id: contactId }, { $set: { ...rest } });
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'Not found' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { contactId } = req.params;
            const response = await Contact.findById(contactId);
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Contact.find({});
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
