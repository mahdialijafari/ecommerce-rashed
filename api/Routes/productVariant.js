import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove, update } from '../Controllers/productVariantCn.js'

const productVariantRouter=express.Router()
productVariantRouter.route('/').get(getAll).post(isAdmin,create)
productVariantRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default productVariantRouter