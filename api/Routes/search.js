import express from 'express'
import { search } from '../Controllers/searchCn.js'

const searchRouter=express.Router()
searchRouter.route('/').post(search)

export default searchRouter