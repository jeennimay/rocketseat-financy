import { prismaClient } from '../../prisma/prisma'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input'
import { TransactionModel } from '../models/transaction.model'

export class TransactionService {
  async list(userId: string): Promise<TransactionModel[]> {
    return prismaClient.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    }) as unknown as TransactionModel[]
  }

  async getById(id: string, userId: string): Promise<TransactionModel> {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    })
    if (!transaction) throw new Error('Transação não encontrada!')
    return transaction as unknown as TransactionModel
  }

  async create(data: CreateTransactionInput, userId: string): Promise<TransactionModel> {
    return prismaClient.transaction.create({
      data: { ...data, userId },
      include: { category: true },
    }) as unknown as TransactionModel
  }

  async update(id: string, data: UpdateTransactionInput, userId: string): Promise<TransactionModel> {
    await this.getById(id, userId)
    return prismaClient.transaction.update({
      where: { id },
      data,
      include: { category: true },
    }) as unknown as TransactionModel
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.getById(id, userId)
    await prismaClient.transaction.delete({ where: { id } })
    return true
  }
}
