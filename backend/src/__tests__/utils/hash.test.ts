import { hashPassword, comparePassword } from '../../utils/hash'

describe('hashPassword', () => {
  it('gera um hash diferente da senha original', async () => {
    const hash = await hashPassword('senha123')
    expect(hash).not.toBe('senha123')
  })

  it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
    const h1 = await hashPassword('senha123')
    const h2 = await hashPassword('senha123')
    expect(h1).not.toBe(h2)
  })

  it('gera string não vazia', async () => {
    const hash = await hashPassword('qualquer')
    expect(hash.length).toBeGreaterThan(0)
  })
})

describe('comparePassword', () => {
  it('retorna true para a senha correta', async () => {
    const hash = await hashPassword('senha123')
    expect(await comparePassword('senha123', hash)).toBe(true)
  })

  it('retorna false para senha incorreta', async () => {
    const hash = await hashPassword('senha123')
    expect(await comparePassword('senhaerrada', hash)).toBe(false)
  })

  it('retorna false para string vazia', async () => {
    const hash = await hashPassword('senha123')
    expect(await comparePassword('', hash)).toBe(false)
  })
})
