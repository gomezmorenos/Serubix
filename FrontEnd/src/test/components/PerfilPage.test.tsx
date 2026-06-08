import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import PerfilPage from '@/app/(dashboard)/perfil/page'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: '1', name: 'Test User', email: 'test@serubix.com', image: null },
  }),
}))

vi.mock('@/components/dashboard/ProfileForm', () => ({
  ProfileForm: ({ name, email }: { name: string; email: string }) => (
    <div data-testid="profile-form" data-name={name} data-email={email} />
  ),
}))

describe('PerfilPage', () => {
  it('renderiza el título de la página', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Mi perfil', level: 1 })).toBeInTheDocument()
  })

  it('muestra el nombre del usuario', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('muestra el email del usuario', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getAllByText('test@serubix.com').length).toBeGreaterThan(0)
  })

  it('muestra la inicial del usuario en el avatar', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('muestra el badge de plan Free', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByText('Plan Free')).toBeInTheDocument()
  })

  it('renderiza la sección de información personal', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Información personal', level: 2 })).toBeInTheDocument()
  })

  it('renderiza la sección de seguridad', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Seguridad', level: 2 })).toBeInTheDocument()
  })

  it('renderiza la zona de peligro', async () => {
    const element = await PerfilPage()
    render(element)
    expect(screen.getByRole('heading', { name: 'Zona de peligro', level: 2 })).toBeInTheDocument()
  })

  it('pasa el nombre y email correctos al ProfileForm', async () => {
    const element = await PerfilPage()
    render(element)
    const form = screen.getByTestId('profile-form')
    expect(form).toHaveAttribute('data-name', 'Test User')
    expect(form).toHaveAttribute('data-email', 'test@serubix.com')
  })
})
