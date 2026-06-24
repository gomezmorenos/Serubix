import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { ChatWidget } from '@/components/ChatWidget'

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

let mockStore: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string): string | null => mockStore[key] ?? null,
  setItem: (key: string, value: string) => { mockStore[key] = value },
  removeItem: (key: string) => { delete mockStore[key] },
  clear: () => { mockStore = {} },
})

vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234',
})

// Helper para simular una respuesta SSE del backend
function makeSseResponse(events: string[]) {
  const body = events.join('\n') + '\n'
  const encoder = new TextEncoder()
  const encoded = encoder.encode(body)

  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoded)
        controller.close()
      },
    }),
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
  )
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ChatWidget', () => {
  beforeEach(() => {
    mockStore = {}
    vi.restoreAllMocks()
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000')
    globalThis.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('muestra el botón flotante al renderizar', () => {
    render(<ChatWidget />)
    expect(screen.getByRole('button', { name: /abrir chat/i })).toBeInTheDocument()
  })

  it('la ventana de chat no está visible inicialmente', () => {
    render(<ChatWidget />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('abre la ventana al hacer clic en el botón flotante', async () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /asistente serubix/i })).toBeInTheDocument()
    })
  })

  it('muestra el mensaje de bienvenida cuando no hay historial', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => {
      expect(screen.getByText(/soy el asistente de serubix/i)).toBeInTheDocument()
    })
  })

  it('cierra la ventana al hacer clic en el botón de cerrar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    // El botón de cerrar del header — el flotante también dice "Cerrar chat" cuando está abierto
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /cerrar chat/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('el botón enviar está deshabilitado cuando el input está vacío', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled()
  })

  it('habilita el botón enviar al escribir texto', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('textbox', { name: /mensaje/i }), {
      target: { value: 'Hola, ¿qué es Serubix?' },
    })
    expect(screen.getByRole('button', { name: /enviar/i })).not.toBeDisabled()
  })

  it('envía el mensaje y muestra la respuesta del asistente', async () => {
    const sseEvents = [
      'data: {"type":"session","sessionKey":"test-uuid-1234"}',
      'data: {"type":"delta","content":"¡Hola! "}',
      'data: {"type":"delta","content":"Soy Serubix."}',
      'data: [DONE]',
    ]
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })   // history
      .mockResolvedValueOnce(makeSseResponse(sseEvents)),            // message
    )

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('textbox', { name: /mensaje/i }), {
      target: { value: '¿Qué es Serubix?' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(screen.getByText('¿Qué es Serubix?')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(/¡Hola!.*Soy Serubix/i)).toBeInTheDocument()
    })
  })

  it('limpia el input tras enviar el mensaje', async () => {
    const sseEvents = [
      'data: {"type":"session","sessionKey":"test-uuid-1234"}',
      'data: {"type":"delta","content":"Respuesta."}',
      'data: [DONE]',
    ]
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce(makeSseResponse(sseEvents)),
    )

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    const textarea = screen.getByRole('textbox', { name: /mensaje/i })
    fireEvent.change(textarea, { target: { value: 'Mensaje de prueba' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect((textarea as HTMLTextAreaElement).value).toBe('')
    })
  })

  it('muestra un error cuando falla la petición de red', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockRejectedValueOnce(new Error('Network error')),
    )

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('textbox', { name: /mensaje/i }), {
      target: { value: 'Hola' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(screen.getByText(/no se pudo enviar/i)).toBeInTheDocument()
    })
  })

  it('muestra el error devuelto por el servidor en el stream SSE', async () => {
    const sseEvents = [
      'data: {"type":"session","sessionKey":"test-uuid-1234"}',
      'data: {"type":"error","content":"Servicio no disponible"}',
      'data: [DONE]',
    ]
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce(makeSseResponse(sseEvents)),
    )

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('textbox', { name: /mensaje/i }), {
      target: { value: 'Hola' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(screen.getByText('Servicio no disponible')).toBeInTheDocument()
    })
  })

  it('guarda la sessionKey en localStorage al recibir evento session', async () => {
    const sseEvents = [
      'data: {"type":"session","sessionKey":"nueva-key-abc"}',
      'data: {"type":"delta","content":"Hola."}',
      'data: [DONE]',
    ]
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce(makeSseResponse(sseEvents)),
    )

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('textbox', { name: /mensaje/i }), {
      target: { value: 'Test' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(mockStore['serubix_chat_session']).toBe('nueva-key-abc')
    })
  })

  it('carga el historial previo al abrir el chat', async () => {
    const history = [
      { role: 'user', content: 'Hola', createdAt: new Date().toISOString() },
      { role: 'assistant', content: 'Bienvenido a Serubix', createdAt: new Date().toISOString() },
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => history }))

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))

    await waitFor(() => {
      expect(screen.getByText('Hola')).toBeInTheDocument()
      expect(screen.getByText('Bienvenido a Serubix')).toBeInTheDocument()
    })
  })

  it('envía el mensaje con Enter y no con Shift+Enter', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
    vi.stubGlobal('fetch', mockFetch)

    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    const textarea = screen.getByRole('textbox', { name: /mensaje/i })
    fireEvent.change(textarea, { target: { value: 'Test' } })

    // Shift+Enter no envía
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(mockFetch).toHaveBeenCalledTimes(1) // solo la llamada de historial

    // Enter sin Shift sí envía (fetch llamado una vez más)
    mockFetch.mockResolvedValueOnce(makeSseResponse(['data: [DONE]']))
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
  })
})
