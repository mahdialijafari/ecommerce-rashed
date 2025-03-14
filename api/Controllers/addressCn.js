import catchAsync from "../Utils/catchAsync";
import Address from "../Models/addressMd";
import ApiFeatures from "../Utils/apiFeatures";
import HandleERROR from "../Utils/handleError";


export const create=catchAsync(async(req,res,next)=>{
    const address=await Address.create({...req.body,userId:req.userId})
    return res.status(200).json({
        success:true,
        data:address,
        message:'create address successfully'
    })
})
export const getAll=catchAsync(async(req,res,next)=>{
    let queryString=req.body
    if(req.role!=='admin'&&req.role!=='superAdmin'){
        queryString={...queryString,filters:{...queryString.filters,userId:req.userId}}
    }
    const featires=new ApiFeatures(Address,queryString).filter().sort().limitFields().paginate().populate()
    const addresses=await featires.query
    return res.status(200).json({
        success:true,
        data:addresses,
    })
})
export const getOne=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const address=await Address.findById(id)
    if(req.role!=='admin'&&req.role!=='superAdmin'&&address.userId!=req.userId){
        return next(new HandleERROR("you don't have a permission",401))
    }
    return res.status(200).json({
        success:true,
        data:address
    })
})
export const update=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const address=await Address.findById(id)
    if(req.role!=='admin'&&req.role!=='superAdmin'&&address.userId!=req.userId){
        return next(new HandleERROR("you don't have a permission"))
    }
    const {userId=null,...othres}=req.body
    const newAddress=await Address.findByIdAndUpdate(id,othres,{new:true,runValidators:true})
    return res.status(200).json({
        success:true,
        data:newAddress,
        message:"updated address successfully"
    })
})
export const remove=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const address=await Address.findById(id)
    if(req.role!=='admin'&&req.role!=='superAdmin'&&address.userId!=req.userId){
        return next(new HandleERROR("you don't have a permission"))
    }
    const {userId=null,...othres}=req.body
    const newAddress=await Address.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        data:newAddress,
        message:"remove address successfully"
    })
})