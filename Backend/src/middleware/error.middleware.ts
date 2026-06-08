import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
}
