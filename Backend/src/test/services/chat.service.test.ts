import { describe, it, expect, vi, beforeEach } from 'vitest'
import { chatService } from '../../services/chat.service'

const mockSessionFindUnique = vi.hoisted(() => vi.fn())
const mockSessionCreate = vi.hoisted(() => vi.fn())
const mockSessionUpdate = vi.hoisted(() => vi.fn())
const mockSessionFindFirst = vi.hoisted(() => vi.fn())
const mockMessageCreate = vi.hoisted(() => vi.fn())
const mockMessageFindMany = vi.hoisted(() => vi.fn())
const mockUserFindUnique = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    chatSession: {
      findUnique: mockSessionFindUnique,
      create: mockSessionCreate,
      update: mockSessionUpdate,
      findFirst: mockSessionFindFirst,
    },
    chatMessage: {
      create: mockMessageCreate,
      findMany: mockMessageFindMany,
    },
    user: {
      findUnique: mockUserFindUnique,
    },
  },
}))

const fakeSession = { id: 'sess-1', sessionKey: 'key-123', userId: null }

describe('chatService.getOrCreateSession', () => {
  beforeEach(() => vi.clearAllMocks())

  it('crea una sesión nueva si no existe', async () => {
    mockSessionFindUnique.mockResolvedValue(null)
    mockSessionCreate.mockResolvedValue(fakeSession)

    const result = await chatService.getOrCreateSession({ userId: null, sessionKey: 'key-123' })

    expect(mockSessionCreate).toHaveBeenCalledWith({ data: { sessionKey: 'key-123', userId: null } })
    expect(result).toEqual(fakeSession)
  })

  it('devuelve la sesión existente sin cambios si no se aporta userId', async () => {
    mockSessionFindUnique.mockResolvedValue(fakeSession)

    const result = await chatService.getOrCreateSession({ userId: null, sessionKey: 'key-123' })

    expect(mockSessionCreate).not.toHaveBeenCalled()
    expect(mockSessionUpdate).not.toHaveBeenCalled()
    expect(result).toEqual(fakeSession)
  })

  it('actualiza el userId de una sesión anónima al autenticarse', async () => {
    mockSessionFindUnique.mockResolvedValue(fakeSession)
    const updated = { ...fakeSession, userId: 'user-1' }
    mockSessionUpdate.mockResolvedValue(updated)

    const result = await chatService.getOrCreateSession({ userId: 'user-1', sessionKey: 'key-123' })

    expect(mockSessionUpdate).toHaveBeenCalledWith({
      where: { id: 'sess-1' },
      data: { userId: 'user-1' },
    })
    expect(result).toEqual(updated)
  })

  it('no actualiza la sesión si ya tiene un userId asignado', async () => {
    const existing = { ...fakeSession, userId: 'existing-user' }
    mockSessionFindUnique.mockResolvedValue(existing)

    const result = await chatService.getOrCreateSession({ userId: 'new-user', sessionKey: 'key-123' })

    expect(mockSessionUpdate).not.toHaveBeenCalled()
    expect(result).toEqual(existing)
  })
})

describe('chatService.findSession', () => {
  beforeEach(() => vi.clearAllMocks())

  it('usa findFirst con OR cuando hay userId', async () => {
    mockSessionFindFirst.mockResolvedValue(fakeSession)

    const result = await chatService.findSession({ userId: 'user-1', sessionKey: 'key-123' })

    expect(mockSessionFindFirst).toHaveBeenCalledWith({
      where: { OR: [{ userId: 'user-1' }, { sessionKey: 'key-123' }] },
      orderBy: { updatedAt: 'desc' },
    })
    expect(result).toEqual(fakeSession)
  })

  it('usa findUnique por sessionKey si no hay userId', async () => {
    mockSessionFindUnique.mockResolvedValue(fakeSession)

    const result = await chatService.findSession({ userId: null, sessionKey: 'key-123' })

    expect(mockSessionFindUnique).toHaveBeenCalledWith({ where: { sessionKey: 'key-123' } })
    expect(result).toEqual(fakeSession)
  })
})

describe('chatService.addMessage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('actualiza updatedAt de la sesión y crea el mensaje', async () => {
    mockSessionUpdate.mockResolvedValue({})
    const fakeMsg = { id: 'msg-1', sessionId: 'sess-1', role: 'user', content: 'Hola' }
    mockMessageCreate.mockResolvedValue(fakeMsg)

    const result = await chatService.addMessage('sess-1', 'user', 'Hola')

    expect(mockSessionUpdate).toHaveBeenCalledWith({
      where: { id: 'sess-1' },
      data: { updatedAt: expect.any(Date) },
    })
    expect(mockMessageCreate).toHaveBeenCalledWith({
      data: { sessionId: 'sess-1', role: 'user', content: 'Hola' },
    })
    expect(result).toEqual(fakeMsg)
  })
})

describe('chatService.getHistory', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve los mensajes ordenados con el límite indicado', async () => {
    const msgs = [
      { id: 'msg-1', role: 'user', content: 'Hola' },
      { id: 'msg-2', role: 'assistant', content: '¿En qué puedo ayudarte?' },
    ]
    mockMessageFindMany.mockResolvedValue(msgs)

    const result = await chatService.getHistory('sess-1', 20)

    expect(mockMessageFindMany).toHaveBeenCalledWith({
      where: { sessionId: 'sess-1' },
      orderBy: { createdAt: 'asc' },
      take: -20,
    })
    expect(result).toEqual(msgs)
  })

  it('usa el límite por defecto de 20', async () => {
    mockMessageFindMany.mockResolvedValue([])
    await chatService.getHistory('sess-1')
    expect(mockMessageFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: -20 }))
  })
})

describe('chatService.getUserContext', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve undefined si el usuario no existe', async () => {
    mockUserFindUnique.mockResolvedValue(null)
    const result = await chatService.getUserContext('nonexistent')
    expect(result).toBeUndefined()
  })

  it('acumula el uso de TTS y devuelve el contexto completo', async () => {
    mockUserFindUnique.mockResolvedValue({
      name: 'Test User',
      plan: { id: 'pro', name: 'Pro', ttsLimit: 50000 },
      usages: [{ amount: 1000 }, { amount: 500 }],
    })

    const ctx = await chatService.getUserContext('user-1')
    expect(ctx).toEqual({ name: 'Test User', plan: 'Pro', ttsUsed: 1500, ttsLimit: 50000 })
  })

  it('devuelve ttsUsed=0 si no hay registros de uso', async () => {
    mockUserFindUnique.mockResolvedValue({
      name: 'New User',
      plan: { id: 'free', name: 'Free', ttsLimit: 5000 },
      usages: [],
    })

    const ctx = await chatService.getUserContext('user-1')
    expect(ctx?.ttsUsed).toBe(0)
    expect(ctx?.ttsLimit).toBe(5000)
  })
})

describe('chatService.buildOpenAIMessages', () => {
  it('sin userCtx: primer mensaje es system con el prompt de Serubix', () => {
    const history = [
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: '¿En qué puedo ayudarte?' },
    ]
    const msgs = chatService.buildOpenAIMessages(history)

    expect(msgs[0].role).toBe('system')
    expect(msgs[0].content).toContain('Serubix')
    expect(msgs[1]).toEqual({ role: 'user', content: 'Hola' })
    expect(msgs[2]).toEqual({ role: 'assistant', content: '¿En qué puedo ayudarte?' })
  })

  it('con userCtx: el prompt incluye nombre, plan y uso TTS del usuario', () => {
    const msgs = chatService.buildOpenAIMessages([], {
      name: 'Sergio',
      plan: 'Pro',
      ttsUsed: 1500,
      ttsLimit: 50000,
    })

    expect(msgs[0].role).toBe('system')
    expect(msgs[0].content).toContain('Sergio')
    expect(msgs[0].content).toContain('Pro')
    expect(msgs[0].content).toContain('1500/50000')
  })

  it('con ttsLimit=0: el prompt indica uso ilimitado', () => {
    const msgs = chatService.buildOpenAIMessages([], {
      name: 'Admin',
      plan: 'Pro',
      ttsUsed: 0,
      ttsLimit: 0,
    })

    expect(msgs[0].content).toContain('ilimitado')
  })

  it('con name null: usa "Usuario" como nombre de fallback', () => {
    const msgs = chatService.buildOpenAIMessages([], {
      name: null,
      plan: 'Free',
      ttsUsed: 0,
      ttsLimit: 5000,
    })

    expect(msgs[0].content).toContain('Usuario')
  })
})
