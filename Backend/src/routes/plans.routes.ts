import { Router } from 'express'
import { asyncHandler } from '../lib/async-handler'
import { plansService } from '../services/plans.service'

const router = Router()

router.get('/', asyncHandler(async (_req, res) => {
  const plans = await plansService.getAll()
  res.json(plans)
}))

export { router as plansRoutes }
