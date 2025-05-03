import express from 'express'
import { add, clear, getOne, remove } from '../Controllers/cartCn.js'

const cartRouter=express.Router()
cartRouter.route('/').get(getOne).post(add).delete(clear)
cartRouter.route('/remove').post(remove)

export default cartRouter