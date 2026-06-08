import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Navbar } from '@/components/landing/Navbar'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { nav } = LANDING_CONTENT

describe('Navbar', () => {
  it('renderiza el nombre de marca', () => {
    render(<Navbar {...nav} />)
    expect(screen.getByText(nav.brand)).toBeInTheDocument()
  })

  it('el brand tiene aria-label de inicio', () => {
    render(<Navbar {...nav} />)
    expect(screen.getByRole('link', { name: `${nav.brand} — Inicio` })).toBeInTheDocument()
  })

  it('renderiza todos los items de navegación', () => {
    render(<Navbar {...nav} />)
    nav.items.forEach((item) => {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument()
    })
  })

  it('cada nav item apunta al href correcto', () => {
    render(<Navbar {...nav} />)
    nav.items.forEach((item) => {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href)
    })
  })

  it('renderiza el CTA', () => {
    render(<Navbar {...nav} />)
    expect(screen.getByRole('link', { name: nav.cta })).toBeInTheDocument()
  })

  it('el CTA apunta a la ruta configurada', () => {
    render(<Navbar {...nav} />)
    expect(screen.getByRole('link', { name: nav.cta })).toHaveAttribute('href', nav.ctaHref)
  })

  it('tiene rol de navegación principal accesible', () => {
    render(<Navbar {...nav} />)
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
  })

  describe('comportamiento de scroll', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    })

    afterEach(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    })

    it('sin scroll no tiene fondo opaco', () => {
      render(<Navbar {...nav} />)
      const header = document.querySelector('header')
      expect(header?.className).not.toContain('bg-zinc-950/95')
    })

    it('al hacer scroll añade clase con fondo opaco', () => {
      render(<Navbar {...nav} />)
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true })
      fireEvent.scroll(window)
      const header = document.querySelector('header')
      expect(header?.className).toContain('bg-zinc-950/95')
    })
  })
})
