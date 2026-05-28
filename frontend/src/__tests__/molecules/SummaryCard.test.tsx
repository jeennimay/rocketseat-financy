import { render, screen } from '@testing-library/react'
import { SummaryCard } from '@/components/molecules/SummaryCard'

describe('SummaryCard', () => {
  it('renderiza o label', () => {
    render(<SummaryCard label="SALDO TOTAL" value="R$ 1.000,00" icon={<span />} />)
    expect(screen.getByText('SALDO TOTAL')).toBeInTheDocument()
  })

  it('renderiza o value numérico', () => {
    render(<SummaryCard label="Total" value={42} icon={<span />} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renderiza o value string', () => {
    render(<SummaryCard label="Categoria" value="Alimentação" icon={<span />} />)
    expect(screen.getByText('Alimentação')).toBeInTheDocument()
  })

  it('renderiza o ícone', () => {
    render(<SummaryCard label="Test" value="0" icon={<span data-testid="icone">💰</span>} />)
    expect(screen.getByTestId('icone')).toBeInTheDocument()
  })

  it('aplica iconBg personalizado', () => {
    const { container } = render(
      <SummaryCard label="Test" value="0" icon={<span />} iconBg="bg-blue-50" />
    )
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument()
  })
})
