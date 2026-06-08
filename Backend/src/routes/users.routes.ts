import { Router, Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { updateProfileSchema } from '../schemas/users.schema'
import { usersService } from '../services/users.service'

const router = Router()

router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.getProfile(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.patch('/me', requireAuth, validate(updateProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.updateProfile(req.user!.id, req.body)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.get('/me/usage', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usage = await usersService.getUsage(req.user!.id)
    res.json(usage)
  } catch (err) {
    next(err)
  }
})

export { router as usersRoutes }
