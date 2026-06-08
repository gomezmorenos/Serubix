import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import LoginPage from '@/app/(auth)/login/page'

vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: ({ callbackUrl }: { callbackUrl: string }) => (
    <div data-testid="login-form" data-callback={callbackUrl} />
  ),
}))

describe('LoginPage', () => {
  it('renderiza el título de bienvenida', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({}) })
    render(element)
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo', level: 1 })).toBeInTheDocument()
  })

  it('renderiza el formulario de login', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({}) })
    render(element)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('usa /dashboard como callbackUrl por defecto', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({}) })
    render(element)
    expect(screen.getByTestId('login-form')).toHaveAttribute('data-callback', '/dashboard')
  })

  it('pasa el callbackUrl de los searchParams al formulario', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({ callbackUrl: '/herramientas' }) })
    render(element)
    expect(screen.getByTestId('login-form')).toHaveAttribute('data-callback', '/herramientas')
  })

  it('muestra mensaje de éxito cuando viene de registro', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({ registered: 'true' }) })
    render(element)
    expect(screen.getByText(/Cuenta creada con éxito/i)).toBeInTheDocument()
  })

  it('no muestra mensaje de éxito sin el parámetro registered', async () => {
    const element = await LoginPage({ searchParams: Promise.resolve({}) })
    render(element)
    expect(screen.queryByText(/Cuenta creada con éxito/i)).not.toBeInTheDocument()
  })
})
