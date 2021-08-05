import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../types/statusCode';
import Coupon from '../models/couponModel';

export const couponValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, couponId } = req.params;
        const response = await Coupon.findById(couponId);
        if (!response) return res.status(NOT_FOUND).json({ message: 'Coupon ref does not exist.' });
        const userUseage = await Coupon.findOne({ user: userId });
        // check if user have used this coupon
        if (userUseage)
            return res.status(BAD_REQUEST).json({ message: 'User already applied coupon' });
        // check if coupon is active
        if (!response.status)
            return res.status(BAD_REQUEST).json({ message: 'Coupon is disactivated' });
        // check if coupon have expired
        let now = new Date();
        if (response.expiryTime < now)
            return res.status(BAD_REQUEST).json({ message: 'Coupon has expired' });

        next();
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};

export const applyCouponValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, couponId } = req.body;
        if (couponId.trim() !== '') {
            const response = await Coupon.findById(couponId);
            if (!response)
                return res.status(NOT_FOUND).json({ message: 'Coupon ref does not exist.' });
            // maximum usage check
            if (response.appliedCount == response.entries)
                return res.status(BAD_REQUEST).json({ message: 'Exceeded maximum useage limit.' });
            const userUseage = await Coupon.findOne({ user: userId });
            // check if user have used this coupon
            if (userUseage)
                return res.status(BAD_REQUEST).json({ message: 'User already applied coupon' });
            // check if coupon is active
            if (!response.status)
                return res.status(BAD_REQUEST).json({ message: 'Coupon is disactivated' });
            // check if coupon have expired
            let now = new Date();
            if (response.expiryTime < now)
                return res.status(BAD_REQUEST).json({ message: 'Coupon has expired' });

            next();
        } else {
            next();
        }
    } catch (e) {
        return res.status(SERVER_ERROR).json({ message: e.message });
    }
};
