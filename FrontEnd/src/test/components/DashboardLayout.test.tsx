import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DashboardLayout from '@/app/(dashboard)/layout'

const mockRedirect = vi.hoisted(() =>
  vi.fn().mockImplementation((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  })
)
const mockAuth = vi.hoisted(() => vi.fn())

vi.mock('@/lib/auth', () => ({
  auth: mockAuth,
}))

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}))

vi.mock('@/components/dashboard/Sidebar', () => ({
  Sidebar: () => <nav data-testid="sidebar">Sidebar</nav>,
}))

describe('DashboardLayout', () => {
  beforeEach(() => {
    mockRedirect.mockClear()
    mockAuth.mockResolvedValue({
      user: { id: '1', name: 'Test', email: 'test@test.com', image: null },
    })
  })

  it('renderiza el contenido hijo con sesión válida', async () => {
    const element = await DashboardLayout({ children: <div>contenido</div> })
    render(element)
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('renderiza el Sidebar con sesión válida', async () => {
    const element = await DashboardLayout({ children: <div /> })
    render(element)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('redirige a /login cuando no hay sesión', async () => {
    mockAuth.mockResolvedValueOnce(null)
    await expect(DashboardLayout({ children: <div /> })).rejects.toThrow('REDIRECT:/login')
    expect(mockRedirect).toHaveBeenCalledWith('/login')
  })
})
