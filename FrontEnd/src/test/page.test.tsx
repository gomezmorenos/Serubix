import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from '@/app/page'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

describe('HomePage', () => {
  it('renderiza el heading principal del hero', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      LANDING_CONTENT.hero.title,
    )
  })

  it('renderiza el heading del CTA final', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 2, name: LANDING_CONTENT.finalCTA.title }),
    ).toBeInTheDocument()
  })

  it('renderiza el footer con el rol contentinfo', () => {
    render(<HomePage />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('contiene al menos dos enlaces de diagnóstico gratuito', () => {
    render(<HomePage />)
    const ctaLinks = screen.getAllByRole('link', { name: /diagnóstico gratuito/i })
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('renderiza todas las secciones identificadas por su id', () => {
    render(<HomePage />)
    const ids = ['servicios', 'como-funciona', 'beneficios', 'contacto']
    ids.forEach((id) => {
      expect(document.getElementById(id)).toBeInTheDocument()
    })
  })
})
