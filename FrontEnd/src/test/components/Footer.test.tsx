import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from '@/components/landing/Footer'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { footer } = LANDING_CONTENT

describe('Footer', () => {
  it('renderiza el nombre de marca', () => {
    render(<Footer {...footer} />)
    expect(screen.getByText(footer.brand)).toBeInTheDocument()
  })

  it('renderiza el tagline', () => {
    render(<Footer {...footer} />)
    expect(screen.getByText(footer.tagline)).toBeInTheDocument()
  })

  it('renderiza todos los enlaces de navegación', () => {
    render(<Footer {...footer} />)
    footer.links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument()
    })
  })

  it('cada enlace de navegación apunta al href correcto', () => {
    render(<Footer {...footer} />)
    footer.links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
    })
  })

  it('renderiza el email de contacto visible', () => {
    render(<Footer {...footer} />)
    expect(screen.getByText(footer.contact)).toBeInTheDocument()
  })

  it('el enlace de contacto es un mailto con aria-label', () => {
    render(<Footer {...footer} />)
    const emailLink = screen.getByRole('link', { name: `Enviar email a ${footer.contact}` })
    expect(emailLink).toHaveAttribute('href', `mailto:${footer.contact}`)
  })

  it('el email de contacto es de serubix.com', () => {
    render(<Footer {...footer} />)
    expect(footer.contact).toContain('@serubix.com')
  })

  it('renderiza el texto de copyright', () => {
    render(<Footer {...footer} />)
    expect(screen.getByText(footer.copyright)).toBeInTheDocument()
  })

  it('tiene el rol semántico contentinfo', () => {
    render(<Footer {...footer} />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('tiene navegación de pie de página accesible', () => {
    render(<Footer {...footer} />)
    expect(
      screen.getByRole('navigation', { name: 'Navegación del pie de página' }),
    ).toBeInTheDocument()
  })
})
