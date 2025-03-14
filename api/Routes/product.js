import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, update } from '../Controllers/productCn.js'

const productRouter=express.Router()
productRouter.route('/').get(getAll).post(isAdmin,create)
productRouter.route('/:id').get(getOne).patch(isAdmin,update)

export default productRouter