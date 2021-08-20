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

interface IReview {
    user: string;
    rate: number;
    comment: string;
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
                .limit(!take ? defaultFilterOptions.limit : parseInt(take))
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
                .limit(!take ? defaultFilterOptions.limit : parseInt(take))
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

    static async submitReview(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, rate, comment }: IReview = req.body;
            const { productId } = req.params;
            const response = await Product.findByIdAndUpdate(
                productId,
                {
                    $push: { reviews: { user, rate, comment } }
                },
                { new: true }
            );
            let rateSum = 0;
            let count = 0;
            response.reviews.forEach((el: any) => {
                rateSum += el.rate;
                count++;
            });
            let rating = (rateSum / count).toFixed(1);
            await Product.updateOne({ _id: productId }, { $set: { rating: rating } });

            return res.status(SUCCESS).json({ message: 'Successfully submited review and rating' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
