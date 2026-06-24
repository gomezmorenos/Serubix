import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  const token = authHeader.slice(7)
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

// No rechaza si no hay token — añade req.user solo si el token es válido
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.slice(7))
    } catch {
      // Token inválido — continúa como anónimo
    }
  }
  next()
}
