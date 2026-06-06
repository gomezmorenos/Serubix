import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroSection } from '@/components/landing/HeroSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { hero } = LANDING_CONTENT

describe('HeroSection', () => {
  it('renderiza el título principal en un h1', () => {
    render(<HeroSection {...hero} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(hero.title)
  })

  it('renderiza el subtítulo', () => {
    render(<HeroSection {...hero} />)
    expect(screen.getByText(hero.subtitle)).toBeInTheDocument()
  })

  it('renderiza el CTA principal apuntando a #contacto', () => {
    render(<HeroSection {...hero} />)
    const link = screen.getByRole('link', { name: hero.primaryCTA })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#contacto')
  })

  it('renderiza el CTA secundario apuntando a #servicios', () => {
    render(<HeroSection {...hero} />)
    const link = screen.getByRole('link', { name: hero.secondaryCTA })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#servicios')
  })

  it('renderiza la nota de confianza', () => {
    render(<HeroSection {...hero} />)
    expect(screen.getByText(hero.trustNote)).toBeInTheDocument()
  })

  it('renderiza el badge con el texto correcto', () => {
    render(<HeroSection {...hero} />)
    expect(screen.getByText(hero.badge)).toBeInTheDocument()
  })
})
