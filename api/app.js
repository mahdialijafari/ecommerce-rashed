import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './Routes/auth.js'
import uploadRouter from './Routes/upload.js'
import catchError from './Utils/catchError.js'
import HandleERROR from './Utils/handleError.js'
import addressRouter from './Routes/address.js'
import brandRouter from './Routes/brand.js'
import cartRouter from './Routes/cart.js'
import categoryRouter from './Routes/category.js'
import commentRouter from './Routes/comment.js'
import disscountCodeRouter from './Routes/disscountCode.js'
import orderRouter from './Routes/order.js'
import productRouter from './Routes/product.js'
import productVariantRouter from './Routes/productVariant.js'
import reportRouter from './Routes/report.js'
import sliderRouter from './Routes/slider.js'
import userRouter from './Routes/user.js'
import variantRouter from './Routes/variant.js'
import { isLogin } from './Middlewares/isLogin.js'


const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)


const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.static('Public'))
app.use('/api/address',isLogin,addressRouter)
app.use('/api/auth',authRouter)
app.use('/api/brand',brandRouter)
app.use('/api/cart',cartRouter)
app.use('/api/category',categoryRouter)
app.use('/api/comment',commentRouter)
app.use('/api/discount',disscountCodeRouter)
app.use('/api/order',orderRouter)
app.use('/api/product',productRouter)
app.use('/api/product-variant',productVariantRouter)
app.use('/api/report',reportRouter)
app.use('/api/slider',sliderRouter)
app.use('/api/user',isLogin,userRouter)
app.use('/api/variant',variantRouter)
app.use('/api/upload',uploadRouter)


app.use('*',(req,res,next)=>{
   return next(new HandleERROR('route not found',404))
})


app.use(catchError)


export default app