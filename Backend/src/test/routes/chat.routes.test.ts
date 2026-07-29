import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app'

const mockGetOrCreateSession = vi.hoisted(() => vi.fn())
const mockAddMessage = vi.hoisted(() => vi.fn())
const mockGetHistory = vi.hoisted(() => vi.fn())
const mockGetUserContext = vi.hoisted(() => vi.fn())
const mockBuildOpenAIMessages = vi.hoisted(() => vi.fn())
const mockFindSession = vi.hoisted(() => vi.fn())
const mockOpenAICreate = vi.hoisted(() => vi.fn())
const mockVerifyToken = vi.hoisted(() => vi.fn())

vi.mock('../../services/chat.service', () => ({
  chatService: {
    getOrCreateSession: mockGetOrCreateSession,
    addMessage: mockAddMessage,
    getHistory: mockGetHistory,
    getUserContext: mockGetUserContext,
    buildOpenAIMessages: mockBuildOpenAIMessages,
    findSession: mockFindSession,
  },
}))

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockOpenAICreate } },
  })),
}))

vi.mock('../../lib/jwt', () => ({
  verifyToken: mockVerifyToken,
}))

async function* makeStream(chunks: string[]) {
  for (const content of chunks) {
    yield { choices: [{ delta: { content } }] }
  }
}

function parseSseEvents(body: string) {
  return body
    .split('\n')
    .filter((line) => line.startsWith('data: '))
    .map((line) => line.slice(6).trim())
    .filter((raw) => raw !== '[DONE]')
    .map((raw) => JSON.parse(raw) as { type: string; content?: string; sessionKey?: string })
}

const fakeSession = { id: 'sess-1', sessionKey: 'key-123', userId: null }
const systemMsg = [{ role: 'system' as const, content: 'Eres el asistente de Serubix.' }]

describe('POST /chat/message', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetOrCreateSession.mockResolvedValue(fakeSession)
    mockAddMessage.mockResolvedValue({})
    mockGetHistory.mockResolvedValue([])
    mockGetUserContext.mockResolvedValue(undefined)
    mockBuildOpenAIMessages.mockReturnValue(systemMsg)
    mockOpenAICreate.mockImplementation(() => Promise.resolve(makeStream(['Hola', ' mundo'])))
  })

  it('devuelve 400 con body inválido', async () => {
    const res = await request(app).post('/chat/message').send({})
    expect(res.status).toBe(400)
  })

  it('devuelve 400 si el mensaje es una cadena vacía', async () => {
    const res = await request(app)
      .post('/chat/message')
      .send({ message: '', sessionKey: 'key-123' })
    expect(res.status).toBe(400)
  })

  it('devuelve SSE con evento de sesión y deltas del texto generado', async () => {
    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/event-stream')

    const events = parseSseEvents(res.text)
    const sessionEvent = events.find((e) => e.type === 'session')
    const deltaEvents = events.filter((e) => e.type === 'delta')

    expect(sessionEvent?.sessionKey).toBe('key-123')
    expect(deltaEvents.map((e) => e.content).join('')).toBe('Hola mundo')
  })

  it('guarda el mensaje del usuario y el de respuesta del asistente', async () => {
    await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(mockAddMessage).toHaveBeenCalledTimes(2)
    expect(mockAddMessage).toHaveBeenNthCalledWith(1, 'sess-1', 'user', 'Hola')
    expect(mockAddMessage).toHaveBeenNthCalledWith(2, 'sess-1', 'assistant', 'Hola mundo')
  })

  it('llama a getUserContext e incluye el contexto en los mensajes cuando el usuario está autenticado', async () => {
    mockVerifyToken.mockReturnValue({ id: 'user-1', email: 'test@test.com' })
    mockGetUserContext.mockResolvedValue({ name: 'Test', plan: 'Pro', ttsUsed: 0, ttsLimit: 0 })

    await request(app)
      .post('/chat/message')
      .set('Authorization', 'Bearer valid_token')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(mockGetUserContext).toHaveBeenCalledWith('user-1')
    expect(mockBuildOpenAIMessages).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ plan: 'Pro' }),
    )
  })

  it('no llama a getUserContext cuando el usuario es anónimo', async () => {
    await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(mockGetUserContext).not.toHaveBeenCalled()
  })

  it('devuelve error SSE si OPENAI_API_KEY no está configurada', async () => {
    const original = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY

    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    process.env.OPENAI_API_KEY = original

    expect(res.status).toBe(200)
    const events = parseSseEvents(res.text)
    expect(events.find((e) => e.type === 'error')?.content).toContain('no está configurado')
  })

  it('devuelve error SSE si OpenAI lanza una excepción', async () => {
    mockOpenAICreate.mockRejectedValue(new Error('OpenAI timeout'))

    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(res.status).toBe(200)
    const events = parseSseEvents(res.text)
    expect(events.find((e) => e.type === 'error')?.content).toContain('OpenAI timeout')
  })

  it('propaga el error de getOrCreateSession al middleware de errores → 500', async () => {
    mockGetOrCreateSession.mockRejectedValue(new Error('DB error'))

    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(res.status).toBe(500)
  })

  it('propaga el error de addMessage al middleware de errores → 500', async () => {
    mockAddMessage.mockRejectedValue(new Error('DB error'))

    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    expect(res.status).toBe(500)
  })

  it('ignora los chunks del stream que no tienen contenido', async () => {
    mockOpenAICreate.mockImplementation(async function* () {
      yield { choices: [{ delta: {} }] }
      yield { choices: [{ delta: { content: 'Respuesta' } }] }
    })

    const res = await request(app)
      .post('/chat/message')
      .send({ message: 'Hola', sessionKey: 'key-123' })

    const deltaEvents = parseSseEvents(res.text).filter((e) => e.type === 'delta')
    expect(deltaEvents).toHaveLength(1)
    expect(deltaEvents[0].content).toBe('Respuesta')
  })
})

describe('GET /chat/history', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve 400 si no hay sessionKey ni autenticación', async () => {
    const res = await request(app).get('/chat/history')
    expect(res.status).toBe(400)
  })

  it('devuelve [] si no existe la sesión para la sessionKey dada', async () => {
    mockFindSession.mockResolvedValue(null)

    const res = await request(app).get('/chat/history?sessionKey=unknown-key')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('devuelve el historial de mensajes mapeado', async () => {
    const fakeMessages = [
      { role: 'user', content: 'Hola', createdAt: new Date('2025-01-01') },
      { role: 'assistant', content: '¿En qué puedo ayudarte?', createdAt: new Date('2025-01-01') },
    ]
    mockFindSession.mockResolvedValue(fakeSession)
    mockGetHistory.mockResolvedValue(fakeMessages)

    const res = await request(app).get('/chat/history?sessionKey=key-123')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0]).toMatchObject({ role: 'user', content: 'Hola' })
    expect(res.body[1].content).toBe('¿En qué puedo ayudarte?')
  })

  it('funciona con autenticación aunque no haya sessionKey en la query', async () => {
    mockVerifyToken.mockReturnValue({ id: 'user-1', email: 'test@test.com' })
    mockFindSession.mockResolvedValue(fakeSession)
    mockGetHistory.mockResolvedValue([])

    const res = await request(app)
      .get('/chat/history')
      .set('Authorization', 'Bearer valid_token')

    expect(res.status).toBe(200)
    expect(mockFindSession).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1' }),
    )
  })
})
