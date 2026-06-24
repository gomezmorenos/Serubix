import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TtsWidget } from '@/components/dashboard/TtsWidget'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'mock-token' }, status: 'authenticated' }),
}))

describe('TtsWidget', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('renderiza el textarea y el selector de voz', () => {
    render(<TtsWidget />)
    expect(screen.getByLabelText(/Texto a convertir/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('muestra las 6 opciones de voz', () => {
    render(<TtsWidget />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(6)
  })

  it('el botón está desactivado si el textarea está vacío', () => {
    render(<TtsWidget />)
    expect(screen.getByRole('button', { name: /Generar audio/i })).toBeDisabled()
  })

  it('el botón se activa al escribir texto', () => {
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola mundo' } })
    expect(screen.getByRole('button', { name: /Generar audio/i })).not.toBeDisabled()
  })

  it('muestra el contador de caracteres', () => {
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola' } })
    expect(screen.getByText(/4\/4096/)).toBeInTheDocument()
  })

  it('muestra "En cola" y enlace a /contenido tras generación exitosa', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'c1' }) })
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola mundo' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByRole('link', { name: /ver progreso/i })).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /ver progreso/i })).toHaveAttribute('href', '/contenido')
  })

  it('limpia el textarea tras generación exitosa', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'c1' }) })
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola mundo' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByRole('link', { name: /ver progreso/i })).toBeInTheDocument())
    expect(screen.getByLabelText(/Texto a convertir/i)).toHaveValue('')
  })

  it('muestra error de red si fetch lanza excepción', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByText(/No se puede conectar/i)).toBeInTheDocument())
  })

  it('muestra el mensaje de error 402 cuando se supera el límite del plan', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 402,
      json: () => Promise.resolve({ error: 'Límite mensual alcanzado' }),
    })
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByText('Límite mensual alcanzado')).toBeInTheDocument())
  })

  it('muestra error genérico para otros errores del servidor', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Error interno del servidor' }),
    })
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByText('Error interno del servidor')).toBeInTheDocument())
  })

  it('el botón muestra "Generando..." mientras espera respuesta', async () => {
    let resolvePromise!: (v: unknown) => void
    mockFetch.mockReturnValue(new Promise((r) => { resolvePromise = r }))
    render(<TtsWidget />)
    fireEvent.change(screen.getByLabelText(/Texto a convertir/i), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: /Generar audio/i }))
    await waitFor(() => expect(screen.getByText(/Generando/i)).toBeInTheDocument())
    resolvePromise({ ok: true, json: () => Promise.resolve({ id: 'c1' }) })
  })
})
