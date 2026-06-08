import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { AppError } from '../../lib/errors'

const mockRegister = vi.hoisted(() => vi.fn())
const mockLogin = vi.hoisted(() => vi.fn())
const mockGetMe = vi.hoisted(() => vi.fn())
const mockVerifyToken = vi.hoisted(() => vi.fn())

vi.mock('../../services/auth.service', () => ({
  authService: {
    register: mockRegister,
    login: mockLogin,
    getMe: mockGetMe,
  },
}))

vi.mock('../../lib/jwt', () => ({
  verifyToken: mockVerifyToken,
}))

const fakeUser = { id: 'user-1', name: 'Test', email: 'test@test.com', planId: 'free' }

describe('POST /auth/register', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 201 con user y token', async () => {
    mockRegister.mockResolvedValue({ user: fakeUser, token: 'jwt' })

    const res = await request(app).post('/auth/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'pass1234',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBe('jwt')
    expect(res.body.user.email).toBe('test@test.com')
  })

  it('devuelve 400 con body inválido', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'mal' })
    expect(res.status).toBe(400)
  })

  it('devuelve 409 si el email ya está registrado', async () => {
    mockRegister.mockRejectedValue(new AppError('El email ya está registrado', 409))

    const res = await request(app).post('/auth/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'pass1234',
    })
    expect(res.status).toBe(409)
  })
})

describe('POST /auth/login', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 200 con user y token', async () => {
    mockLogin.mockResolvedValue({ user: fakeUser, token: 'jwt' })

    const res = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: 'pass1234',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBe('jwt')
  })

  it('devuelve 400 con body inválido', async () => {
    const res = await request(app).post('/auth/login').send({})
    expect(res.status).toBe(400)
  })

  it('devuelve 401 con credenciales incorrectas', async () => {
    mockLogin.mockRejectedValue(new AppError('Credenciales incorrectas', 401))

    const res = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: 'wrong',
    })
    expect(res.status).toBe(401)
  })
})

describe('GET /auth/me', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/auth/me')
    expect(res.status).toBe(401)
  })

  it('devuelve 200 con token válido', async () => {
    mockVerifyToken.mockReturnValue({ id: 'user-1', email: 'test@test.com' })
    mockGetMe.mockResolvedValue({ ...fakeUser, plan: { id: 'free', name: 'Free', ttsLimit: 5000 } })

    const res = await request(app).get('/auth/me').set('Authorization', 'Bearer valid_token')

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@test.com')
  })

  it('devuelve 404 si el usuario no existe', async () => {
    mockVerifyToken.mockReturnValue({ id: 'ghost', email: 'ghost@test.com' })
    mockGetMe.mockRejectedValue(new AppError('Usuario no encontrado', 404))

    const res = await request(app).get('/auth/me').set('Authorization', 'Bearer valid_token')
    expect(res.status).toBe(404)
  })
})
