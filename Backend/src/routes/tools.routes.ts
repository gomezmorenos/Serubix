import { Router, Request, Response, NextFunction } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { ttsSchema } from '../schemas/tools.schema'
import { ttsService } from '../services/tts.service'

const router = Router()

router.post('/tts', requireAuth, validate(ttsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const audioBuffer = await ttsService.generate(req.user!.id, req.body)
    res.set('Content-Type', 'audio/mpeg')
    res.set('Content-Disposition', 'attachment; filename="audio.mp3"')
    res.send(audioBuffer)
  } catch (err) {
    next(err)
  }
})

export { router as toolsRoutes }
