import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove, update } from '../Controllers/variantCn.js'

const variantRouter=express.Router()
variantRouter.route('/').get(getAll).post(isAdmin,create)
variantRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default variantRouter