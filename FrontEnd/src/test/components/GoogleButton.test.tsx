import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GoogleButton } from '@/components/auth/GoogleButton'

const mockSignIn = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  signIn: mockSignIn,
}))

describe('GoogleButton', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
  })

  it('renderiza el texto por defecto', () => {
    render(<GoogleButton />)
    expect(screen.getByRole('button', { name: /Continuar con Google/i })).toBeInTheDocument()
  })

  it('renderiza texto personalizado cuando se proporciona label', () => {
    render(<GoogleButton label="Registrarse con Google" />)
    expect(screen.getByRole('button', { name: /Registrarse con Google/i })).toBeInTheDocument()
  })

  it('llama a signIn con google al hacer click', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue(undefined)
    render(<GoogleButton />)
    await user.click(screen.getByRole('button'))
    expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' })
  })

  it('usa el callbackUrl proporcionado como prop', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue(undefined)
    render(<GoogleButton callbackUrl="/perfil" />)
    await user.click(screen.getByRole('button'))
    expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/perfil' })
  })

  it('muestra estado de carga y deshabilita el botón tras el click', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    render(<GoogleButton />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Redirigiendo...')).toBeInTheDocument()
  })
})
