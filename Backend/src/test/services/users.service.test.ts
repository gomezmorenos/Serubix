import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usersService } from '../../services/users.service'
import { AppError } from '../../lib/errors'

const mockFindUnique = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockGroupBy = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
    usage: {
      groupBy: mockGroupBy,
    },
  },
}))

const fakeUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@test.com',
  provider: 'credentials',
  planId: 'free',
  plan: { id: 'free', name: 'Free', ttsLimit: 5000 },
  createdAt: new Date(),
}

describe('usersService.getProfile', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lanza AppError 404 si el usuario no existe', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(usersService.getProfile('nonexistent')).rejects.toMatchObject({ statusCode: 404 })
  })

  it('devuelve el usuario con plan si existe', async () => {
    mockFindUnique.mockResolvedValue(fakeUser)
    const result = await usersService.getProfile('user-1')
    expect(result.email).toBe('test@test.com')
    expect(result.plan).toBeDefined()
  })
})

describe('usersService.updateProfile', () => {
  beforeEach(() => vi.clearAllMocks())

  it('llama a prisma.user.update con los datos correctos', async () => {
    const updated = { id: 'user-1', name: 'Nuevo Nombre', email: 'test@test.com', planId: 'free' }
    mockUpdate.mockResolvedValue(updated)

    const result = await usersService.updateProfile('user-1', { name: 'Nuevo Nombre' })

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'user-1' }, data: { name: 'Nuevo Nombre' } }),
    )
    expect(result.name).toBe('Nuevo Nombre')
  })
})

describe('usersService.getUsage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve array vacío si no hay registros de uso', async () => {
    mockGroupBy.mockResolvedValue([])
    const result = await usersService.getUsage('user-1')
    expect(result).toEqual([])
  })

  it('devuelve el uso sumado por herramienta', async () => {
    mockGroupBy.mockResolvedValue([
      { tool: 'tts', _sum: { amount: 1500 } },
    ])
    const result = await usersService.getUsage('user-1')
    expect(result).toEqual([{ tool: 'tts', amount: 1500 }])
  })

  it('usa 0 cuando _sum.amount es null', async () => {
    mockGroupBy.mockResolvedValue([{ tool: 'tts', _sum: { amount: null } }])
    const result = await usersService.getUsage('user-1')
    expect(result[0].amount).toBe(0)
  })
})
