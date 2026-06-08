import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { errorMiddleware } from '../../middleware/error.middleware'
import { AppError } from '../../lib/errors'

function makeRes(): Response {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response
  ;(res.status as ReturnType<typeof vi.fn>).mockReturnValue(res)
  return res
}

const req = {} as Request
const next = vi.fn() as unknown as NextFunction

describe('errorMiddleware', () => {
  it('responde con el statusCode y mensaje de un AppError', () => {
    const err = new AppError('No encontrado', 404)
    const res = makeRes()
    errorMiddleware(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' })
  })

  it('responde con 500 para errores genéricos', () => {
    const err = new Error('error inesperado')
    const res = makeRes()
    errorMiddleware(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' })
  })

  it('maneja AppError 401', () => {
    const err = new AppError('No autorizado', 401)
    const res = makeRes()
    errorMiddleware(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('maneja AppError 409', () => {
    const err = new AppError('Conflicto', 409)
    const res = makeRes()
    errorMiddleware(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ error: 'Conflicto' })
  })
})
