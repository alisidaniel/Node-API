import { Request, Response, NextFunction } from 'express';
import { singleUpload, base64FileUpload } from '../../utils';
import Brand, { IBrand } from '../models/brandModel';
import { SERVER_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST } from '../types/statusCode';
import { UPDATE_SUCCESS, NOT_FOUND as NOT_FOUND_M, DELETED_SUCCESS } from '../types/messages';

interface IClass {
    create(req: Request, res: Response, next: NextFunction): any;
    edit(req: Request, res: Response, next: NextFunction): any;
    getAll(req: Request, res: Response, next: NextFunction): any;
    getSingle(req: Request, res: Response, next: NextFunction): any;
    destory(req: Request, res: Response, next: NextFunction): any;
}

export default class brandController implements IClass {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, logo, icon, status }: IBrand = req.body;
            if (!logo || !name || !icon)
                return res.status(BAD_REQUEST).json({ message: 'Field(s) can be empty' });
            const imageUri = await singleUpload({
                base64: logo,
                id: `${new Date().getTime()}`,
                path: 'brands',
                type: 'image'
            });
            const iconUri = await singleUpload({
                base64: icon,
                id: `${new Date().getTime()}`,
                path: 'brands',
                type: 'image'
            });
            const response = await Brand.create({
                name,
                logo: imageUri,
                status,
                icon: iconUri
            });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { brandId } = req.params;
            const { name, logo, icon, status }: IBrand = req.body;
            let logo_image;
            let icon_image;
            if (logo) {
                if (base64FileUpload(logo)) {
                    logo_image = await singleUpload({
                        base64: logo,
                        id: `${new Date().getTime()}`,
                        path: 'brands',
                        type: 'image'
                    });
                }
            }
            if (icon) {
                if (base64FileUpload(icon)) {
                    icon_image = await singleUpload({
                        base64: icon,
                        id: `${new Date().getTime()}`,
                        path: 'brands',
                        type: 'image'
                    });
                }
            }
            const response = await Brand.findByIdAndUpdate(brandId, {
                $set: {
                    name,
                    status,
                    logo: logo_image ? logo_image : logo,
                    icon: icon_image ? icon_image : icon
                }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Brand.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async getSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { brandId } = req.params;
            const response = await Brand.findById(brandId);
            if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    public async destory(req: Request, res: Response, next: NextFunction) {
        try {
            const { brandId } = req.params;
            const response = await Brand.deleteOne({ _id: brandId });
            if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
            return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
