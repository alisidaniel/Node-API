
export default class AuthController{
    static async test(req:any, res:any, next:any){
        try{
            return res.status(200).json({message:"hello world"});
        }catch(e){
            next(e);
        }
    }
}