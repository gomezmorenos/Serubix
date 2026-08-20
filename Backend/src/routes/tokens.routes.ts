import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { asyncHandler } from '../lib/async-handler'
import { createTokenSchema, updateTokenSchema } from '../schemas/tokens.schema'
import { tokensService } from '../services/tokens.service'

const router = Router()

router.use(requireAuth)

// GET /tokens — lista los tokens del usuario autenticado
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tokens = await tokensService.list(req.user!.id)
    res.json(tokens)
  }),
)

// POST /tokens — crea un nuevo token (devuelve el valor completo una sola vez)
router.post(
  '/',
  validate(createTokenSchema),
  asyncHandler(async (req, res) => {
    const result = await tokensService.create(req.user!.id, req.body)
    res.status(201).json(result)
  }),
)

// PATCH /tokens/:id — renombra un token
router.patch(
  '/:id',
  validate(updateTokenSchema),
  asyncHandler(async (req, res) => {
    const token = await tokensService.update(req.user!.id, req.params.id, req.body)
    res.json(token)
  }),
)

// DELETE /tokens/:id — revoca un token
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await tokensService.delete(req.user!.id, req.params.id)
    res.status(204).send()
  }),
)

export { router as tokensRoutes }
