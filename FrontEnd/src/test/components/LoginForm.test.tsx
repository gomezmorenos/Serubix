import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LoginForm } from '@/components/auth/LoginForm'

const mockSignIn = vi.hoisted(() => vi.fn())
const mockPush = vi.hoisted(() => vi.fn())
const mockRefresh = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  signIn: mockSignIn,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
    mockPush.mockClear()
    mockRefresh.mockClear()
    mockSignIn.mockResolvedValue({ error: null })
  })

  it('renderiza el campo de email', () => {
    render(<LoginForm callbackUrl="/dashboard" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renderiza el campo de contraseña', () => {
    render(<LoginForm callbackUrl="/dashboard" />)
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('renderiza el botón de iniciar sesión', () => {
    render(<LoginForm callbackUrl="/dashboard" />)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('renderiza el botón de Google', () => {
    render(<LoginForm callbackUrl="/dashboard" />)
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
  })

  it('renderiza enlace para registrarse', () => {
    render(<LoginForm callbackUrl="/dashboard" />)
    expect(screen.getByRole('link', { name: 'Regístrate gratis' })).toBeInTheDocument()
  })

  it('llama a signIn con credentials al enviar', async () => {
    const user = userEvent.setup()
    render(<LoginForm callbackUrl="/dashboard" />)
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@test.com',
      password: 'password123',
      redirect: false,
    })
  })

  it('redirige al callbackUrl tras login exitoso', async () => {
    const user = userEvent.setup()
    render(<LoginForm callbackUrl="/herramientas" />)
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(mockPush).toHaveBeenCalledWith('/herramientas')
  })

  it('muestra error cuando las credenciales son incorrectas', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' })
    const user = userEvent.setup()
    render(<LoginForm callbackUrl="/dashboard" />)
    await user.type(screen.getByLabelText('Email'), 'wrong@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Email o contraseña incorrectos')
  })

  it('deshabilita el botón y muestra cargando durante el envío', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    render(<LoginForm callbackUrl="/dashboard" />)
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'pass123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(screen.getByRole('button', { name: 'Iniciando sesión...' })).toBeDisabled()
  })
})
