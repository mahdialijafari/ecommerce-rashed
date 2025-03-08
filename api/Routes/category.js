import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove, update } from '../Controllers/categoryCn.js'

const categoryRouter=express.Router()
categoryRouter.route('/').get(getAll).post(isAdmin,create)
categoryRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)

export default categoryRouter