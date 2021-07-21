import { Request, Response, NextFunction } from 'express';
import Transfer, { IStatus, ITransfer } from '../models/transferModel';
import User from '../models/userModel';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import { getUserFromToken, generateRef, financeLoger, singleUpload } from '../../utils';

interface IClass {
    create: (req: Request, res: Response, next: NextFunction) => any;
    edit: (req: Request, res: Response, next: NextFunction) => any;
    getSingle: (req: Request, res: Response, next: NextFunction) => any;
    getAll: (req: Request, res: Response, next: NextFunction) => any;
    approveOrReject: (req: Request, res: Response, next: NextFunction) => any;
    getUserTransfer: (req: Request, res: Response, next: NextFunction) => any;
    deletetransfer: (req: Request, res: Response, next: NextFunction) => any;
}

export default class TransferController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { image, depositor, amount }: ITransfer = req.body;
            const { _id } = await getUserFromToken(req);
            const imageUri = await singleUpload({
                base64: image,
                id: `${new Date().getTime()}`,
                path: 'transfer',
                type: 'image'
            });
            const response = await Transfer.create({
                image: imageUri,
                user: _id,
                depositor,
                amount
            });
            return res.status(SUCCESS).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { amount, depositor }: ITransfer = req.body;
            const { id } = req.params;
            const responseData = await Transfer.findOne({ _id: id });
            if (!responseData) return res.status(NOT_FOUND).json({ message: 'Not Found.' });
            if (responseData.status !== IStatus.Pending)
                return res.status(BAD_REQUEST).json({ message: 'Error can not update this time.' });
            const response = await Transfer.updateOne(
                { _id: id },
                { $set: { depositor: depositor, amount: amount } }
            );
            if (response.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Error occured.' });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await Transfer.findOne({ _id: id });
            return res.status(200).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Transfer.find();
            return res.status(200).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async approveOrReject(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, transferId } = req.body;
            if (IStatus.Approved === status) {
                // Check
                const transferData = await Transfer.findOne({ _id: transferId });
                const user = await User.findOne({ _id: transferData.user });
                const args = {
                    userId: user._id,
                    amount: transferData.amount,
                    oldBalance: user.walletBalance,
                    newBalance: user.walletBalance + transferData.amount,
                    entity: 'Transfer',
                    entityId: transferData._id,
                    transactionCode: '004'
                };
                const transactionLogger = await new financeLoger();
                transactionLogger.transactionLog(args);
            }
            if (IStatus.Rejected === status) {
                const response = await Transfer.updateOne(
                    { _id: transferId },
                    { $set: { status: IStatus.Rejected } }
                );
                if (response.nModified === 1)
                    return res.status(SUCCESS).json({ message: 'Rejected Successful.' });
            }

            return res.status(BAD_REQUEST).json({ message: 'Error check status field.' });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async getUserTransfer(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const response = await Transfer.find({ user: userId });
            return res.status(200).json({ response });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }

    public async deletetransfer(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const responseData = await Transfer.findOne({ _id: id });
            if (!responseData) return res.status(NOT_FOUND).json({ message: 'Not Found.' });
            if (responseData.status !== IStatus.Pending)
                return res.status(BAD_REQUEST).json({ message: 'Error can not update this time.' });
            const response = await Transfer.deleteOne({ _id: id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: 'NOT FOUND' });
        } catch (error) {
            return res.status(SERVER_ERROR).json({ message: error.message });
        }
    }
}
