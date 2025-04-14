import express from 'express'
import { auth, checkOtp, checkPassword, forgetPassword, resendCode } from '../Controllers/authCn.js'

const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/password').post(checkPassword)
authRouter.route('/resend').post(resendCode)
authRouter.route('/forget').post(forgetPassword)

export default authRouter