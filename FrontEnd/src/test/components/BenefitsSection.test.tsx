import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { benefits } = LANDING_CONTENT

describe('BenefitsSection', () => {
  it('renderiza el label de sección', () => {
    render(<BenefitsSection {...benefits} />)
    expect(screen.getByText(benefits.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<BenefitsSection {...benefits} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(benefits.title)
  })

  it('renderiza el subtítulo', () => {
    render(<BenefitsSection {...benefits} />)
    expect(screen.getByText(benefits.subtitle)).toBeInTheDocument()
  })

  it('renderiza un item por cada beneficio', () => {
    render(<BenefitsSection {...benefits} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(benefits.items.length)
  })

  it('renderiza el label de cada beneficio', () => {
    render(<BenefitsSection {...benefits} />)
    benefits.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it('renderiza la descripción de cada beneficio', () => {
    render(<BenefitsSection {...benefits} />)
    benefits.items.forEach((item) => {
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it('renderiza la métrica de cada beneficio', () => {
    render(<BenefitsSection {...benefits} />)
    benefits.items.forEach((item) => {
      expect(screen.getByLabelText(`${item.metric}${item.unit}`)).toBeInTheDocument()
    })
  })

  it('la lista tiene aria-label accesible', () => {
    render(<BenefitsSection {...benefits} />)
    expect(screen.getByRole('list', { name: 'Beneficios de la plataforma' })).toBeInTheDocument()
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<BenefitsSection {...benefits} />)
    expect(document.getElementById('beneficios')).toBeInTheDocument()
  })
})
