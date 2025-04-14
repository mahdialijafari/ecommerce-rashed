import express from 'express'
import { add, getOne, remove } from '../Controllers/cartCn'

const cartRouter=express.Router()
cartRouter.route('/').get(getOne).post(add).delete(clear)
cartRouter.route('/remove').post(remove)

export default cartRouter