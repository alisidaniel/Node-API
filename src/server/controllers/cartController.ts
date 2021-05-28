import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { getUserFromToken } from '../../utils';
import Cart from '../models/cartModel';
import Controlled from '../models/controlledProductModel';
import { singleUpload } from '../../utils';
interface IRequest {
    productId: string;
    quantity: number;
    variation: string;
    prescription_image: string;
}

export default class cartContoller {
    static async addToCart(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId, quantity, variation, prescription_image }: IRequest = req.body;
            const { _id } = await getUserFromToken(req);
            const cartItem = await Cart.findOne({ user: _id });
            if (!cartItem) {
                await Cart.create({
                    user: _id,
                    products: [
                        {
                            product: productId,
                            quantity,
                            variation
                        }
                    ]
                });
            } else {
                let cartItem = await Cart.find({ user: _id });
                let products = cartItem[0].products;
                let count = 0;
                for (let i = 0; i < products.length; i++) {
                    // if product exist increment quantity by 1
                    if (products[i].product == productId) {
                        count++;
                        // increment quantity if product is in array of products
                        if (products[i].quantity === quantity) {
                            // increment by 1
                            products[i].quantity += 1;
                            if (!products[i].variation.includes(variation)) {
                                // Change to new variation
                                products[i].variation.push(variation);
                            }
                            break;
                        } else {
                            // replace with new quantity
                            products[i].quantity = quantity;
                            if (!products[i].variation.includes(variation)) {
                                // Change to new variation
                                products[i].variation.push(variation);
                            }
                        }
                        break;
                    }
                }
                if (count === 0) {
                    products.push({
                        product: productId,
                        quantity,
                        variation
                    });
                }

                await Cart.updateOne(
                    { user: _id },
                    {
                        $set: {
                            products: products
                        }
                    }
                );
            }
            if (prescription_image) {
                const isExist = await Controlled.findOne({ user: _id, product: productId });
                const image = await singleUpload({
                    base64: prescription_image,
                    id: productId,
                    imageType: 'Controlled-products'
                });
                console.log(image);
                if (isExist) {
                    //do update
                    await Controlled.updateOne(
                        { _id: isExist._id },
                        {
                            $set: {
                                photo: image
                            }
                        }
                    );
                } else {
                    // do create
                    await Controlled.create({
                        photo: image,
                        product: productId,
                        user: _id
                    });
                }
            }
            const cart = await Cart.findOne({ user: _id });
            return res.status(SUCCESS).json({ cart });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async updateCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId, quantity, variation }: IRequest = req.body;
            const { _id } = await getUserFromToken(req);
            const cartItem = await Cart.findOne({ user: _id });
            if (!cartItem) return res.status(NOT_FOUND).json({ message: 'Cart is empty' });
            let products = cartItem.products;
            let count = 0;
            for (let i = 0; i < products.length; i++) {
                if (products[i].product == productId) {
                    count++;
                    // Update cart
                    products[i].quantity = quantity;
                    if (!products[i].variation.includes(variation) && variation.trim() !== '') {
                        // Change to new variation
                        products[i].variation.push(variation);
                    }

                    const response = await Cart.updateOne(
                        { user: _id },
                        { $set: { products: products } }
                    );
                    if (response.nModified === 1)
                        return res.status(SUCCESS).json({ message: 'Cart updated successfully' });
                }
            }
            if (count === 0)
                return res.status(BAD_REQUEST).json({ message: 'Product not found in cart.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async deleteItemFromCart(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const { _id } = await getUserFromToken(req);
            const cartItem = await Cart.findOne({ user: _id });
            if (!cartItem) return res.status(NOT_FOUND).json({ message: 'Cart is empty' });
            let products = cartItem.products;
            let count = 0;
            for (let i = 0; i < products.length; i++) {
                if (products[i].product == productId) {
                    count++;
                    products.splice(i, 1);
                    const response = await Cart.updateOne(
                        { user: _id },
                        { $set: { products: products } }
                    );
                    if (response.nModified === 1)
                        return res.status(SUCCESS).json({ message: 'Cart deleted successfully' });
                }
            }
            if (count === 0)
                return res.status(BAD_REQUEST).json({ message: 'Product not found in cart.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }

    static async deleteCart(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = await getUserFromToken(req);
            const response = await Cart.deleteOne({ user: _id });
            if (response.n === 1) return res.status(SUCCESS).json({ message: 'Cart Cleared.' });
            if (response.n === 0) return res.status(NOT_FOUND).json({ message: 'Cart not found.' });
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
