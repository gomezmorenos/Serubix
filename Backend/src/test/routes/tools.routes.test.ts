import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { AppError } from '../../lib/errors'

const mockGenerate = vi.hoisted(() => vi.fn())
const mockVerifyToken = vi.hoisted(() => vi.fn())

vi.mock('../../services/tts.service', () => ({
  ttsService: {
    generate: mockGenerate,
  },
}))

vi.mock('../../lib/jwt', () => ({
  verifyToken: mockVerifyToken,
}))

function authHeader() {
  mockVerifyToken.mockReturnValue({ id: 'user-1', email: 'test@test.com' })
  return 'Bearer valid_token'
}

describe('POST /tools/tts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 401 sin autenticación', async () => {
    const res = await request(app).post('/tools/tts').send({ text: 'hola', voice: 'alloy' })
    expect(res.status).toBe(401)
  })

  it('devuelve 400 con body inválido', async () => {
    const res = await request(app)
      .post('/tools/tts')
      .set('Authorization', authHeader())
      .send({})
    expect(res.status).toBe(400)
  })

  it('devuelve audio mp3 con petición válida', async () => {
    const audioBuffer = Buffer.from('fake-audio-data')
    mockGenerate.mockResolvedValue(audioBuffer)

    const res = await request(app)
      .post('/tools/tts')
      .set('Authorization', authHeader())
      .send({ text: 'Hola mundo', voice: 'alloy' })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('audio/mpeg')
  })

  it('devuelve 402 si el límite del plan ha sido alcanzado', async () => {
    mockGenerate.mockRejectedValue(new AppError('Límite mensual alcanzado', 402))

    const res = await request(app)
      .post('/tools/tts')
      .set('Authorization', authHeader())
      .send({ text: 'Hola mundo', voice: 'alloy' })

    expect(res.status).toBe(402)
  })

  it('devuelve 503 si la API key de OpenAI no está configurada', async () => {
    mockGenerate.mockRejectedValue(new AppError('El servicio TTS no está configurado', 503))

    const res = await request(app)
      .post('/tools/tts')
      .set('Authorization', authHeader())
      .send({ text: 'Hola', voice: 'alloy' })

    expect(res.status).toBe(503)
  })
})
