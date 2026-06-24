import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans', className: 'mock-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono', className: 'mock-geist-mono' }),
}))

vi.mock('@/components/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/components/landing/CookieBanner', () => ({
  CookieBanner: () => null,
}))

import RootLayout from '@/app/layout'

describe('RootLayout', () => {
  it('renderiza el contenido hijo', () => {
    render(<RootLayout><p>contenido</p></RootLayout>)
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('el body tiene la clase antialiased', () => {
    render(<RootLayout><span>test</span></RootLayout>)
    const body = document.querySelector('body')
    expect(body?.className).toContain('antialiased')
  })

  it('el body incluye las variables de las fuentes', () => {
    render(<RootLayout><span>test</span></RootLayout>)
    const body = document.querySelector('body')
    expect(body?.className).toContain('--font-geist-sans')
    expect(body?.className).toContain('--font-geist-mono')
  })
})
