import { Router } from 'express'
import { asyncHandler } from '../lib/async-handler'
import { validate } from '../middleware/validate.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { authService } from '../services/auth.service'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)
  res.status(201).json(result)
}))

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)
  res.json(result)
}))

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.id)
  res.json(user)
}))

export { router as authRoutes }
