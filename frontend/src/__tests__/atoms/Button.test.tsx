import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/atoms/Button'

describe('Button', () => {
  it('renderiza o texto filho', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('chama onClick ao ser clicado', async () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando disabled', async () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick} disabled>Inativo</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('exibe "Carregando..." quando loading=true', () => {
    render(<Button loading>Salvar</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Carregando...')
  })

  it('variante outline tem classe de borda', () => {
    render(<Button variant="outline">Cancelar</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('variante primary tem fundo verde', () => {
    render(<Button variant="primary">Confirmar</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-green-700')
  })
})
