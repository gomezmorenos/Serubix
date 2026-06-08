import { describe, it, expect } from 'vitest'
import { AppError } from '../../lib/errors'

describe('AppError', () => {
  it('asigna el mensaje correctamente', () => {
    const err = new AppError('No encontrado', 404)
    expect(err.message).toBe('No encontrado')
  })

  it('asigna el statusCode correctamente', () => {
    const err = new AppError('Conflicto', 409)
    expect(err.statusCode).toBe(409)
  })

  it('asigna name = AppError', () => {
    const err = new AppError('Error', 500)
    expect(err.name).toBe('AppError')
  })

  it('es instancia de Error', () => {
    const err = new AppError('Error', 400)
    expect(err).toBeInstanceOf(Error)
  })

  it('es instancia de AppError', () => {
    const err = new AppError('Error', 400)
    expect(err).toBeInstanceOf(AppError)
  })
})
