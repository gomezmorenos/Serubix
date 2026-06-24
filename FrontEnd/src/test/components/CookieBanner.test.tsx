import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CookieBanner } from '@/components/landing/CookieBanner'

const STORAGE_KEY = 'serubix_cookies_consent'

// jsdom en este entorno no implementa localStorage completo — lo mockeamos
let mockStore: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string): string | null => mockStore[key] ?? null,
  setItem: (key: string, value: string) => { mockStore[key] = value },
  removeItem: (key: string) => { delete mockStore[key] },
  clear: () => { mockStore = {} },
})

describe('CookieBanner', () => {
  beforeEach(() => { mockStore = {} })

  it('se muestra cuando no hay consentimiento previo en localStorage', () => {
    render(<CookieBanner />)
    expect(screen.getByRole('dialog', { name: 'Aviso de cookies' })).toBeInTheDocument()
  })

  it('no se muestra si el usuario ya aceptó las cookies', () => {
    mockStore[STORAGE_KEY] = 'accepted'
    render(<CookieBanner />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('no se muestra si el usuario ya rechazó las cookies', () => {
    mockStore[STORAGE_KEY] = 'rejected'
    render(<CookieBanner />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('al aceptar guarda "accepted" en localStorage', () => {
    render(<CookieBanner />)
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar todo' }))
    expect(mockStore[STORAGE_KEY]).toBe('accepted')
  })

  it('al aceptar oculta el banner', () => {
    render(<CookieBanner />)
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar todo' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('al rechazar guarda "rejected" en localStorage', () => {
    render(<CookieBanner />)
    fireEvent.click(screen.getByRole('button', { name: 'Solo esenciales' }))
    expect(mockStore[STORAGE_KEY]).toBe('rejected')
  })

  it('al rechazar oculta el banner', () => {
    render(<CookieBanner />)
    fireEvent.click(screen.getByRole('button', { name: 'Solo esenciales' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('contiene un enlace a la política de cookies', () => {
    render(<CookieBanner />)
    const link = screen.getByRole('link', { name: 'Política de Cookies' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/politica-de-cookies')
  })

  it('el dialog tiene aria-live="polite"', () => {
    render(<CookieBanner />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-live', 'polite')
  })
})
