import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { RegisterForm } from '@/components/auth/RegisterForm'

const mockPush = vi.fn()
const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next-auth/react', () => ({
  signIn: vi.fn().mockResolvedValue(undefined),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renderiza el campo de nombre', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('renderiza el campo de email', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renderiza el campo de contraseña', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('renderiza el campo de confirmar contraseña', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
  })

  it('renderiza el botón de crear cuenta', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument()
  })

  it('renderiza el botón de Google', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
  })

  it('renderiza enlace para iniciar sesión', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toBeInTheDocument()
  })

  it('muestra error cuando las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'different456')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Las contraseñas no coinciden')
  })

  it('muestra error cuando la contraseña es demasiado corta', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), '123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), '123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('al menos 6 caracteres')
  })

  it('redirige a /login?registered=true tras registro exitoso', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await screen.findByRole('button', { name: 'Crear cuenta' })
    expect(mockPush).toHaveBeenCalledWith('/login?registered=true')
  })
})

describe('RegisterForm - con NEXT_PUBLIC_API_URL', () => {
  beforeEach(() => {
    mockPush.mockClear()
    vi.stubGlobal('fetch', mockFetch)
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('llama a la API y redirige si el registro es exitoso', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'api@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await screen.findByRole('button', { name: 'Crear cuenta' })
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/auth/register',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(mockPush).toHaveBeenCalledWith('/login?registered=true')
  })

  it('muestra error de la API cuando el registro falla', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'El email ya está registrado' }),
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'taken@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('El email ya está registrado')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('muestra mensaje específico para email duplicado (409)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({}),
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'dup@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('ya tiene una cuenta')
  })

  it('muestra el primer error de validación cuando la API devuelve 400 con details', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ details: { email: ['Email inválido'] } }),
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'bad')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Email inválido')
  })

  it('muestra error de red si fetch lanza excepción', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se puede conectar')
  })
})
