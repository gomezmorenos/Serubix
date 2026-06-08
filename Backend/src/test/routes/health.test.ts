import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../app'

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('incluye timestamp en la respuesta', async () => {
    const res = await request(app).get('/health')
    expect(res.body.timestamp).toBeDefined()
    expect(new Date(res.body.timestamp).getTime()).not.toBeNaN()
  })
})
