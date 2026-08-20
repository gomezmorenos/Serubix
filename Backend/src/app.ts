import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { logger } from './lib/logger'
import { authRoutes } from './routes/auth.routes'
import { usersRoutes } from './routes/users.routes'
import { plansRoutes } from './routes/plans.routes'
import { toolsRoutes } from './routes/tools.routes'
import { chatRoutes } from './routes/chat.routes'
import { errorMiddleware } from './middleware/error.middleware'

export const app = express()

const httpLogger = pinoHttp({ logger })

// Excluir /health y el endpoint SSE del chat para no interferir con streaming
app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/chat/message') return next()
  httpLogger(req, res, next)
})
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/plans', plansRoutes)
app.use('/tools', toolsRoutes)
app.use('/chat', chatRoutes)

app.use(errorMiddleware)
