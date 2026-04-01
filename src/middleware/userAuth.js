import jwt from "jsonwebtoken";
export const userAuth = async (req, res, next)=>{
    const token =  req.cookies?.token;
    if(!token){
        return res.json({ success: false, message: "not authrized user"})
    }
    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRAT);
        if(tokenDecoded.id){
            req.userId = tokenDecoded.id;
        }else{
            return res.json({ success: false, message: "not authrized user blockd by token"})
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}




