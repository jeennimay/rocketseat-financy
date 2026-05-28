import { UserRepository } from '../repositories/user.repository'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { UserModel } from '../models/user.model'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import { NotFoundError } from '../errors/NotFoundError'
import { ConflictError } from '../errors/ConflictError'
import { UnauthorizedError } from '../errors/UnauthorizedError'

export class AuthService {
  constructor(private userRepo = new UserRepository()) {}

  async login(data: LoginInput) {
    const user = await this.userRepo.findByEmail(data.email)
    if (!user) throw new NotFoundError('Usuário')

    const passwordMatch = await comparePassword(data.password, user.password)
    if (!passwordMatch) throw new UnauthorizedError('Senha inválida')

    return this.generateTokens(user)
  }

  async register(data: RegisterInput) {
    const existing = await this.userRepo.findByEmail(data.email)
    if (existing) throw new ConflictError('E-mail já cadastrado!')

    const password = await hashPassword(data.password)
    const user = await this.userRepo.create({ name: data.name, email: data.email, password })

    return this.generateTokens(user)
  }

  async me(userId: string): Promise<UserModel> {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError('Usuário')
    return user
  }

  private generateTokens(user: UserModel) {
    const token        = signJwt({ id: user.id, email: user.email }, '1d')
    const refreshToken = signJwt({ id: user.id, email: user.email }, '7d')
    return { token, refreshToken, user }
  }
}
