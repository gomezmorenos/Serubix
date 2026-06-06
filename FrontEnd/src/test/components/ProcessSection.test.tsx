import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { LANDING_CONTENT } from '@/features/landing/landing-content'

const { process } = LANDING_CONTENT

describe('ProcessSection', () => {
  it('renderiza el label de sección', () => {
    render(<ProcessSection {...process} />)
    expect(screen.getByText(process.label)).toBeInTheDocument()
  })

  it('renderiza el título en un h2', () => {
    render(<ProcessSection {...process} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(process.title)
  })

  it('renderiza el subtítulo', () => {
    render(<ProcessSection {...process} />)
    expect(screen.getByText(process.subtitle)).toBeInTheDocument()
  })

  it('renderiza un item por cada paso del proceso', () => {
    render(<ProcessSection {...process} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(process.steps.length)
  })

  it('renderiza el título de cada paso', () => {
    render(<ProcessSection {...process} />)
    process.steps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument()
    })
  })

  it('renderiza la descripción de cada paso', () => {
    render(<ProcessSection {...process} />)
    process.steps.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument()
    })
  })

  it('cada paso tiene su número accesible', () => {
    render(<ProcessSection {...process} />)
    process.steps.forEach((step) => {
      expect(screen.getByLabelText(`Paso ${step.step}`)).toBeInTheDocument()
    })
  })

  it('los pasos están en una lista con aria-label', () => {
    render(<ProcessSection {...process} />)
    expect(screen.getByRole('list', { name: 'Pasos del proceso' })).toBeInTheDocument()
  })

  it('tiene el id correcto para navegación por ancla', () => {
    render(<ProcessSection {...process} />)
    expect(document.getElementById('como-funciona')).toBeInTheDocument()
  })
})
