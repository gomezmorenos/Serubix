import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ttsService } from '../../services/tts.service'
import { AppError } from '../../lib/errors'

const mockFindUnique = vi.hoisted(() => vi.fn())
const mockAggregate = vi.hoisted(() => vi.fn())
const mockUsageCreate = vi.hoisted(() => vi.fn())
const mockSpeechCreate = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: { findUnique: mockFindUnique },
    usage: { aggregate: mockAggregate, create: mockUsageCreate },
  },
}))

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    audio: { speech: { create: mockSpeechCreate } },
  })),
}))

const freePlan = { id: 'free', name: 'Free', ttsLimit: 5000 }
const proPlan = { id: 'pro', name: 'Pro', ttsLimit: 0 }

describe('ttsService.generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'sk-test-key'
  })

  it('lanza AppError 503 si OPENAI_API_KEY no está definida', async () => {
    delete process.env.OPENAI_API_KEY
    await expect(ttsService.generate('user-1', { text: 'hola', voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 503 })
    process.env.OPENAI_API_KEY = 'sk-test-key'
  })

  it('lanza AppError 404 si el usuario no existe', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(ttsService.generate('user-1', { text: 'hola', voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 404 })
  })

  it('lanza AppError 402 si el usuario ha superado el límite del plan', async () => {
    mockFindUnique.mockResolvedValue({ planId: 'free', plan: freePlan })
    mockAggregate.mockResolvedValue({ _sum: { amount: 4990 } })

    await expect(ttsService.generate('user-1', { text: 'a'.repeat(20), voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 402 })
  })

  it('genera audio y registra uso para plan con límite', async () => {
    mockFindUnique.mockResolvedValue({ planId: 'free', plan: freePlan })
    mockAggregate.mockResolvedValue({ _sum: { amount: 0 } })
    const fakeBuffer = Buffer.from('audio_data')
    mockSpeechCreate.mockResolvedValue({ arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })
    mockUsageCreate.mockResolvedValue({})

    const result = await ttsService.generate('user-1', { text: 'hola mundo', voice: 'alloy' })

    expect(mockSpeechCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'tts-1', voice: 'alloy', input: 'hola mundo' }),
    )
    expect(mockUsageCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1', tool: 'tts', amount: 10 }) }),
    )
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('no consulta el agregado para plan Pro (ttsLimit = 0)', async () => {
    mockFindUnique.mockResolvedValue({ planId: 'pro', plan: proPlan })
    const fakeBuffer = Buffer.from('audio_data')
    mockSpeechCreate.mockResolvedValue({ arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })
    mockUsageCreate.mockResolvedValue({})

    await ttsService.generate('user-1', { text: 'texto largo', voice: 'nova' })

    expect(mockAggregate).not.toHaveBeenCalled()
    expect(mockSpeechCreate).toHaveBeenCalled()
  })

  it('pasa la voz indicada a la API de OpenAI', async () => {
    mockFindUnique.mockResolvedValue({ planId: 'pro', plan: proPlan })
    const fakeBuffer = Buffer.from('audio_data')
    mockSpeechCreate.mockResolvedValue({ arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })
    mockUsageCreate.mockResolvedValue({})

    await ttsService.generate('user-1', { text: 'hola', voice: 'alloy' })

    expect(mockSpeechCreate).toHaveBeenCalledWith(
      expect.objectContaining({ voice: 'alloy' }),
    )
  })
})
