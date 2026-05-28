import { signJwt, verifyJwt } from '../../utils/jwt'

const payload = { id: 'user-123', email: 'test@financy.com' }

describe('signJwt', () => {
  it('cria um token JWT com três segmentos', () => {
    const token = signJwt(payload)
    expect(token.split('.')).toHaveLength(3)
  })

  it('cria tokens diferentes em chamadas distintas (iat varia)', () => {
    const t1 = signJwt(payload, '1d')
    const t2 = signJwt(payload, '7d')
    expect(t1).not.toBe(t2)
  })
})

describe('verifyJwt', () => {
  it('retorna o payload original', () => {
    const token  = signJwt(payload)
    const result = verifyJwt(token)
    expect(result.id).toBe(payload.id)
    expect(result.email).toBe(payload.email)
  })

  it('lança erro para token inválido', () => {
    expect(() => verifyJwt('token.invalido.aqui')).toThrow()
  })

  it('lança erro para token adulterado', () => {
    const token    = signJwt(payload)
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(() => verifyJwt(tampered)).toThrow()
  })

  it('lança erro para token expirado', async () => {
    const token = signJwt(payload, '1ms')
    await new Promise((r) => setTimeout(r, 10))
    expect(() => verifyJwt(token)).toThrow()
  })
})
