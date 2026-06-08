import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AuthLayout from '@/app/(auth)/layout'

describe('AuthLayout', () => {
  it('renderiza el logo de Serubix', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByRole('link', { name: 'Serubix' })).toBeInTheDocument()
  })

  it('el logo enlaza a la página de inicio', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByRole('link', { name: 'Serubix' })).toHaveAttribute('href', '/')
  })

  it('renderiza el contenido hijo', () => {
    render(<AuthLayout><div>contenido de prueba</div></AuthLayout>)
    expect(screen.getByText('contenido de prueba')).toBeInTheDocument()
  })

  it('renderiza el copyright en el footer', () => {
    render(<AuthLayout><div /></AuthLayout>)
    expect(screen.getByText(/Serubix.*Todos los derechos/)).toBeInTheDocument()
  })
})
