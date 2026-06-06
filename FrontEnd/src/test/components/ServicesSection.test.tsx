import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { services } = LANDING_CONTENT

describe('ServicesSection', () => {
  describe('cabecera de sección', () => {
    it('renderiza el label de sección', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.label)).toBeInTheDocument()
    })

    it('renderiza el título en un h2', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(services.title)
    })

    it('renderiza el subtítulo general', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.subtitle)).toBeInTheDocument()
    })

    it('tiene el id correcto para navegación por ancla', () => {
      render(<ServicesSection {...services} />)
      expect(document.getElementById('servicios')).toBeInTheDocument()
    })
  })

  describe('servicios a medida', () => {
    it('renderiza el label del bloque a medida', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.custom.label)).toBeInTheDocument()
    })

    it('renderiza el subtítulo del bloque a medida', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.custom.subtitle)).toBeInTheDocument()
    })

    it('renderiza una tarjeta por cada servicio a medida', () => {
      render(<ServicesSection {...services} />)
      const list = screen.getByRole('list', { name: 'Servicios a medida' })
      expect(list.querySelectorAll('li')).toHaveLength(services.custom.cards.length)
    })

    it('renderiza el título de cada servicio a medida', () => {
      render(<ServicesSection {...services} />)
      services.custom.cards.forEach((card) => {
        expect(screen.getByText(card.title)).toBeInTheDocument()
      })
    })

    it('renderiza la descripción de cada servicio a medida', () => {
      render(<ServicesSection {...services} />)
      services.custom.cards.forEach((card) => {
        expect(screen.getByText(card.description)).toBeInTheDocument()
      })
    })
  })

  describe('productos SaaS', () => {
    it('renderiza el label del bloque SaaS', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.saas.label)).toBeInTheDocument()
    })

    it('renderiza el subtítulo del bloque SaaS', () => {
      render(<ServicesSection {...services} />)
      expect(screen.getByText(services.saas.subtitle)).toBeInTheDocument()
    })

    it('renderiza una tarjeta por cada producto SaaS', () => {
      render(<ServicesSection {...services} />)
      const list = screen.getByRole('list', { name: 'Productos SaaS' })
      expect(list.querySelectorAll('li')).toHaveLength(services.saas.products.length)
    })

    it('renderiza el título de cada producto SaaS', () => {
      render(<ServicesSection {...services} />)
      services.saas.products.forEach((product) => {
        expect(screen.getByText(product.title)).toBeInTheDocument()
      })
    })

    it('renderiza la descripción de cada producto SaaS', () => {
      render(<ServicesSection {...services} />)
      services.saas.products.forEach((product) => {
        expect(screen.getByText(product.description)).toBeInTheDocument()
      })
    })

    it('renderiza un badge por cada producto SaaS', () => {
      render(<ServicesSection {...services} />)
      const badges = document.querySelectorAll('[aria-label^="Estado:"]')
      expect(badges.length).toBe(services.saas.products.length)
    })

    it('cada badge tiene aria-label de estado accesible', () => {
      render(<ServicesSection {...services} />)
      const badgeLabels = services.saas.products.map((p) => p.badge)
      const uniqueBadges = badgeLabels.filter((badge, i, arr) => arr.indexOf(badge) === i)
      uniqueBadges.forEach((badge) => {
        expect(screen.getAllByLabelText(`Estado: ${badge}`).length).toBeGreaterThan(0)
      })
    })
  })
})
