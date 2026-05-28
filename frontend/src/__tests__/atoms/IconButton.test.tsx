import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from '@/components/atoms/IconButton'

describe('IconButton', () => {
  it('renderiza o ícone passado', () => {
    render(<IconButton icon={<span data-testid="icon">X</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('chama onClick ao ser clicado', async () => {
    const onClick = jest.fn()
    render(<IconButton icon={<span>X</span>} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('variante danger aplica hover vermelho', () => {
    render(<IconButton icon={<span>X</span>} variant="danger" />)
    expect(screen.getByRole('button')).toHaveClass('hover:text-red-500')
  })

  it('variante default aplica hover azul', () => {
    render(<IconButton icon={<span>X</span>} variant="default" />)
    expect(screen.getByRole('button')).toHaveClass('hover:text-blue-500')
  })

  it('usa aria-label quando fornecido', () => {
    render(<IconButton icon={<span>X</span>} aria-label="Excluir" />)
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
  })
})
