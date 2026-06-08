import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'

const mockGetAll = vi.hoisted(() => vi.fn())

vi.mock('../../services/plans.service', () => ({
  plansService: {
    getAll: mockGetAll,
  },
}))

describe('GET /plans', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve la lista de planes', async () => {
    const plans = [
      { id: 'free', name: 'Free', ttsLimit: 5000 },
      { id: 'pro', name: 'Pro', ttsLimit: 0 },
    ]
    mockGetAll.mockResolvedValue(plans)

    const res = await request(app).get('/plans')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(plans)
  })

  it('devuelve 200 con array vacío si no hay planes', async () => {
    mockGetAll.mockResolvedValue([])
    const res = await request(app).get('/plans')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('devuelve 500 si el servicio falla', async () => {
    mockGetAll.mockRejectedValue(new Error('DB error'))
    const res = await request(app).get('/plans')
    expect(res.status).toBe(500)
  })
})
