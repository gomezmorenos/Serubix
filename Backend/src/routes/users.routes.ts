import { Router } from 'express'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { updateProfileSchema } from '../schemas/users.schema'
import { usersService } from '../services/users.service'

const router = Router()

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await usersService.getProfile(req.user!.id)
  res.json(user)
}))

router.patch('/me', requireAuth, validate(updateProfileSchema), asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user!.id, req.body)
  res.json(user)
}))

router.get('/me/usage', requireAuth, asyncHandler(async (req, res) => {
  const usage = await usersService.getUsage(req.user!.id)
  res.json(usage)
}))

export { router as usersRoutes }
