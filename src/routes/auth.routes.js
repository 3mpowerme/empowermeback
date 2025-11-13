import { Router } from 'express'
import {
  signupController,
  loginController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  refreshTokenController,
  googleController,
} from '../controllers/auth/auth.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  forgotPasswordSchema,
  googleSchema,
  loginSchema,
  logoutSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from '../schemas/auth.schema.js'

const router = Router()

router.post('/signup', validate(signupSchema), signupController)
router.post('/login', validate(loginSchema), loginController)
router.post('/verify-email', validate(verifyEmailSchema), verifyEmailController)
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPasswordController
)
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  resetPasswordController
)
router.post('/refresh-token', refreshTokenController)
router.post('/google', validate(googleSchema), googleController)
router.post('/logout', validate(logoutSchema), logoutController)

export default router
