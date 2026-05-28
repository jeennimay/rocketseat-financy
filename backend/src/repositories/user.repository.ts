import { prismaClient } from '../../prisma/prisma'

export class UserRepository {
  findByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } })
  }

  findById(id: string) {
    return prismaClient.user.findUnique({ where: { id } })
  }

  create(data: { name: string; email: string; password: string }) {
    return prismaClient.user.create({ data })
  }
}
