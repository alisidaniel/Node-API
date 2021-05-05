import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import { SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { getUserFromToken } from '../../utils';

export default class UserController {
    static async editProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { photo, phone, gender, address, health_description }: IUser = req.body;
            const user = await getUserFromToken(req);
            await User.findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        photo,
                        phone,
                        gender,
                        address,
                        health_description
                    }
                },
                {
                    new: true
                }
            ).exec((err: any, result: any) => {
                if (err) {
                    throw new Error(err);
                } else {
                    return res.status(SUCCESS).json({ result });
                }
            });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
