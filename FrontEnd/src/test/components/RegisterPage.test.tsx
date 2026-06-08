import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import RegisterPage from '@/app/(auth)/register/page'

vi.mock('@/components/auth/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form" />,
}))

describe('RegisterPage', () => {
  it('renderiza el título de crear cuenta', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('heading', { name: 'Crear una cuenta', level: 1 })).toBeInTheDocument()
  })

  it('renderiza el subtítulo', () => {
    render(<RegisterPage />)
    expect(screen.getByText('Empieza a automatizar tu negocio hoy')).toBeInTheDocument()
  })

  it('renderiza el formulario de registro', () => {
    render(<RegisterPage />)
    expect(screen.getByTestId('register-form')).toBeInTheDocument()
  })
})
