import jwt from "jsonwebtoken"

export const isLogin=(req,res,next)=>{
    try {
        const {id,role}=jwt.verify(req.headers?.authorization.split(' ')[1],process.env.SECRET_JWT)
        req.userId=id
        req.role=role
        return next()
    } catch (error) {
        return res.status(401).json({
            message:'you must be login',
            success:false
        })
    }
}