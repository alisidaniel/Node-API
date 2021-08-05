import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/categoryModel';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../types/statusCode';
import { UPDATE_SUCCESS, DELETED_SUCCESS, NOT_FOUND } from '..//types/messages';

export default class CategoryController {
    static async initiate(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async postMessage(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async getRecentConversation(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async getConversationByRoomId(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async markConversationReadByRoomId(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async deleteRoomById(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
    static async deleteMessageById(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            return res.status(SERVER_ERROR).json({ message: e.message });
        }
    }
}
