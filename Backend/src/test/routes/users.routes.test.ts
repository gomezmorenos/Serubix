import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { AppError } from '../../lib/errors'

const mockGetProfile = vi.hoisted(() => vi.fn())
const mockUpdateProfile = vi.hoisted(() => vi.fn())
const mockGetUsage = vi.hoisted(() => vi.fn())
const mockVerifyToken = vi.hoisted(() => vi.fn())

vi.mock('../../services/users.service', () => ({
  usersService: {
    getProfile: mockGetProfile,
    updateProfile: mockUpdateProfile,
    getUsage: mockGetUsage,
  },
}))

vi.mock('../../lib/jwt', () => ({
  verifyToken: mockVerifyToken,
}))

const fakeUser = {
  id: 'user-1',
  name: 'Test',
  email: 'test@test.com',
  planId: 'free',
  plan: { id: 'free', name: 'Free', ttsLimit: 5000 },
}

function authHeader() {
  mockVerifyToken.mockReturnValue({ id: 'user-1', email: 'test@test.com' })
  return 'Bearer valid_token'
}

describe('GET /users/me', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 401 sin autenticación', async () => {
    const res = await request(app).get('/users/me')
    expect(res.status).toBe(401)
  })

  it('devuelve el perfil del usuario', async () => {
    mockGetProfile.mockResolvedValue(fakeUser)
    const res = await request(app).get('/users/me').set('Authorization', authHeader())
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@test.com')
  })

  it('devuelve 404 si el usuario no existe', async () => {
    mockGetProfile.mockRejectedValue(new AppError('Usuario no encontrado', 404))
    const res = await request(app).get('/users/me').set('Authorization', authHeader())
    expect(res.status).toBe(404)
  })
})

describe('PATCH /users/me', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 401 sin autenticación', async () => {
    const res = await request(app).patch('/users/me').send({ name: 'Nuevo' })
    expect(res.status).toBe(401)
  })

  it('actualiza el perfil y devuelve el usuario', async () => {
    mockUpdateProfile.mockResolvedValue({ ...fakeUser, name: 'Nuevo Nombre' })
    const res = await request(app)
      .patch('/users/me')
      .set('Authorization', authHeader())
      .send({ name: 'Nuevo Nombre' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Nuevo Nombre')
  })

  it('devuelve 400 con body inválido', async () => {
    const res = await request(app)
      .patch('/users/me')
      .set('Authorization', authHeader())
      .send({ name: '' })
    expect(res.status).toBe(400)
  })
})

describe('GET /users/me/usage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 401 sin autenticación', async () => {
    const res = await request(app).get('/users/me/usage')
    expect(res.status).toBe(401)
  })

  it('devuelve los datos de uso', async () => {
    mockGetUsage.mockResolvedValue([{ tool: 'tts', amount: 1500 }])
    const res = await request(app).get('/users/me/usage').set('Authorization', authHeader())
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ tool: 'tts', amount: 1500 }])
  })

  it('devuelve 500 si el servicio falla', async () => {
    mockGetUsage.mockRejectedValue(new Error('DB error'))
    const res = await request(app).get('/users/me/usage').set('Authorization', authHeader())
    expect(res.status).toBe(500)
  })
})

describe('PATCH /users/me — error de servicio', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 500 si el servicio falla', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('DB error'))
    const res = await request(app)
      .patch('/users/me')
      .set('Authorization', authHeader())
      .send({ name: 'Test' })
    expect(res.status).toBe(500)
  })
})
