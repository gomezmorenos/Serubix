import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlanPage from '@/app/(dashboard)/plan/page'

describe('PlanPage', () => {
  it('renderiza el título de la página', () => {
    render(<PlanPage />)
    expect(screen.getByRole('heading', { name: 'Plan y facturación', level: 1 })).toBeInTheDocument()
  })

  it('renderiza el plan Free', () => {
    render(<PlanPage />)
    expect(screen.getByRole('heading', { name: 'Free', level: 3 })).toBeInTheDocument()
  })

  it('renderiza el plan Pro', () => {
    render(<PlanPage />)
    expect(screen.getByRole('heading', { name: 'Pro', level: 3 })).toBeInTheDocument()
  })

  it('el plan Free tiene precio 0€', () => {
    render(<PlanPage />)
    expect(screen.getByText('0€')).toBeInTheDocument()
  })

  it('el plan Pro tiene precio 29€', () => {
    render(<PlanPage />)
    expect(screen.getByText('29€')).toBeInTheDocument()
  })

  it('el botón del plan Free está deshabilitado', () => {
    render(<PlanPage />)
    expect(screen.getByRole('button', { name: 'Plan actual' })).toBeDisabled()
  })

  it('el plan Pro tiene botón de mejora', () => {
    render(<PlanPage />)
    expect(screen.getByRole('button', { name: 'Mejorar a Pro' })).toBeInTheDocument()
  })

  it('renderiza la sección de uso mensual', () => {
    render(<PlanPage />)
    expect(screen.getByRole('heading', { name: 'Uso del mes actual' })).toBeInTheDocument()
  })

  it('renderiza la barra de progreso de Text to Speech', () => {
    render(<PlanPage />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renderiza la sección de facturación', () => {
    render(<PlanPage />)
    expect(screen.getByRole('heading', { name: 'Facturación' })).toBeInTheDocument()
  })
})
