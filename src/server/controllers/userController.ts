import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import { SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { getUserFromToken } from '../../utils';

export default class UserController {
    static async editProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { photo, phone, gender, address, health_description, ePin }: IUser = req.body;
            const user = await getUserFromToken(req);
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        photo,
                        phone,
                        gender,
                        address,
                        health_description,
                        ePin
                    }
                }
            );
            const result = await User.findOne({ _id: user._id });
            return res.status(SUCCESS).json({ result });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
