import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../services/auth.service'
import { AppError } from '../../lib/errors'

const mockFindUnique = vi.hoisted(() => vi.fn())
const mockCreate = vi.hoisted(() => vi.fn())
const mockSignToken = vi.hoisted(() => vi.fn())
const mockBcryptHash = vi.hoisted(() => vi.fn())
const mockBcryptCompare = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  },
}))

vi.mock('../../lib/jwt', () => ({
  signToken: mockSignToken,
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  },
}))

const fakeUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@test.com',
  provider: 'credentials',
  planId: 'free',
  createdAt: new Date(),
  passwordHash: 'hashed_pw',
}

describe('authService.register', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lanza AppError 409 si el email ya existe', async () => {
    mockFindUnique.mockResolvedValue(fakeUser)
    await expect(authService.register({ name: 'Test', email: 'test@test.com', password: 'pass123' }))
      .rejects.toThrow(AppError)
    await expect(authService.register({ name: 'Test', email: 'test@test.com', password: 'pass123' }))
      .rejects.toMatchObject({ statusCode: 409 })
  })

  it('crea el usuario y devuelve user + token', async () => {
    mockFindUnique.mockResolvedValue(null)
    mockBcryptHash.mockResolvedValue('hashed_pw')
    const { passwordHash: _, ...safeUser } = fakeUser
    mockCreate.mockResolvedValue(safeUser)
    mockSignToken.mockReturnValue('jwt_token')

    const result = await authService.register({ name: 'Test User', email: 'test@test.com', password: 'pass123' })

    expect(mockBcryptHash).toHaveBeenCalledWith('pass123', 12)
    expect(mockCreate).toHaveBeenCalled()
    expect(result.token).toBe('jwt_token')
    expect(result.user).not.toHaveProperty('passwordHash')
  })
})

describe('authService.login', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lanza AppError 401 si el usuario no existe', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(authService.login({ email: 'x@x.com', password: 'pass' }))
      .rejects.toMatchObject({ statusCode: 401 })
  })

  it('lanza AppError 401 si el usuario no tiene passwordHash', async () => {
    mockFindUnique.mockResolvedValue({ ...fakeUser, passwordHash: null })
    await expect(authService.login({ email: 'test@test.com', password: 'pass' }))
      .rejects.toMatchObject({ statusCode: 401 })
  })

  it('lanza AppError 401 si la contraseña es incorrecta', async () => {
    mockFindUnique.mockResolvedValue(fakeUser)
    mockBcryptCompare.mockResolvedValue(false)
    await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toMatchObject({ statusCode: 401 })
  })

  it('devuelve user (sin passwordHash) y token con credenciales válidas', async () => {
    mockFindUnique.mockResolvedValue(fakeUser)
    mockBcryptCompare.mockResolvedValue(true)
    mockSignToken.mockReturnValue('jwt_token')

    const result = await authService.login({ email: 'test@test.com', password: 'pass123' })

    expect(result.token).toBe('jwt_token')
    expect(result.user).not.toHaveProperty('passwordHash')
    expect(result.user.email).toBe('test@test.com')
  })
})

describe('authService.getMe', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lanza AppError 404 si el usuario no existe', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(authService.getMe('nonexistent')).rejects.toMatchObject({ statusCode: 404 })
  })

  it('devuelve el usuario con plan si existe', async () => {
    const userWithPlan = { ...fakeUser, plan: { id: 'free', name: 'Free', ttsLimit: 5000 } }
    mockFindUnique.mockResolvedValue(userWithPlan)

    const result = await authService.getMe('user-1')
    expect(result.plan).toBeDefined()
    expect(result.email).toBe('test@test.com')
  })
})
