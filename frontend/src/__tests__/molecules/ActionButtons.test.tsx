import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionButtons } from '@/components/molecules/ActionButtons'

describe('ActionButtons', () => {
  it('renderiza o botão de excluir quando onDelete é fornecido', () => {
    render(<ActionButtons onDelete={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
  })

  it('renderiza o botão de editar quando onEdit é fornecido', () => {
    render(<ActionButtons onEdit={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })

  it('renderiza os dois botões quando ambas as props são fornecidas', () => {
    render(<ActionButtons onDelete={jest.fn()} onEdit={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })

  it('não renderiza nenhum botão quando nenhuma prop é fornecida', () => {
    render(<ActionButtons />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('chama onDelete ao clicar em Excluir', async () => {
    const onDelete = jest.fn()
    render(<ActionButtons onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('chama onEdit ao clicar em Editar', async () => {
    const onEdit = jest.fn()
    render(<ActionButtons onEdit={onEdit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('os dois callbacks são independentes', async () => {
    const onDelete = jest.fn()
    const onEdit   = jest.fn()
    render(<ActionButtons onDelete={onDelete} onEdit={onEdit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onEdit).not.toHaveBeenCalled()
  })
})
