import { Request, Response, NextFunction } from 'express';
export default class ProductController {
    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    }

    static async getSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    }

    static async editSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    }

    static async deleteSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    }
}
