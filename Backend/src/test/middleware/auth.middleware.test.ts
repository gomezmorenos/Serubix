import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth } from '../../middleware/auth.middleware'

const mockVerifyToken = vi.hoisted(() => vi.fn())

vi.mock('../../lib/jwt', () => ({
  verifyToken: mockVerifyToken,
}))

function makeReq(authHeader?: string): Request {
  return { headers: authHeader ? { authorization: authHeader } : {} } as unknown as Request
}

function makeRes(): Response {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response
  ;(res.status as ReturnType<typeof vi.fn>).mockReturnValue(res)
  return res
}

describe('requireAuth', () => {
  const next = vi.fn() as unknown as NextFunction

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('llama a next() y asigna req.user con token válido', () => {
    const mockPayload = { id: 'user-1', email: 'test@test.com' }
    mockVerifyToken.mockReturnValue(mockPayload)
    const req = makeReq('Bearer valid_token')
    const res = makeRes()

    requireAuth(req, res, next)

    expect(mockVerifyToken).toHaveBeenCalledWith('valid_token')
    expect(req.user).toEqual(mockPayload)
    expect(next).toHaveBeenCalledWith()
  })

  it('devuelve 401 si no hay header Authorization', () => {
    const req = makeReq()
    const res = makeRes()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'No autorizado' })
    expect(next).not.toHaveBeenCalled()
  })

  it('devuelve 401 si el header no empieza con "Bearer "', () => {
    const req = makeReq('Token abc123')
    const res = makeRes()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('devuelve 401 si el token es inválido o ha expirado', () => {
    mockVerifyToken.mockImplementation(() => { throw new Error('jwt expired') })
    const req = makeReq('Bearer expired_token')
    const res = makeRes()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' })
    expect(next).not.toHaveBeenCalled()
  })
})
