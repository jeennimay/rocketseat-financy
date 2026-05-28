import { formatCurrency, formatDate } from '@/utils/format'

describe('formatCurrency', () => {
  it('formata valor positivo em BRL', () => {
    expect(formatCurrency(1234.56)).toMatch('1.234,56')
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toMatch('0,00')
  })

  it('formata valor negativo', () => {
    expect(formatCurrency(-50)).toMatch('50,00')
  })
})

describe('formatDate', () => {
  it('formata data no padrão pt-BR', () => {
    // Usa horário do meio-dia para evitar problemas de fuso horário (UTC-3)
    expect(formatDate('2025-11-30T12:00:00')).toBe('30/11/2025')
  })

  it('aceita objeto Date', () => {
    expect(formatDate(new Date(2025, 0, 5))).toBe('05/01/2025')
  })

  it('aceita opções de formatação', () => {
    const result = formatDate('2025-06-15', { month: 'long', year: 'numeric' })
    expect(result).toMatch('junho')
    expect(result).toMatch('2025')
  })
})
