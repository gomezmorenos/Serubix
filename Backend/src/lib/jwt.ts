import jwt from 'jsonwebtoken'

export interface JwtPayload {
  id: string
  email: string
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está definida')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está definida')
  return jwt.verify(token, secret) as JwtPayload
}
