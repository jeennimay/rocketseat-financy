import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '@/components/molecules/EmptyState'

describe('EmptyState', () => {
  it('renderiza a mensagem', () => {
    render(<EmptyState icon={<span />} message="Nenhum item encontrado." />)
    expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument()
  })

  it('renderiza o ícone', () => {
    render(<EmptyState icon={<span data-testid="ico">🗂</span>} message="Vazio" />)
    expect(screen.getByTestId('ico')).toBeInTheDocument()
  })

  it('não renderiza botão quando action não é fornecida', () => {
    render(<EmptyState icon={<span />} message="Vazio" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renderiza botão de ação quando action é fornecida', () => {
    render(
      <EmptyState
        icon={<span />}
        message="Vazio"
        action={{ label: 'Criar', onClick: jest.fn() }}
      />
    )
    expect(screen.getByRole('button', { name: /criar/i })).toBeInTheDocument()
  })

  it('chama action.onClick ao clicar no botão', async () => {
    const onClick = jest.fn()
    render(
      <EmptyState
        icon={<span />}
        message="Vazio"
        action={{ label: 'Adicionar', onClick }}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
