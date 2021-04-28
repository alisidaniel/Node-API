import express, {Request, Response, NextFunction} from "express";
export default class AuthController{
    static async test(req:Request, res:Response, next:NextFunction){
        try{
            return res.status(200).json({message:"hello world"});
        }catch(e){
            next(e);
        }
    }
}