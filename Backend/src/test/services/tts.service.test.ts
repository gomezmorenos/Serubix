import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ttsService } from '../../services/tts.service'

const mockUserFindUnique = vi.hoisted(() => vi.fn())
const mockUsageAggregate = vi.hoisted(() => vi.fn())
const mockUsageCreate = vi.hoisted(() => vi.fn())
const mockContentCreate = vi.hoisted(() => vi.fn())
const mockContentUpdate = vi.hoisted(() => vi.fn())
const mockSpeechCreate = vi.hoisted(() => vi.fn())
const mockWriteFile = vi.hoisted(() => vi.fn())
const mockMkdir = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: { findUnique: mockUserFindUnique },
    usage: { aggregate: mockUsageAggregate, create: mockUsageCreate },
    generatedContent: { create: mockContentCreate, update: mockContentUpdate },
  },
}))

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    audio: { speech: { create: mockSpeechCreate } },
  })),
}))

vi.mock('node:fs', () => ({
  promises: { writeFile: mockWriteFile, mkdir: mockMkdir },
}))

const freePlan = { ttsLimit: 5000 }
const proPlan = { ttsLimit: 50000 }

describe('ttsService.startGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'sk-test-key'
    mockMkdir.mockResolvedValue(undefined)
    mockWriteFile.mockResolvedValue(undefined)
    mockUsageCreate.mockResolvedValue({})
    mockContentUpdate.mockResolvedValue({})
    mockSpeechCreate.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(Buffer.from('audio').buffer),
    })
  })

  it('lanza AppError 503 si OPENAI_API_KEY no está definida', async () => {
    delete process.env.OPENAI_API_KEY
    await expect(ttsService.startGeneration('u1', { text: 'hola', voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 503 })
    process.env.OPENAI_API_KEY = 'sk-test-key'
  })

  it('lanza AppError 404 si el usuario no existe', async () => {
    mockUserFindUnique.mockResolvedValue(null)
    await expect(ttsService.startGeneration('u1', { text: 'hola', voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 404 })
  })

  it('lanza AppError 402 si el usuario ha superado el límite del plan', async () => {
    mockUserFindUnique.mockResolvedValue({ planId: 'free', plan: freePlan })
    mockUsageAggregate.mockResolvedValue({ _sum: { amount: 4990 } })

    await expect(ttsService.startGeneration('u1', { text: 'a'.repeat(20), voice: 'alloy' }))
      .rejects.toMatchObject({ statusCode: 402 })
  })

  it('crea un registro pending y devuelve su id', async () => {
    mockUserFindUnique.mockResolvedValue({ planId: 'free', plan: freePlan })
    mockUsageAggregate.mockResolvedValue({ _sum: { amount: 0 } })
    mockContentCreate.mockResolvedValue({ id: 'content-1' })

    const id = await ttsService.startGeneration('u1', { text: 'hola mundo', voice: 'alloy' })

    expect(mockContentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 'u1', tool: 'tts', status: 'pending' }),
      }),
    )
    expect(id).toBe('content-1')
  })

  it('el plan Pro consulta el agregado y permite generar dentro del límite de 50.000', async () => {
    mockUserFindUnique.mockResolvedValue({ planId: 'pro', plan: proPlan })
    mockUsageAggregate.mockResolvedValue({ _sum: { amount: 0 } })
    mockContentCreate.mockResolvedValue({ id: 'content-2' })

    await ttsService.startGeneration('u1', { text: 'texto largo', voice: 'nova' })

    expect(mockUsageAggregate).toHaveBeenCalled()
  })

  it('lanza AppError 402 si el plan Pro supera 50.000 caracteres', async () => {
    mockUserFindUnique.mockResolvedValue({ planId: 'pro', plan: proPlan })
    mockUsageAggregate.mockResolvedValue({ _sum: { amount: 49990 } })

    await expect(ttsService.startGeneration('u1', { text: 'a'.repeat(20), voice: 'nova' }))
      .rejects.toMatchObject({ statusCode: 402 })
  })

  it('trunca el label a 60 caracteres si el texto es largo', async () => {
    mockUserFindUnique.mockResolvedValue({ planId: 'pro', plan: proPlan })
    mockUsageAggregate.mockResolvedValue({ _sum: { amount: 0 } })
    mockContentCreate.mockResolvedValue({ id: 'content-3' })
    const longText = 'a'.repeat(100)

    await ttsService.startGeneration('u1', { text: longText, voice: 'alloy' })

    expect(mockContentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ label: expect.stringMatching(/\.{3}$/) }),
      }),
    )
  })
})
