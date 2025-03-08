import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './Routes/auth.js'
import categoryRouter from './Routes/category.js'
import commentRouter from './Routes/comment.js'
import postRouter from './Routes/post.js'
import userRouter from './Routes/user.js'
import uploadRouter from './Routes/upload.js'
import catchError from './Utils/catchError.js'
import HandleERROR from './Utils/handleError.js'


const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)


const app=express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('Public'))

app.use('/api/upload',uploadRouter)


app.use('*',(req,res,next)=>{
   return next(new HandleERROR('route not found',404))
})


app.use(catchError)


export default app