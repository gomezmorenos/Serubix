import path from 'node:path'
import { Router } from 'express'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { ttsSchema } from '../schemas/tools.schema'
import { ttsService, STORAGE_DIR } from '../services/tts.service'
import { contentService } from '../services/content.service'
import { AppError } from '../lib/errors'

const router = Router()

router.post('/tts', requireAuth, validate(ttsSchema), asyncHandler(async (req, res) => {
  const contentId = await ttsService.startGeneration(req.user!.id, req.body)
  res.status(202).json({ id: contentId })
}))

router.get('/content', requireAuth, asyncHandler(async (req, res) => {
  const items = await contentService.getRecent(req.user!.id)
  res.json(items)
}))

router.get('/content/:id/download', requireAuth, asyncHandler(async (req, res) => {
  const item = await contentService.getById(req.params.id, req.user!.id)
  if (item.status !== 'done' || !item.filename) {
    throw new AppError('El archivo aún no está disponible', 409)
  }
  const filepath = path.join(STORAGE_DIR, item.filename)
  res.download(filepath, item.filename)
}))

export { router as toolsRoutes }
