import { describe, it, expect, vi, beforeEach } from 'vitest'
import { plansService } from '../../services/plans.service'

const mockFindMany = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    plan: {
      findMany: mockFindMany,
    },
  },
}))

const fakePlans = [
  { id: 'free', name: 'Free', ttsLimit: 5000 },
  { id: 'pro', name: 'Pro', ttsLimit: 0 },
]

describe('plansService.getAll', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve la lista de planes', async () => {
    mockFindMany.mockResolvedValue(fakePlans)
    const result = await plansService.getAll()
    expect(result).toEqual(fakePlans)
  })

  it('llama a findMany ordenando por ttsLimit asc', async () => {
    mockFindMany.mockResolvedValue(fakePlans)
    await plansService.getAll()
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { ttsLimit: 'asc' } })
  })

  it('devuelve array vacío si no hay planes', async () => {
    mockFindMany.mockResolvedValue([])
    const result = await plansService.getAll()
    expect(result).toEqual([])
  })
})
