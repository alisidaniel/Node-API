import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/categoryModel';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { UPDATE_SUCCESS, DELETED_SUCCESS, NOT_FOUND } from '../types/messages';
import { fileUploadType, singleUpload } from '../../utils';

export default class CategoryController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { coverImage, icon, status, subcategory, name }: ICategory = req.body;
            if (!coverImage || !icon)
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'Field(s) icon, cover_image is required.' });
            const cover_image = await singleUpload({
                base64: coverImage,
                id: `${new Date().getTime()}`,
                path: 'category',
                type: 'image'
            });
            const icon_image = await singleUpload({
                base64: icon,
                id: `${new Date().getTime()}`,
                path: 'category',
                type: 'image'
            });
            const response = await Category.create({
                name,
                subcategory,
                status,
                coverImage: cover_image,
                icon: icon_image
            });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async edit(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, subcategory }: ICategory = req.body;
            const { categoryId } = req.params;
            const response = await Category.findByIdAndUpdate(categoryId, {
                $set: { name, subcategory }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Category.find();
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;
            const response = await Category.findById(categoryId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;
            const response = await Category.findByIdAndDelete(categoryId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
