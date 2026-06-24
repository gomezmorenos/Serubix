import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ContentGrid } from '@/components/dashboard/ContentGrid'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'mock-token' }, status: 'authenticated' }),
}))

const baseItem = {
  id: 'c1',
  tool: 'tts',
  label: 'Hola mundo',
  createdAt: new Date().toISOString(),
}

describe('ContentGrid', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllTimers()
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('muestra spinner de carga en el estado inicial', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    render(<ContentGrid />)
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument()
  })

  it('muestra estado vacío cuando no hay contenido', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    render(<ContentGrid />)
    await waitFor(() =>
      expect(screen.getByText(/No hay contenido generado/i)).toBeInTheDocument(),
    )
  })

  it('muestra un item con estado "done" y botón de descarga', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ ...baseItem, status: 'done', filename: 'c1.mp3' }]),
    })
    render(<ContentGrid />)
    await waitFor(() => expect(screen.getByText('Hola mundo')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /Descargar/i })).toBeInTheDocument()
  })

  it('muestra spinner de generación para items en estado "pending"', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ ...baseItem, status: 'pending', filename: null }]),
    })
    render(<ContentGrid />)
    await waitFor(() => expect(screen.getByText('Generando')).toBeInTheDocument())
  })

  it('muestra icono de error para items en estado "error"', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ ...baseItem, status: 'error', filename: null }]),
    })
    render(<ContentGrid />)
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument())
  })

  it('muestra el nombre de la herramienta "Text to Speech"', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ ...baseItem, status: 'done', filename: 'c1.mp3' }]),
    })
    render(<ContentGrid />)
    await waitFor(() => expect(screen.getByText('Text to Speech')).toBeInTheDocument())
  })

  it('descarga el fichero al hacer click en "Descargar"', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ ...baseItem, status: 'done', filename: 'c1.mp3' }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['audio'], { type: 'audio/mpeg' })),
      })

    render(<ContentGrid />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Descargar/i })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Descargar/i }))

    await waitFor(() => expect(clickSpy).toHaveBeenCalled())
    expect(createObjectURL).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  it('llama a la API con el Authorization header correcto', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    render(<ContentGrid />)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/tools/content',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
      }),
    ))
  })
})
