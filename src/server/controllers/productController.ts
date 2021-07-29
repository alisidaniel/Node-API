import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/productModel';
import { SUCCESS, SERVER_ERROR, BAD_REQUEST } from '../types/statusCode';
import { DELETED_SUCCESS, UPDATE_SUCCESS, NOT_FOUND } from '../types/messages';
import {
    multipleUpload,
    defaultFilterOptions,
    skipNumber,
    IFilters,
    sortByFormatter,
    sortBy,
    priceRange
} from '../../utils';

interface IProductId {
    productId: string;
}
export default class ProductController {
    static async productSearch(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query;
            const { page, keyWord, take, options }: IFilters = query;
            const searchText = keyWord || '';
            const response = await Product.find({
                $text: { $search: searchText },
                unitPrice: {
                    $gte: priceRange({ from: options?.price?.from }).from,
                    $lte: priceRange({ to: options?.price?.to }).to
                }
            })
                .skip(skipNumber(page))
                .limit(take || defaultFilterOptions.limit)
                .sort({ createdAt: sortByFormatter(options?.sortBy || sortBy.Latest) });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, take, options }: IFilters = req.query;
            const response = await Product.find()
                .skip(skipNumber(page))
                .limit(take || defaultFilterOptions.limit)
                .sort({ createdAt: sortByFormatter(options?.sortBy || sortBy.Latest) });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async getSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const response = await Product.findById(productId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ response });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { image, ...rest }: IProduct = req.body;
            let product = new Product(rest);
            const images = await multipleUpload({ base64Array: image, productId: product._id });
            product.image = images;
            await product.save();
            return res.status(SUCCESS).json({ response: product });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async editSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { ...rest }: IProduct = req.body;
            const { productId } = req.params;
            const response = await Product.findByIdAndUpdate(productId, {
                $set: {
                    ...rest
                }
            });
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async deleteSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const response = await Product.findByIdAndDelete(productId);
            if (!response) return res.status(BAD_REQUEST).json({ message: NOT_FOUND });
            return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
