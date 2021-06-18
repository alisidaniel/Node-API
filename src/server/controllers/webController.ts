// import { Request, Response, NextFunction } from 'express';
// import WebContent, { IWeb } from '../models/webModel';
// import { singleUpload } from '../../utils';
// import { SERVER_ERROR, SUCCESS, BAD_REQUEST, NOT_FOUND } from '../types/statusCode';
// import { UPDATE_SUCCESS, NOT_FOUND as NOT_FOUND_M, DELETED_SUCCESS } from '../types/messages';

// interface IClass {
//     create(req: Request, res: Response, next: NextFunction): any;
//     edit(req: Request, res: Response, next: NextFunction): any;
//     getAll(req: Request, res: Response, next: NextFunction): any;
//     getSingle(req: Request, res: Response, next: NextFunction): any;
//     destory(req: Request, res: Response, next: NextFunction): any;
// }

// export default class webController implements IClass {
//     public async create(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { vissionPhoto, missionPhoto, heroImage }: IWeb = req.body;

//             if (missionPhoto || vissionPhoto || heroImage) {
//                 const missionUrl = await singleUpload({
//                     base64: logo,
//                     id: `${new Date().getTime()}`,
//                     imageType: 'blogs'
//                 });
//                 const response = await Blog.create({
//                     heading,
//                     content,
//                     logo: logoUrl
//                 });
//                 return res.status(SUCCESS).json({ response });
//             } else {
//                 const response = await Blog.create({
//                     heading,
//                     content
//                 });
//                 return res.status(SUCCESS).json({ response });
//             }
//         } catch (e) {
//             return res.status(SERVER_ERROR).json({ message: e.message });
//         }
//     }

//     public async edit(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { blogId } = req.params;
//             const { heading, content, logo }: IBlog = req.body;
//             if (logo) {
//                 const logoUrl = await singleUpload({
//                     base64: logo,
//                     id: `${new Date().getTime()}`,
//                     imageType: 'blogs'
//                 });
//                 const response = await Blog.updateOne(
//                     { _id: blogId },
//                     {
//                         $set: {
//                             heading,
//                             content,
//                             logo: logoUrl
//                         }
//                     }
//                 );
//                 if (response.nModified === 1)
//                     return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
//                 return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
//             } else {
//                 const response = await Blog.updateOne(
//                     { _id: blogId },
//                     {
//                         $set: {
//                             ...req.body
//                         }
//                     }
//                 );
//                 if (response.nModified === 1)
//                     return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
//                 return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
//             }
//         } catch (e) {
//             return res.status(SERVER_ERROR).json({ message: e.message });
//         }
//     }

//     public async getAll(req: Request, res: Response, next: NextFunction) {
//         try {
//             const response = await Blog.find();
//             return res.status(SUCCESS).json({ response });
//         } catch (e) {
//             return res.status(SERVER_ERROR).json({ message: e.message });
//         }
//     }

//     public async getSingle(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { blogId } = req.params;
//             const response = await Blog.findById(blogId);
//             if (!response) return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
//             return res.status(SUCCESS).json({ response });
//         } catch (e) {
//             return res.status(SERVER_ERROR).json({ message: e.message });
//         }
//     }

//     public async destory(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { blogId } = req.params;
//             const response = await Blog.deleteOne({ _id: blogId });
//             if (response.n === 1) return res.status(SUCCESS).json({ message: DELETED_SUCCESS });
//             return res.status(NOT_FOUND).json({ message: NOT_FOUND_M });
//         } catch (e) {
//             return res.status(SERVER_ERROR).json({ message: e.message });
//         }
//     }
// }
