import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR, SUCCESS, BAD_REQUEST, NOT_FOUND } from '../types/statusCode';
import { UPDATE_SUCCESS, NOT_FOUND as NOT_FOUND_M, DELETED_SUCCESS } from '../types/messages';
import Admin, { IAdmin } from '../models/adminModel';
import { singleUpload, base64FileUpload } from '../../utils';
import Order, { EType, EStatus as IStatus } from '../models/orderModel';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    edit(req: Request, res: Response, next: NextFunction): any;
    getAll(req: Request, res: Response, next: NextFunction): any;
    getSingle(req: Request, res: Response, next: NextFunction): any;
    destory(req: Request, res: Response, next: NextFunction): any;
}

export default class deliveryManController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { deliveryManDocs, photo, ...rest }: IAdmin = req.body;
            const user = new Admin({ ...rest });
            user.isDeliveryMan = true;
            const photoUri = await singleUpload({
                base64: photo,
                id: `${new Date().getTime()}`,
                path: 'deliveryMan',
                type: 'image'
            });
            const verification = await singleUpload({
                base64: deliveryManDocs?.verification,
                id: `${new Date().getTime()}`,
                path: 'deliveryMan',
                type: 'image'
            });
            const guarrantor = await singleUpload({
                base64: deliveryManDocs?.guarrantor,
                id: `${new Date().getTime()}`,
                path: 'deliveryMan',
                type: 'image'
            });
            user.photo = photoUri;
            user.deliveryManDocs = {
                verification,
                guarrantor
            };
            await user.save();
            return res.status(SUCCESS).json({ message: 'Successfully created delivery man.' });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }
    public async edit(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { deliveryManDocs, photo, ...rest }: IAdmin = req.body;
            const { id } = req.params;
            let photo_image;
            let verify_image;
            let guarrantor_image;
            if (deliveryManDocs?.guarrantor) {
                if (base64FileUpload(deliveryManDocs?.guarrantor)) {
                    guarrantor_image = await singleUpload({
                        base64: deliveryManDocs?.guarrantor,
                        id: `${new Date().getTime()}`,
                        path: 'deliveryMan',
                        type: 'image'
                    });
                }
            }
            if (deliveryManDocs?.verification) {
                if (base64FileUpload(deliveryManDocs?.verification)) {
                    verify_image = await singleUpload({
                        base64: deliveryManDocs?.verification,
                        id: `${new Date().getTime()}`,
                        path: 'deliveryMan',
                        type: 'image'
                    });
                }
            }
            if (photo) {
                if (base64FileUpload(photo)) {
                    photo_image = await singleUpload({
                        base64: photo,
                        id: `${new Date().getTime()}`,
                        path: 'deliveryMan',
                        type: 'image'
                    });
                }
            }

            const response = await Admin.findByIdAndUpdate(id, {
                $set: {
                    ...rest,
                    photo: photo_image ? photo_image : photo,
                    deliveryManDocs: {
                        verification: deliveryManDocs?.verification
                            ? verify_image
                            : deliveryManDocs?.verification,
                        guarrantor: deliveryManDocs?.guarrantor
                            ? guarrantor_image
                            : deliveryManDocs?.guarrantor
                    }
                }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const response = await Admin.find({ isDeliveryMan: true });
            return res.status(SUCCESS).json({ response });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }
    public async getSingle(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await Admin.findById(id);
            if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ response });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }
    public async destory(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await Admin.deleteOne({ _id: id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }

    public async assignDeliveryMan(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { id, orderId } = req.body;
            const response = await Order.findByIdAndUpdate(orderId, { $set: { deliveryMan: id } });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }

    public async deliveryPicker(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            let occupied = new Array();
            let picked = new Array();
            let listOfUsers = new Array();
            // query all pending, processing orders to check valaible.
            const order = await Order.find({
                $or: [{ status: IStatus.Pending }, { status: IStatus.Processing }]
            });
            order.forEach((item: any) => {
                picked.push(item.deliveryMan);
            });
            // check occurrance of each _id in array if it's upto 10 remove from available array
            const countOccurrences = (arr: any, val: any) =>
                arr.reduce((a: any, v: any) => (v === val ? a + 1 : a), 0);

            order.forEach((item: any) => {
                const num = countOccurrences(picked, item.deliveryMan);
                if (num >= 10 && item.deliveryMan) {
                    // push those that has pending or processing orders greater than 10 to occupied.
                    occupied.push(item.deliveryMan);
                }
            });

            let users = await Admin.find({ isDeliveryMan: true });
            users.forEach((item: any, index: any) => {
                //push a deliverymen to listOfUsers and remove those occpuied from list
                listOfUsers.push(item._id);
                occupied.forEach((el: any) => {
                    if (item._id == el) {
                        listOfUsers.splice(index, 1);
                    }
                });
            });

            const response = await Admin.find({ _id: { $in: listOfUsers } });
            return res.status(SUCCESS).json({ response });
        } catch (err) {
            return res.status(SERVER_ERROR).json({ message: err.message });
        }
    }
}
