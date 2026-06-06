import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { problem } = LANDING_CONTENT

describe('ProblemSection', () => {
  it('renderiza el label de sección', () => {
    render(<ProblemSection {...problem} />)
    expect(screen.getByText(problem.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<ProblemSection {...problem} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(problem.title)
  })

  it('renderiza el subtítulo', () => {
    render(<ProblemSection {...problem} />)
    expect(screen.getByText(problem.subtitle)).toBeInTheDocument()
  })

  it('renderiza una tarjeta por cada problema', () => {
    render(<ProblemSection {...problem} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(problem.cards.length)
  })

  it('renderiza el título de cada problema', () => {
    render(<ProblemSection {...problem} />)
    problem.cards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument()
    })
  })

  it('renderiza la descripción de cada problema', () => {
    render(<ProblemSection {...problem} />)
    problem.cards.forEach((card) => {
      expect(screen.getByText(card.description)).toBeInTheDocument()
    })
  })

  it('la lista tiene aria-label accesible', () => {
    render(<ProblemSection {...problem} />)
    expect(screen.getByRole('list', { name: 'Problemas que resolvemos' })).toBeInTheDocument()
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<ProblemSection {...problem} />)
    expect(document.getElementById('problema')).toBeInTheDocument()
  })
})
