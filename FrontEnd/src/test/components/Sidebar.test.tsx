import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Sidebar } from '@/components/dashboard/Sidebar'

const mockSignOut = vi.hoisted(() => vi.fn())
const mockUsePathname = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  signOut: mockSignOut,
}))

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
}))

const mockUser = {
  name: 'Test User',
  email: 'test@serubix.com',
  image: null,
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockSignOut.mockClear()
    mockUsePathname.mockReturnValue('/dashboard')
  })

  it('renderiza el logo con enlace a la home', () => {
    render(<Sidebar user={mockUser} />)
    const logo = screen.getByRole('link', { name: 'Serubix' })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renderiza los cuatro items de navegación', () => {
    render(<Sidebar user={mockUser} />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Herramientas' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Plan' })).toBeInTheDocument()
  })

  it('marca la ruta activa con aria-current="page"', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(<Sidebar user={mockUser} />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
  })

  it('no marca otras rutas como activas', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(<Sidebar user={mockUser} />)
    expect(screen.getByRole('link', { name: 'Herramientas' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Perfil' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Plan' })).not.toHaveAttribute('aria-current')
  })

  it('marca herramientas como activo cuando la ruta es /herramientas', () => {
    mockUsePathname.mockReturnValue('/herramientas')
    render(<Sidebar user={mockUser} />)
    expect(screen.getByRole('link', { name: 'Herramientas' })).toHaveAttribute('aria-current', 'page')
  })

  it('muestra el nombre del usuario', () => {
    render(<Sidebar user={mockUser} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('muestra el email del usuario', () => {
    render(<Sidebar user={mockUser} />)
    expect(screen.getByText('test@serubix.com')).toBeInTheDocument()
  })

  it('muestra la inicial del nombre en el avatar', () => {
    render(<Sidebar user={mockUser} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('usa la inicial del email cuando no hay nombre', () => {
    render(<Sidebar user={{ ...mockUser, name: null }} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renderiza el botón de cerrar sesión', () => {
    render(<Sidebar user={mockUser} />)
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
  })

  it('llama a signOut con callbackUrl "/" al cerrar sesión', async () => {
    const user = userEvent.setup()
    mockSignOut.mockResolvedValue(undefined)
    render(<Sidebar user={mockUser} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' })
  })
})
