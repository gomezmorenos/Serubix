import { Router } from 'express'
import OpenAI from 'openai'
import { asyncHandler } from '../lib/async-handler'
import { optionalAuth } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { chatMessageSchema } from '../schemas/chat.schema'
import { chatService } from '../services/chat.service'
import { AppError } from '../lib/errors'

const router = Router()

// POST /chat/message — envía un mensaje y recibe respuesta SSE con streaming
router.post('/message', optionalAuth, validate(chatMessageSchema), async (req, res, next) => {
  const { message, sessionKey } = req.body as { message: string; sessionKey: string }
  const userId = req.user?.id ?? null

  let session: Awaited<ReturnType<typeof chatService.getOrCreateSession>>

  try {
    session = await chatService.getOrCreateSession({ userId, sessionKey })
    await chatService.addMessage(session.id, 'user', message)
  } catch (err) {
    return next(err)
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (payload: object) => res.write(`data: ${JSON.stringify(payload)}\n\n`)

  // Envía la sessionKey para que el cliente la guarde si es nueva
  send({ type: 'session', sessionKey: session.sessionKey })

  if (!process.env.OPENAI_API_KEY) {
    send({ type: 'error', content: 'El servicio de chat no está configurado.' })
    res.write('data: [DONE]\n\n')
    res.end()
    return
  }

  try {
    const history = await chatService.getHistory(session.id, 20)
    const userCtx = userId ? await chatService.getUserContext(userId) : undefined
    const messages = chatService.buildOpenAIMessages(history, userCtx)

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    })

    let fullContent = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? ''
      if (content) {
        fullContent += content
        send({ type: 'delta', content })
      }
    }

    await chatService.addMessage(session.id, 'assistant', fullContent)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    send({ type: 'error', content: `Error generando respuesta: ${msg}` })
  }

  res.write('data: [DONE]\n\n')
  res.end()
})

// GET /chat/history — devuelve el historial de mensajes de una sesión
router.get(
  '/history',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const sessionKey = (req.query.sessionKey as string) ?? ''
    const userId = req.user?.id ?? null

    if (!sessionKey && !userId) {
      throw new AppError('Se requiere sessionKey o autenticación', 400)
    }

    const session = await chatService.findSession({ userId, sessionKey })
    if (!session) return res.json([])

    const messages = await chatService.getHistory(session.id, 50)
    res.json(messages.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt })))
  }),
)

export { router as chatRoutes }
