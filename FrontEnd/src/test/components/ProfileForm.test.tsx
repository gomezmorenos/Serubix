import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { ProfileForm } from '@/components/dashboard/ProfileForm'
import { useSession } from 'next-auth/react'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  useSession: vi.fn().mockReturnValue({ data: null }),
}))

describe('ProfileForm', () => {
  it('renderiza el campo de nombre con el valor del usuario', () => {
    render(<ProfileForm name="Test User" email="test@test.com" />)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Test User')
  })

  it('renderiza el campo de email deshabilitado', () => {
    render(<ProfileForm name="Test User" email="test@test.com" />)
    const emailField = screen.getByLabelText('Email')
    expect(emailField).toBeDisabled()
    expect(emailField).toHaveValue('test@test.com')
  })

  it('renderiza el botón de guardar cambios', () => {
    render(<ProfileForm name="Test User" email="test@test.com" />)
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('permite editar el campo de nombre', async () => {
    const user = userEvent.setup()
    render(<ProfileForm name="Test User" email="test@test.com" />)
    const input = screen.getByLabelText('Nombre')
    await user.clear(input)
    await user.type(input, 'Nuevo Nombre')
    expect(input).toHaveValue('Nuevo Nombre')
  })

  it('muestra el estado de carga mientras guarda', async () => {
    const user = userEvent.setup()
    render(<ProfileForm name="Test User" email="test@test.com" />)
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })

  it('muestra mensaje de éxito tras guardar', async () => {
    const user = userEvent.setup()
    render(<ProfileForm name="Test User" email="test@test.com" />)
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Cambios guardados correctamente.')).toBeInTheDocument()
  })

  it('funciona correctamente con valores nulos', () => {
    render(<ProfileForm name={null} email={null} />)
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
  })
})

describe('ProfileForm - con backendToken y API URL', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('llama a la API con el token y muestra éxito', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'u1', email: 'test@test.com' }, backendToken: 'tok123', expires: '' },
      status: 'authenticated',
      update: vi.fn(),
    })
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000'
    mockFetch.mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ProfileForm name="Test" email="test@test.com" />)
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('Cambios guardados correctamente.')).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/users/me',
      expect.objectContaining({ method: 'PATCH' }),
    )
  })

  it('muestra error cuando la llamada a la API falla', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'u1', email: 'test@test.com' }, backendToken: 'tok123', expires: '' },
      status: 'authenticated',
      update: vi.fn(),
    })
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000'
    mockFetch.mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ProfileForm name="Test" email="test@test.com" />)
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('No se pudo guardar. Inténtalo de nuevo.')).toBeInTheDocument()
  })
})
