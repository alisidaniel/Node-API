import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '../types/statusCode';
import Product from '../models/productModel';

const validMongoId = async (id: string) => {
    let checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
    if (!checkForValidMongoDbID.test(id)) return false;
    return true;
};

export const productExist = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body;
    const validId = await validMongoId(productId);
    if (!validId) return res.status(BAD_REQUEST).json({ message: 'Invalid product id.' });
    const item = await Product.findOne({ _id: productId });
    if (!item) {
        return res.status(BAD_REQUEST).json({ message: 'Product not found.' });
    } else {
        next();
    }
};

export const variationExist = async (req: Request, res: Response, next: NextFunction) => {
    const { variation, productId } = req.body;
    if (variation) {
        if (typeof variation == 'string' && variation.trim() === '') {
            return res.status(BAD_REQUEST).json({ message: "Variation can't be empty string." });
        }
        const validId = await validMongoId(productId);
        if (!validId) return res.status(BAD_REQUEST).json({ message: 'Invalid product id.' });
        const item = await Product.findOne({ _id: productId });
        const itemVariation = item.variation;
        let count = 0;
        itemVariation.forEach((e: any) => {
            if (e._id == variation) {
                count++;
            }
        });
        if (count > 0 || variation.trim() === '') {
            next;
        } else {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'Variation not found for this product.' });
        }
    }
    next();
};

export const isControlled = async (req: Request, res: Response, next: NextFunction) => {
    const { productId, prescription_image } = req.body;
    const product = await Product.findOne({ _id: productId });
    if (product.controlled && !prescription_image) {
        return res.status(BAD_REQUEST).json({ message: 'Please upload doctors prescription.' });
    } else if (product.controlled && prescription_image) {
        next();
    } else if (!product.controlled) {
        next();
    }
};
