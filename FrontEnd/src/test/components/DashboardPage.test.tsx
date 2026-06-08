import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import DashboardPage from '@/app/(dashboard)/dashboard/page'
import { auth } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: '1', name: 'Test User', email: 'test@serubix.com', image: null },
  }),
}))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

describe('DashboardPage', () => {
  it('muestra saludo con el primer nombre del usuario', async () => {
    const element = await DashboardPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Hola, Test', level: 1 })).toBeInTheDocument()
  })

  it('renderiza la tarjeta de plan actual', async () => {
    const element = await DashboardPage()
    render(element)
    expect(screen.getByText('Plan actual')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renderiza la tarjeta de herramientas disponibles', async () => {
    const element = await DashboardPage()
    render(element)
    expect(screen.getByText('Herramientas disponibles')).toBeInTheDocument()
  })

  it('renderiza la sección de acceso rápido', async () => {
    const element = await DashboardPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Acceso rápido', level: 2 })).toBeInTheDocument()
  })

  it('renderiza las tres herramientas en el acceso rápido', async () => {
    const element = await DashboardPage()
    render(element)
    expect(screen.getByText('Text to Speech')).toBeInTheDocument()
    expect(screen.getByText('YouTube Shorts')).toBeInTheDocument()
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
  })

  it('Text to Speech tiene enlace activo a herramientas', async () => {
    const element = await DashboardPage()
    render(element)
    const link = screen.getByRole('link', { name: /Ir a la herramienta/i })
    expect(link).toHaveAttribute('href', '/herramientas')
  })

  it('muestra "Usuario" cuando el nombre de sesión es nulo', async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: '1', name: null, email: 'test@test.com', image: null },
      expires: '',
    })
    const element = await DashboardPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Hola, Usuario', level: 1 })).toBeInTheDocument()
  })
})
