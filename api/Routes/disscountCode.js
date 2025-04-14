import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin'
import { check, create, getAll, getOne, remove, update } from '../Controllers/disscountCodeCn'
import { isLogin } from '../Middlewares/isLogin'

const disscountCodeRouter=express.Router()
disscountCodeRouter.route('/').post(isAdmin,create).get(isAdmin,getAll)
disscountCodeRouter.route('/check').post(isLogin,check)
disscountCodeRouter.route('/id').get(isAdmin,getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default disscountCodeRouter