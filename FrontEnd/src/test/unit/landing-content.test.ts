import { describe, it, expect } from 'vitest'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

describe('LANDING_CONTENT — integridad de datos', () => {
  describe('nav', () => {
    it('el brand es Serubix', () => {
      expect(LANDING_CONTENT.nav.brand).toBe('Serubix')
    })

    it('tiene al menos un item de navegación', () => {
      expect(LANDING_CONTENT.nav.items.length).toBeGreaterThan(0)
    })

    it('cada nav item tiene label y href con ancla', () => {
      LANDING_CONTENT.nav.items.forEach((item) => {
        expect(item.label).toBeTruthy()
        expect(item.href).toMatch(/^#/)
      })
    })

    it('los hrefs de navegación son únicos', () => {
      const hrefs = LANDING_CONTENT.nav.items.map((i) => i.href)
      expect(new Set(hrefs).size).toBe(hrefs.length)
    })

    it('tiene texto para el CTA', () => {
      expect(LANDING_CONTENT.nav.cta).toBeTruthy()
    })
  })

  describe('hero', () => {
    it('tiene todos los campos requeridos con contenido', () => {
      const { badge, title, subtitle, primaryCTA, secondaryCTA, trustNote } = LANDING_CONTENT.hero
      expect(badge).toBeTruthy()
      expect(title).toBeTruthy()
      expect(subtitle).toBeTruthy()
      expect(primaryCTA).toBeTruthy()
      expect(secondaryCTA).toBeTruthy()
      expect(trustNote).toBeTruthy()
    })
  })

  describe('problem', () => {
    it('tiene al menos una tarjeta de problema', () => {
      expect(LANDING_CONTENT.problem.cards.length).toBeGreaterThan(0)
    })

    it('cada problema tiene id, icon, title y description', () => {
      LANDING_CONTENT.problem.cards.forEach((card) => {
        expect(card.id).toBeTruthy()
        expect(card.icon).toBeTruthy()
        expect(card.title).toBeTruthy()
        expect(card.description).toBeTruthy()
      })
    })

    it('los ids de los problemas son únicos', () => {
      const ids = LANDING_CONTENT.problem.cards.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('solution', () => {
    it('tiene título, subtítulo y label', () => {
      const { label, title, subtitle } = LANDING_CONTENT.solution
      expect(label).toBeTruthy()
      expect(title).toBeTruthy()
      expect(subtitle).toBeTruthy()
    })

    it('tiene al menos un punto de solución', () => {
      expect(LANDING_CONTENT.solution.points.length).toBeGreaterThan(0)
    })

    it('ningún punto de solución está vacío', () => {
      LANDING_CONTENT.solution.points.forEach((point) => {
        expect(point.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('services', () => {
    it('tiene título, subtítulo y label', () => {
      const { label, title, subtitle } = LANDING_CONTENT.services
      expect(label).toBeTruthy()
      expect(title).toBeTruthy()
      expect(subtitle).toBeTruthy()
    })

    describe('custom', () => {
      it('tiene al menos un servicio a medida', () => {
        expect(LANDING_CONTENT.services.custom.cards.length).toBeGreaterThan(0)
      })

      it('cada servicio tiene id, icon, title y description', () => {
        LANDING_CONTENT.services.custom.cards.forEach((card) => {
          expect(card.id).toBeTruthy()
          expect(card.icon).toBeTruthy()
          expect(card.title).toBeTruthy()
          expect(card.description).toBeTruthy()
        })
      })

      it('los ids de los servicios a medida son únicos', () => {
        const ids = LANDING_CONTENT.services.custom.cards.map((c) => c.id)
        expect(new Set(ids).size).toBe(ids.length)
      })
    })

    describe('saas', () => {
      it('tiene al menos un producto SaaS', () => {
        expect(LANDING_CONTENT.services.saas.products.length).toBeGreaterThan(0)
      })

      it('cada producto SaaS tiene id, icon, title, description, badge y badgeVariant', () => {
        LANDING_CONTENT.services.saas.products.forEach((product) => {
          expect(product.id).toBeTruthy()
          expect(product.icon).toBeTruthy()
          expect(product.title).toBeTruthy()
          expect(product.description).toBeTruthy()
          expect(product.badge).toBeTruthy()
          expect(['available', 'beta', 'soon']).toContain(product.badgeVariant)
        })
      })

      it('los ids de los productos SaaS son únicos', () => {
        const ids = LANDING_CONTENT.services.saas.products.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
      })

      it('todos los ids son únicos entre servicios a medida y SaaS', () => {
        const customIds = LANDING_CONTENT.services.custom.cards.map((c) => c.id)
        const saasIds = LANDING_CONTENT.services.saas.products.map((p) => p.id)
        const allIds = [...customIds, ...saasIds]
        expect(new Set(allIds).size).toBe(allIds.length)
      })
    })
  })

  describe('process', () => {
    it('tiene exactamente 4 pasos', () => {
      expect(LANDING_CONTENT.process.steps).toHaveLength(4)
    })

    it('los pasos están numerados correlativamente del 1 al 4', () => {
      LANDING_CONTENT.process.steps.forEach((step, i) => {
        expect(step.step).toBe(i + 1)
      })
    })

    it('cada paso tiene title y description', () => {
      LANDING_CONTENT.process.steps.forEach((step) => {
        expect(step.title).toBeTruthy()
        expect(step.description).toBeTruthy()
      })
    })
  })

  describe('benefits', () => {
    it('tiene al menos un beneficio', () => {
      expect(LANDING_CONTENT.benefits.items.length).toBeGreaterThan(0)
    })

    it('cada beneficio tiene id, metric, label y description', () => {
      LANDING_CONTENT.benefits.items.forEach((item) => {
        expect(item.id).toBeTruthy()
        expect(item.metric).toBeTruthy()
        expect(item.label).toBeTruthy()
        expect(item.description).toBeTruthy()
      })
    })

    it('los ids de los beneficios son únicos', () => {
      const ids = LANDING_CONTENT.benefits.items.map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('finalCTA', () => {
    it('tiene todos los campos requeridos', () => {
      const { title, subtitle, primaryCTA, note, contact } = LANDING_CONTENT.finalCTA
      expect(title).toBeTruthy()
      expect(subtitle).toBeTruthy()
      expect(primaryCTA).toBeTruthy()
      expect(note).toBeTruthy()
      expect(contact).toBeTruthy()
    })

    it('el email de contacto del CTA usa dominio serubix.com', () => {
      expect(LANDING_CONTENT.finalCTA.contact).toContain('@serubix.com')
    })

    it('el email del CTA tiene formato válido', () => {
      expect(LANDING_CONTENT.finalCTA.contact).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })
  })

  describe('footer', () => {
    it('el brand del footer es Serubix', () => {
      expect(LANDING_CONTENT.footer.brand).toBe('Serubix')
    })

    it('el email de contacto usa dominio serubix.com', () => {
      expect(LANDING_CONTENT.footer.contact).toContain('@serubix.com')
    })

    it('el email de contacto tiene formato válido', () => {
      expect(LANDING_CONTENT.footer.contact).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    it('el copyright contiene el año actual', () => {
      expect(LANDING_CONTENT.footer.copyright).toContain(new Date().getFullYear().toString())
    })

    it('el copyright contiene Serubix', () => {
      expect(LANDING_CONTENT.footer.copyright).toContain('Serubix')
    })

    it('no hay referencias a AutomatizaIA en ningún campo del footer', () => {
      const { brand, tagline, contact, copyright } = LANDING_CONTENT.footer
      ;[brand, tagline, contact, copyright].forEach((field) => {
        expect(field).not.toContain('AutomatizaIA')
      })
    })

    it('tiene enlaces de navegación con href válido', () => {
      expect(LANDING_CONTENT.footer.links.length).toBeGreaterThan(0)
      LANDING_CONTENT.footer.links.forEach((link) => {
        expect(link.label).toBeTruthy()
        expect(link.href).toMatch(/^[#/]/)
      })
    })
  })
})
