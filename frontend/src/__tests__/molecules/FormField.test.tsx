import { render, screen } from '@testing-library/react'
import { FormField } from '@/components/molecules/FormField'

describe('FormField', () => {
  it('renderiza o label', () => {
    render(<FormField label="E-mail"><input /></FormField>)
    expect(screen.getByText('E-mail')).toBeInTheDocument()
  })

  it('exibe "Opcional" quando optional=true', () => {
    render(<FormField label="Descrição" optional><input /></FormField>)
    expect(screen.getByText('Opcional')).toBeInTheDocument()
  })

  it('não exibe "Opcional" quando optional não é passado', () => {
    render(<FormField label="Nome"><input /></FormField>)
    expect(screen.queryByText('Opcional')).not.toBeInTheDocument()
  })

  it('renderiza o slot children (input)', () => {
    render(
      <FormField label="Senha">
        <input placeholder="Digite sua senha" />
      </FormField>
    )
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
  })

  it('renderiza o prefixIcon quando fornecido', () => {
    render(
      <FormField label="Campo" prefixIcon={<span data-testid="prefix-icon">@</span>}>
        <input />
      </FormField>
    )
    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
  })
})
