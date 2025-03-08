import express from 'express'
import { create, getAll, remove } from '../Controllers/sliderCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'

const sliderRouter=express.Router()
sliderRouter.route('/').get(getAll).post(isAdmin,create)
sliderRouter.route('/:id').delete(isAdmin,remove)

export default sliderRouter