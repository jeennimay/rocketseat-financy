import { AuthService } from '../../services/auth.service'
import { NotFoundError } from '../../errors/NotFoundError'
import { ConflictError } from '../../errors/ConflictError'
import { UnauthorizedError } from '../../errors/UnauthorizedError'

// Mocks dos módulos de utilitários
jest.mock('../../utils/hash', () => ({
  hashPassword:    jest.fn().mockResolvedValue('hashed-password'),
  comparePassword: jest.fn(),
}))

jest.mock('../../utils/jwt', () => ({
  signJwt: jest.fn().mockReturnValue('mocked-jwt-token'),
}))

import { comparePassword, hashPassword } from '../../utils/hash'

const mockUserRepo = {
  findByEmail: jest.fn(),
  findById:    jest.fn(),
  create:      jest.fn(),
}

const fakeUser = {
  id:        'user-1',
  name:      'Usuário Teste',
  email:     'teste@financy.com',
  password:  'hashed-password',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AuthService(mockUserRepo as any)
  })

  // ── login ──────────────────────────────────────────────────────────────
  describe('login', () => {
    it('lança NotFoundError quando usuário não existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null)
      await expect(service.login({ email: 'x@x.com', password: '123' }))
        .rejects.toThrow(NotFoundError)
    })

    it('lança UnauthorizedError quando senha está incorreta', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(fakeUser);
      (comparePassword as jest.Mock).mockResolvedValue(false)
      await expect(service.login({ email: fakeUser.email, password: 'errada' }))
        .rejects.toThrow(UnauthorizedError)
    })

    it('retorna token, refreshToken e user no login bem-sucedido', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(fakeUser);
      (comparePassword as jest.Mock).mockResolvedValue(true)
      const result = await service.login({ email: fakeUser.email, password: 'certa' })
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe(fakeUser.email)
    })
  })

  // ── register ───────────────────────────────────────────────────────────
  describe('register', () => {
    it('lança ConflictError quando e-mail já existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(fakeUser)
      await expect(service.register({ name: 'X', email: fakeUser.email, password: '123' }))
        .rejects.toThrow(ConflictError)
    })

    it('cria usuário com senha hasheada', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null)
      mockUserRepo.create.mockResolvedValue(fakeUser)
      await service.register({ name: 'Novo', email: 'novo@test.com', password: 'senha123' })
      expect(hashPassword).toHaveBeenCalledWith('senha123')
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed-password' })
      )
    })

    it('retorna token, refreshToken e user após cadastro', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null)
      mockUserRepo.create.mockResolvedValue(fakeUser)
      const result = await service.register({ name: 'Novo', email: 'novo@test.com', password: 'senha123' })
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user).toEqual(fakeUser)
    })
  })

  // ── me ─────────────────────────────────────────────────────────────────
  describe('me', () => {
    it('lança NotFoundError quando userId não existe', async () => {
      mockUserRepo.findById.mockResolvedValue(null)
      await expect(service.me('id-inexistente')).rejects.toThrow(NotFoundError)
    })

    it('retorna o usuário quando encontrado', async () => {
      mockUserRepo.findById.mockResolvedValue(fakeUser)
      const result = await service.me(fakeUser.id)
      expect(result).toEqual(fakeUser)
    })
  })
})
