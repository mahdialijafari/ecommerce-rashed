 const catchError=(err,req,res,next)=>{
    console.log(err)
    err.statusCode=err.statusCode || 500
    err.status=err.status||'error'  
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        success:false
    })
}
export default catchError
