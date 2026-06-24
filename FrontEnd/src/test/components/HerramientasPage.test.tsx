import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HerramientasPage from '@/app/(dashboard)/herramientas/page'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'mock-token' }, status: 'authenticated' }),
}))

describe('HerramientasPage', () => {
  it('renderiza el título de la página', () => {
    render(<HerramientasPage />)
    expect(screen.getByRole('heading', { name: 'Herramientas SaaS', level: 1 })).toBeInTheDocument()
  })

  it('renderiza la herramienta Text to Speech', () => {
    render(<HerramientasPage />)
    expect(screen.getByRole('heading', { name: 'Text to Speech', level: 2 })).toBeInTheDocument()
  })

  it('renderiza la herramienta YouTube Shorts', () => {
    render(<HerramientasPage />)
    expect(screen.getByRole('heading', { name: 'YouTube Shorts', level: 2 })).toBeInTheDocument()
  })

  it('renderiza la herramienta Text to Image', () => {
    render(<HerramientasPage />)
    expect(screen.getByRole('heading', { name: 'Text to Image', level: 2 })).toBeInTheDocument()
  })

  it('Text to Speech tiene badge de Disponible', () => {
    render(<HerramientasPage />)
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('hay exactamente dos herramientas con badge Próximamente', () => {
    render(<HerramientasPage />)
    expect(screen.getAllByText('Próximamente')).toHaveLength(2)
  })

  it('renderiza el textarea del widget de Text to Speech', () => {
    render(<HerramientasPage />)
    expect(screen.getByLabelText(/Texto a convertir/i)).toBeInTheDocument()
  })

  it('renderiza 3 artículos de herramientas en total', () => {
    render(<HerramientasPage />)
    expect(document.querySelectorAll('article')).toHaveLength(3)
  })

  it('las herramientas próximas incluyen enlace para ser notificado', () => {
    render(<HerramientasPage />)
    expect(screen.getAllByRole('link', { name: /Avísame/i })).toHaveLength(2)
  })
})
