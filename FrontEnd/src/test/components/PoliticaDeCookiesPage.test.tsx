import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PoliticaDeCookiesPage from '@/app/politica-de-cookies/page'

describe('PoliticaDeCookiesPage', () => {
  it('renderiza el título principal', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByRole('heading', { name: 'Política de Cookies', level: 1 })).toBeInTheDocument()
  })

  it('tiene enlace para volver al inicio', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByRole('link', { name: /Volver al inicio/i })).toHaveAttribute('href', '/')
  })

  it('renderiza las 7 secciones con sus títulos', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByRole('heading', { name: /1\. ¿Qué son las cookies\?/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /2\. ¿Qué cookies utilizamos\?/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /3\. Base legal/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /4\. Cookies de terceros/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /5\. Cómo gestionar/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /6\. Actualizaciones/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /7\. Contacto/i })).toBeInTheDocument()
  })

  it('muestra la tabla con las 4 cookies documentadas', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByText('authjs.session-token')).toBeInTheDocument()
    expect(screen.getByText('authjs.csrf-token')).toBeInTheDocument()
    expect(screen.getByText('authjs.callback-url')).toBeInTheDocument()
    // aparece en la tabla y en el <code> de la sección de gestión
    expect(screen.getAllByText('serubix_cookies_consent')).toHaveLength(2)
  })

  it('la tabla tiene las columnas correctas', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Tipo' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Finalidad' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Duración' })).toBeInTheDocument()
  })

  it('incluye enlace de contacto por email', () => {
    render(<PoliticaDeCookiesPage />)
    const link = screen.getByRole('link', { name: 'hola@serubix.com' })
    expect(link).toHaveAttribute('href', 'mailto:hola@serubix.com')
  })

  it('menciona el RGPD y la LSSI en la sección de base legal', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByText(/RGPD/)).toBeInTheDocument()
    expect(screen.getByText(/LSSI/)).toBeInTheDocument()
  })

  it('menciona los 4 navegadores en la sección de gestión', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByText(/Chrome/)).toBeInTheDocument()
    expect(screen.getByText(/Firefox/)).toBeInTheDocument()
    expect(screen.getByText(/Safari/)).toBeInTheDocument()
    expect(screen.getByText(/Edge/)).toBeInTheDocument()
  })

  it('muestra la fecha de última actualización', () => {
    render(<PoliticaDeCookiesPage />)
    expect(screen.getByText(/Última actualización/i)).toBeInTheDocument()
  })
})
