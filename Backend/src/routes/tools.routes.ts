import path from 'node:path'
import { Router, Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { ttsSchema } from '../schemas/tools.schema'
import { ttsService, STORAGE_DIR } from '../services/tts.service'
import { contentService } from '../services/content.service'
import { AppError } from '../lib/errors'

const router = Router()

router.post('/tts', requireAuth, validate(ttsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contentId = await ttsService.startGeneration(req.user!.id, req.body)
    res.status(202).json({ id: contentId })
  } catch (err) {
    next(err)
  }
})

router.get('/content', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await contentService.getRecent(req.user!.id)
    res.json(items)
  } catch (err) {
    next(err)
  }
})

router.get('/content/:id/download', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await contentService.getById(req.params.id, req.user!.id)
    if (item.status !== 'done' || !item.filename) {
      throw new AppError('El archivo aún no está disponible', 409)
    }
    const filepath = path.join(STORAGE_DIR, item.filename)
    res.download(filepath, item.filename)
  } catch (err) {
    next(err)
  }
})

export { router as toolsRoutes }
