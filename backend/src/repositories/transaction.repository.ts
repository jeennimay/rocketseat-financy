import { prismaClient } from '../../prisma/prisma'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input'

const WITH_CATEGORY = { include: { category: true } } as const

export class TransactionRepository {
  findAll(userId: string) {
    return prismaClient.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      ...WITH_CATEGORY,
    })
  }

  findOne(id: string, userId: string) {
    return prismaClient.transaction.findFirst({
      where: { id, userId },
      ...WITH_CATEGORY,
    })
  }

  create(data: CreateTransactionInput & { userId: string }) {
    return prismaClient.transaction.create({ data, ...WITH_CATEGORY })
  }

  update(id: string, data: UpdateTransactionInput) {
    return prismaClient.transaction.update({ where: { id }, data, ...WITH_CATEGORY })
  }

  delete(id: string) {
    return prismaClient.transaction.delete({ where: { id } })
  }
}
