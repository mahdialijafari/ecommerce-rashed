import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { getAll, getOne, update } from '../Controllers/userCn.js'

const userRouter=express.Router()
userRouter.route('/').get(isAdmin,getAll)
userRouter.route('/:id').get(getOne).patch(update)

export default userRouter