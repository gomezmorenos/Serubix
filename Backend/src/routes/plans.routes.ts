import { Router, Request, Response, NextFunction } from 'express'
import { plansService } from '../services/plans.service'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await plansService.getAll()
    res.json(plans)
  } catch (err) {
    next(err)
  }
})

export { router as plansRoutes }
