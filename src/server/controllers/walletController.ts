import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { getUserFromToken, generateRef, paystackService, financeLoger } from '../../utils';
import { DELETED_SUCCESS, UPDATE_SUCCESS } from '../types/messages';
import Withdraw, { IStatus, IWithdraw } from '../models/withdrawModel';
import User from '../models/userModel';

interface IClass {
    withrawals: (req: Request, res: Response, next: NextFunction) => any;
    userWithdraws: (req: Request, res: Response, next: NextFunction) => any;
    singleWithdraw: (req: Request, res: Response, next: NextFunction) => any;
    makeWithdrawalRequest: (req: Request, res: Response, next: NextFunction) => any;
    editWithdraw: (req: Request, res: Response, next: NextFunction) => any;
    deleteWithdraw: (req: Request, res: Response, next: NextFunction) => any;
    topUp: (req: Request, res: Response, next: NextFunction) => any;
    disburseOrReject: (req: Request, res: Response, next: NextFunction) => any;
}

interface ITopUp {
    transactionRef: string;
}

export default class walletController implements IClass {
    public async withrawals(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Withdraw.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    public async userWithdraws(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = await getUserFromToken(req);
            const response = await Withdraw.find({ user: _id });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async singleWithdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { withdrawId } = req.params;
            const response = await Withdraw.findOne({ _id: withdrawId });
            if (!response) return res.status(NOT_FOUND).json({ message: 'Not found' });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async makeWithdrawalRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: IWithdraw = req.body;

            // check if admin setting for automatic withdrawal is set to true
            // disburse with paystack service
            const withdraw = new Withdraw({ ...rest });
            withdraw.reference = `MIDW-${generateRef(10)}`;
            withdraw.save();
            return res.status(SUCCESS).json({ withdraw });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async editWithdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { widthdrawId } = req.params;
            const { ...rest }: IWithdraw = req.body;
            const response = await Withdraw.findOne({ _id: widthdrawId });
            if (!response) return res.status(NOT_FOUND).json({ message: 'Not found' });
            if (response.status !== IStatus.Pending)
                return res.status(BAD_REQUEST).json({
                    message: 'Withdraw has left pending state. Therefore can not be updated.'
                });
            const responseData = await Withdraw.updateOne(
                { _id: widthdrawId },
                { $set: { ...rest } }
            );
            if (responseData.nModified === 1)
                return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });

            return res.status(BAD_REQUEST).json({ message: 'Error occured, please try again' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async deleteWithdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { widthdrawId } = req.params;
            const response = await Withdraw.findOne({ _id: widthdrawId });
            if (!response) return res.status(NOT_FOUND).json({ message: 'Not found' });
            if (response.status !== IStatus.Pending)
                return res.status(BAD_REQUEST).json({
                    message: 'Withdraw has left pending state. Therefore can not be deleted.'
                });
            const responseData = await Withdraw.deleteOne({ _id: widthdrawId });
            if (responseData.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(BAD_REQUEST).json({ message: 'Error occured, please try again' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async topUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionRef }: ITopUp = req.body;
            const { _id } = await getUserFromToken(req);
            const user = await User.findById(_id);
            const response = await paystackService.verifyTransaction(transactionRef);
            if (!response)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Payment verification failed, please try again.' });
            const responseData = await paystackService.getTransaction(transactionRef);

            const args = {
                userId: _id,
                amount: responseData.data.amount,
                oldBalance: user.walletBalance,
                newBalance: user.walletBalance + responseData.data.amount,
                entity: 'User',
                entityId: _id,
                transactionCode: '001'
            };
            const transactionLogger = await new financeLoger();
            transactionLogger.transactionLog(args);
            return res.status(SUCCESS).json({ message: 'Wallet Funded' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async disburseOrReject(req: Request, res: Response, next: NextFunction) {
        try {
            const { withdrawId } = req.params;
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
