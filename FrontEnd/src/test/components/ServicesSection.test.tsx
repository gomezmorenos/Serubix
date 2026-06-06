import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { services } = LANDING_CONTENT

describe('ServicesSection', () => {
  it('renderiza el label de sección', () => {
    render(<ServicesSection {...services} />)
    expect(screen.getByText(services.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<ServicesSection {...services} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(services.title)
  })

  it('renderiza el subtítulo', () => {
    render(<ServicesSection {...services} />)
    expect(screen.getByText(services.subtitle)).toBeInTheDocument()
  })

  it('renderiza un ítem de lista por cada servicio', () => {
    render(<ServicesSection {...services} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(services.cards.length)
  })

  it('renderiza el título de cada servicio', () => {
    render(<ServicesSection {...services} />)
    services.cards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument()
    })
  })

  it('renderiza la descripción de cada servicio', () => {
    render(<ServicesSection {...services} />)
    services.cards.forEach((card) => {
      expect(screen.getByText(card.description)).toBeInTheDocument()
    })
  })

  it('la lista tiene aria-label accesible', () => {
    render(<ServicesSection {...services} />)
    expect(screen.getByRole('list', { name: 'Nuestros servicios' })).toBeInTheDocument()
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<ServicesSection {...services} />)
    expect(document.getElementById('servicios')).toBeInTheDocument()
  })
})
