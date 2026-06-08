import { Router, Request, Response, NextFunction } from 'express'
import { validate } from '../middleware/validate.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { authService } from '../services/auth.service'

const router = Router()

router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

export { router as authRoutes }
