import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { asyncHandler } from '../lib/async-handler'
import { createGrantSchema } from '../schemas/credits.schema'
import { creditsService } from '../services/credits.service'

const router = Router()

router.use(requireAuth)

// GET /credits — resumen de crédito del usuario autenticado
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const summary = await creditsService.getSummary(req.user!.id)
    res.json(summary)
  }),
)

// GET /credits/history — historial mensual de uso (últimos 12 meses)
router.get(
  '/history',
  asyncHandler(async (req, res) => {
    const history = await creditsService.getHistory(req.user!.id)
    res.json(history)
  }),
)

// POST /credits/grants — conceder crédito extra a un usuario
router.post(
  '/grants',
  validate(createGrantSchema),
  asyncHandler(async (req, res) => {
    const grant = await creditsService.createGrant(req.body)
    res.status(201).json(grant)
  }),
)

// DELETE /credits/grants/:id — revocar una concesión de crédito
router.delete(
  '/grants/:id',
  asyncHandler(async (req, res) => {
    await creditsService.deleteGrant(req.params.id)
    res.status(204).send()
  }),
)

export { router as creditsRoutes }
