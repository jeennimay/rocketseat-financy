import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'
import { ConflictError } from '../../errors/ConflictError'
import { UnauthorizedError } from '../../errors/UnauthorizedError'

describe('AppError', () => {
  it('armazena mensagem e statusCode', () => {
    const err = new AppError('Erro genérico', 400)
    expect(err.message).toBe('Erro genérico')
    expect(err.statusCode).toBe(400)
    expect(err.isOperational).toBe(true)
  })

  it('usa statusCode 400 por padrão', () => {
    const err = new AppError('Sem código')
    expect(err.statusCode).toBe(400)
  })

  it('é instância de Error', () => {
    expect(new AppError('x')).toBeInstanceOf(Error)
  })
})

describe('NotFoundError', () => {
  it('tem statusCode 404', () => {
    const err = new NotFoundError('Categoria')
    expect(err.statusCode).toBe(404)
  })

  it('inclui o nome do recurso na mensagem', () => {
    const err = new NotFoundError('Transação')
    expect(err.message).toContain('Transação')
  })

  it('é instância de AppError', () => {
    expect(new NotFoundError('X')).toBeInstanceOf(AppError)
  })
})

describe('ConflictError', () => {
  it('tem statusCode 409', () => {
    expect(new ConflictError('E-mail já cadastrado').statusCode).toBe(409)
  })
})

describe('UnauthorizedError', () => {
  it('tem statusCode 401', () => {
    expect(new UnauthorizedError().statusCode).toBe(401)
  })

  it('usa mensagem padrão quando não fornecida', () => {
    expect(new UnauthorizedError().message).toBe('Não autorizado')
  })

  it('usa mensagem customizada quando fornecida', () => {
    expect(new UnauthorizedError('Senha inválida').message).toBe('Senha inválida')
  })
})
