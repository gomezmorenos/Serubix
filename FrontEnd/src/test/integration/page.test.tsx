import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from '@/app/page'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

describe('HomePage — integración', () => {
  describe('estructura de secciones', () => {
    it('renderiza el h1 del hero', () => {
      render(<HomePage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        LANDING_CONTENT.hero.title,
      )
    })

    it('hay exactamente un h1 en la página', () => {
      render(<HomePage />)
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    })

    it('renderiza todas las secciones por su id de ancla', () => {
      render(<HomePage />)
      const ids = ['servicios', 'como-funciona', 'beneficios', 'contacto', 'problema', 'solucion', 'producto']
      ids.forEach((id) => {
        expect(document.getElementById(id)).toBeInTheDocument()
      })
    })

    it('renderiza el footer con rol contentinfo', () => {
      render(<HomePage />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renderiza la navegación principal', () => {
      render(<HomePage />)
      expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
    })

    it('renderiza la navegación del footer', () => {
      render(<HomePage />)
      expect(
        screen.getByRole('navigation', { name: 'Navegación del pie de página' }),
      ).toBeInTheDocument()
    })

    it('todos los h2 tienen contenido no vacío', () => {
      render(<HomePage />)
      screen.getAllByRole('heading', { level: 2 }).forEach((h2) => {
        expect(h2.textContent?.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('CTAs y navegación', () => {
    it('hay al menos dos enlaces de diagnóstico gratuito', () => {
      render(<HomePage />)
      const ctaLinks = screen.getAllByRole('link', { name: /diagnóstico gratuito/i })
      expect(ctaLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('el CTA del hero apunta a #contacto', () => {
      render(<HomePage />)
      const heroSection = document.querySelector('section[aria-labelledby="hero-title"]')
      expect(heroSection?.querySelector('a[href="#contacto"]')).toBeInTheDocument()
    })

    it('el CTA final enlaza al email de serubix.com', () => {
      render(<HomePage />)
      // El mismo texto aparece en hero y CTA final — buscamos el que tiene mailto
      const ctaLinks = screen.getAllByRole('link', { name: LANDING_CONTENT.finalCTA.primaryCTA })
      const mailtoLink = ctaLinks.find((l) => l.getAttribute('href')?.startsWith('mailto:'))
      expect(mailtoLink).toHaveAttribute('href', 'mailto:hola@serubix.com')
    })

    it('el email del footer enlaza al email de serubix.com', () => {
      render(<HomePage />)
      const emailLink = screen.getByRole('link', {
        name: `Enviar email a ${LANDING_CONTENT.footer.contact}`,
      })
      expect(emailLink).toHaveAttribute('href', 'mailto:hola@serubix.com')
    })
  })

  describe('identidad de marca', () => {
    it('el navbar muestra Serubix con enlace de inicio', () => {
      render(<HomePage />)
      expect(screen.getByRole('link', { name: /Serubix — Inicio/i })).toBeInTheDocument()
    })

    it('el footer contiene el nombre Serubix', () => {
      render(<HomePage />)
      expect(screen.getByRole('contentinfo')).toHaveTextContent('Serubix')
    })

    it('no hay ninguna referencia a AutomatizaIA en el DOM', () => {
      render(<HomePage />)
      expect(document.body.textContent).not.toContain('AutomatizaIA')
    })

    it('ningún enlace apunta al dominio anterior', () => {
      render(<HomePage />)
      screen.getAllByRole('link').forEach((link) => {
        expect(link.getAttribute('href') ?? '').not.toContain('automatizaia')
      })
    })
  })

  describe('accesibilidad', () => {
    it('el elemento main envuelve el contenido principal', () => {
      render(<HomePage />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('el diagrama de flujo tiene rol img descriptivo', () => {
      render(<HomePage />)
      expect(
        screen.getByRole('img', { name: 'Ilustración del flujo de automatización' }),
      ).toBeInTheDocument()
    })

    it('el dashboard tiene rol img descriptivo', () => {
      render(<HomePage />)
      expect(
        screen.getByRole('img', { name: 'Vista previa del dashboard de la plataforma' }),
      ).toBeInTheDocument()
    })
  })
})
