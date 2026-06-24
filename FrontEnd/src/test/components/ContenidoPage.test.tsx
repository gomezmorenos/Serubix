import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContenidoPage from '@/app/(dashboard)/contenido/page'

vi.mock('@/components/dashboard/ContentGrid', () => ({
  ContentGrid: () => <div data-testid="content-grid" />,
}))

describe('ContenidoPage', () => {
  it('renderiza el título de la página', () => {
    render(<ContenidoPage />)
    expect(screen.getByRole('heading', { name: 'Contenido Generado', level: 1 })).toBeInTheDocument()
  })

  it('renderiza el texto descriptivo', () => {
    render(<ContenidoPage />)
    expect(screen.getByText(/Historial de los últimos 7 días/i)).toBeInTheDocument()
  })

  it('renderiza el componente ContentGrid', () => {
    render(<ContenidoPage />)
    expect(screen.getByTestId('content-grid')).toBeInTheDocument()
  })
})
