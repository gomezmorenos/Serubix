import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SolutionSection } from '@/components/landing/SolutionSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { solution } = LANDING_CONTENT

describe('SolutionSection', () => {
  it('renderiza el label de sección', () => {
    render(<SolutionSection {...solution} />)
    expect(screen.getByText(solution.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<SolutionSection {...solution} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(solution.title)
  })

  it('renderiza el subtítulo', () => {
    render(<SolutionSection {...solution} />)
    expect(screen.getByText(solution.subtitle)).toBeInTheDocument()
  })

  it('renderiza todos los puntos de solución', () => {
    render(<SolutionSection {...solution} />)
    solution.points.forEach((point) => {
      expect(screen.getByText(point)).toBeInTheDocument()
    })
  })

  it('los puntos están en una lista accesible', () => {
    render(<SolutionSection {...solution} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renderiza el diagrama de flujo con rol img', () => {
    render(<SolutionSection {...solution} />)
    expect(
      screen.getByRole('img', { name: 'Ilustración del flujo de automatización' }),
    ).toBeInTheDocument()
  })

  it('renderiza los 3 pasos del flujo visual', () => {
    render(<SolutionSection {...solution} />)
    expect(screen.getByText('Lead capturado')).toBeInTheDocument()
    expect(screen.getByText('Asistente IA activado')).toBeInTheDocument()
    expect(screen.getByText('Seguimiento automatizado')).toBeInTheDocument()
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<SolutionSection {...solution} />)
    expect(document.getElementById('solucion')).toBeInTheDocument()
  })
})
