import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR, SUCCESS, BAD_REQUEST, NOT_FOUND } from '../types/statusCode';
import Coupon, { ICoupon } from '../models/couponModel';
import { generateRef } from '../../utils';
import { UPDATE_SUCCESS, NOT_FOUND as NOT_FOUND_M, DELETED_SUCCESS } from '../types/messages';

interface IClass {
    applyCoupon(req: Request, res: Response, next: NextFunction): any;
    create(req: Request, res: Response, next: NextFunction): any;
    edit(req: Request, res: Response, next: NextFunction): any;
    getAll(req: Request, res: Response, next: NextFunction): any;
    getSingle(req: Request, res: Response, next: NextFunction): any;
    destory(req: Request, res: Response, next: NextFunction): any;
}

export default class couponController implements IClass {
    public async applyCoupon(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { userId, couponId } = req.params;
            if (couponId.trim() === '' || userId.trim() === '' || req.params.amount.trim() === '')
                return res.status(BAD_REQUEST).json({ message: 'Field(s) request can be empty' });
            const response = await Coupon.findById(couponId);
            const newPrice: number = parseInt(req.params.amount) - response.discount;
            return res.status(SUCCESS).json({ newPrice });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { type, discount, expiryTime, userId }: ICoupon = req.body;
            const code = generateRef(15);
            const response = await Coupon.create({
                code: `midlman${code}`,
                type,
                discount,
                expiryTime
            });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    public async edit(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { type, discount, expiryTime, status }: ICoupon = req.body;
            const { couponId } = req.params;
            const response = await Coupon.findByIdAndUpdate(couponId, {
                $set: { type, discount, expiryTime, status }
            });
            if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const response = await Coupon.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    public async getSingle(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { couponId } = req.params;
            const response = await Coupon.findById(couponId);
            if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    public async destory(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { couponId } = req.params;
            const response = await Coupon.deleteOne({ _id: couponId });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
