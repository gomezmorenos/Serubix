import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { finalCTA } = LANDING_CONTENT

describe('FinalCTASection', () => {
  it('renderiza el título en un h2', () => {
    render(<FinalCTASection {...finalCTA} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(finalCTA.title)
  })

  it('renderiza el subtítulo', () => {
    render(<FinalCTASection {...finalCTA} />)
    expect(screen.getByText(finalCTA.subtitle)).toBeInTheDocument()
  })

  it('renderiza el enlace CTA principal', () => {
    render(<FinalCTASection {...finalCTA} />)
    expect(screen.getByRole('link', { name: finalCTA.primaryCTA })).toBeInTheDocument()
  })

  it('el CTA es un enlace mailto', () => {
    render(<FinalCTASection {...finalCTA} />)
    const link = screen.getByRole('link', { name: finalCTA.primaryCTA })
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('el email del CTA pertenece al dominio serubix.com', () => {
    render(<FinalCTASection {...finalCTA} />)
    const link = screen.getByRole('link', { name: finalCTA.primaryCTA })
    expect(link).toHaveAttribute('href', `mailto:${finalCTA.contact}`)
    expect(link).toHaveAttribute('href', expect.stringContaining('serubix.com'))
  })

  it('no contiene referencias al dominio anterior', () => {
    render(<FinalCTASection {...finalCTA} />)
    const link = screen.getByRole('link', { name: finalCTA.primaryCTA })
    expect(link).not.toHaveAttribute('href', expect.stringContaining('automatizaia'))
  })

  it('renderiza la nota final', () => {
    render(<FinalCTASection {...finalCTA} />)
    expect(screen.getByText(finalCTA.note)).toBeInTheDocument()
  })

  it('tiene el id de contacto para navegación por ancla', () => {
    render(<FinalCTASection {...finalCTA} />)
    expect(document.getElementById('contacto')).toBeInTheDocument()
  })
})
