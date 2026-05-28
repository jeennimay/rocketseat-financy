import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/atoms/Badge'

describe('Badge', () => {
  it('renderiza o nome', () => {
    render(<Badge name="Alimentação" />)
    expect(screen.getByText('Alimentação')).toBeInTheDocument()
  })

  it('aplica cor de texto quando color é fornecida', () => {
    render(<Badge name="Transporte" color="#2563EB" />)
    const el = screen.getByText('Transporte')
    expect(el).toHaveStyle({ color: '#2563EB' })
  })

  it('usa cor padrão quando color não é fornecida', () => {
    render(<Badge name="Sem cor" />)
    const el = screen.getByText('Sem cor')
    expect(el).toHaveStyle({ color: '#374151' })
  })

  it('aplica background com transparência baseado na cor', () => {
    render(<Badge name="Saúde" color="#DB2777" />)
    const el = screen.getByText('Saúde')
    expect(el).toHaveStyle({ backgroundColor: '#DB277720' })
  })
})
