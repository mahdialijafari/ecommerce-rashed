import express from 'express'
import { changeActivity, create, getAll, getCommentsPoduct, remove, reply } from '../Controllers/commentCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { isLogin } from '../Middlewares/isLogin.js'

const commentRouter=express.Router()
commentRouter.route('/').get(isAdmin,getAll).post(isLogin,create)
commentRouter.route('/:id').post(isAdmin,reply).get(getCommentsPoduct).patch(isAdmin,changeActivity).delete(isAdmin,remove)

export default commentRouter