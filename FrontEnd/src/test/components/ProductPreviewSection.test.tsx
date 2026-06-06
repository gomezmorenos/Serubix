import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProductPreviewSection } from '@/components/landing/ProductPreviewSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { productPreview } = LANDING_CONTENT

describe('ProductPreviewSection', () => {
  it('renderiza el label de sección', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByText(productPreview.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(productPreview.title)
  })

  it('renderiza el subtítulo', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByText(productPreview.subtitle)).toBeInTheDocument()
  })

  it('renderiza el dashboard con rol img y descripción accesible', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(
      screen.getByRole('img', { name: 'Vista previa del dashboard de la plataforma' }),
    ).toBeInTheDocument()
  })

  it('renderiza las 4 métricas del mock', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByText('Leads activos')).toBeInTheDocument()
    expect(screen.getByText('Automatizaciones')).toBeInTheDocument()
    expect(screen.getByText('Respuestas IA')).toBeInTheDocument()
    expect(screen.getByText('Conversión')).toBeInTheDocument()
  })

  it('renderiza los leads del mock con sus nombres', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('Carlos M.')).toBeInTheDocument()
    expect(screen.getByText('Empresa XYZ')).toBeInTheDocument()
  })

  it('renderiza los estados de los leads', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
    expect(screen.getByText('En proceso')).toBeInTheDocument()
    expect(screen.getByText('Convertido')).toBeInTheDocument()
  })

  it('renderiza la preview del asistente IA', () => {
    render(<ProductPreviewSection {...productPreview} />)
    // Aparece dos veces: título del panel y label del mensaje del chat
    const matches = screen.getAllByText('Asistente IA')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<ProductPreviewSection {...productPreview} />)
    expect(document.getElementById('producto')).toBeInTheDocument()
  })
})
