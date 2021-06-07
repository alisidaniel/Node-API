import { model, Schema, Document } from 'mongoose';

export interface ICoupon {
    type: string;
    discount: string;
    expiryTime: Date;
}

interface CouponDocument extends ICoupon, Document {}

const couponModel = new Schema<CouponDocument>(
    {
        code: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        discount: {
            type: String,
            required: true
        },
        expiryTime: {
            type: Date
        },
        entries: {
            type: Number,
            default: 0
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Coupon = model('Coupon', couponModel);

export default Coupon;
