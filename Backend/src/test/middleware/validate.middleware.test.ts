import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { validate } from '../../middleware/validate.middleware'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

function makeReq(body: unknown): Request {
  return { body } as Request
}

function makeRes(): Response {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response
  ;(res.status as ReturnType<typeof vi.fn>).mockReturnValue(res)
  return res
}

describe('validate middleware', () => {
  const next = vi.fn() as unknown as NextFunction

  beforeEach(() => vi.clearAllMocks())

  it('llama a next() sin argumentos cuando el body es válido', () => {
    const req = makeReq({ name: 'Test', email: 'test@test.com' })
    validate(schema)(req, makeRes(), next)
    expect(next).toHaveBeenCalledWith()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('elimina los campos extra del body (strip desconocidos)', () => {
    const req = makeReq({ name: 'Test', email: 'test@test.com', extra: 'ignorado' })
    validate(schema)(req, makeRes(), next)
    expect(req.body).not.toHaveProperty('extra')
  })

  it('devuelve 400 con body inválido', () => {
    const req = makeReq({ name: '', email: 'no-es-un-email' })
    const res = makeRes()
    validate(schema)(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('incluye detalles de los errores de validación en la respuesta', () => {
    const req = makeReq({ name: '', email: 'mal' })
    const res = makeRes()
    validate(schema)(req, res, next)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Datos inválidos', details: expect.any(Object) }),
    )
  })

  it('devuelve 400 si el body está vacío', () => {
    const req = makeReq({})
    const res = makeRes()
    validate(schema)(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})
