import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { check, create, getAll, getOne, remove, update } from '../Controllers/disscountCodeCn.js'
import { isLogin } from '../Middlewares/isLogin.js'

const disscountCodeRouter=express.Router()
disscountCodeRouter.route('/').post(isAdmin,create).get(isAdmin,getAll)
disscountCodeRouter.route('/check').post(isLogin,check)
disscountCodeRouter.route('/id').get(isAdmin,getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default disscountCodeRouter