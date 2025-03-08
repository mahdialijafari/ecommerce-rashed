import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove, update } from '../Controllers/brandCn.js'

const brandRouter=express.Router()
brandRouter.route('/').get(getAll).post(isAdmin,create)
brandRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default brandRouter