import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { signToken, verifyToken } from '../../lib/jwt'

const payload = { id: 'user-1', email: 'test@test.com' }

describe('signToken', () => {
  it('devuelve una cadena con tres segmentos separados por puntos', () => {
    const token = signToken(payload)
    expect(token.split('.')).toHaveLength(3)
  })

  it('lanza error si JWT_SECRET no está definida', () => {
    const original = process.env.JWT_SECRET
    delete process.env.JWT_SECRET
    expect(() => signToken(payload)).toThrow('JWT_SECRET no está definida')
    process.env.JWT_SECRET = original
  })
})

describe('verifyToken', () => {
  it('devuelve el payload original para un token válido', () => {
    const token = signToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
  })

  it('lanza error con un token malformado', () => {
    expect(() => verifyToken('no.es.untoken')).toThrow()
  })

  it('lanza error con un token firmado con otro secreto', () => {
    const original = process.env.JWT_SECRET
    process.env.JWT_SECRET = 'otro-secreto-completamente-distinto-32c'
    const badToken = signToken(payload)
    process.env.JWT_SECRET = original
    expect(() => verifyToken(badToken)).toThrow()
  })

  it('lanza error si JWT_SECRET no está definida', () => {
    const original = process.env.JWT_SECRET
    const token = signToken(payload)
    delete process.env.JWT_SECRET
    expect(() => verifyToken(token)).toThrow('JWT_SECRET no está definida')
    process.env.JWT_SECRET = original
  })
})
