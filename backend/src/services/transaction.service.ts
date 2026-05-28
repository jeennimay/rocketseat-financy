import { TransactionRepository } from '../repositories/transaction.repository'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input'
import { TransactionModel } from '../models/transaction.model'
import { NotFoundError } from '../errors/NotFoundError'

export class TransactionService {
  constructor(private repo = new TransactionRepository()) {}

  list(userId: string): Promise<TransactionModel[]> {
    return this.repo.findAll(userId) as unknown as Promise<TransactionModel[]>
  }

  async getById(id: string, userId: string): Promise<TransactionModel> {
    const transaction = await this.repo.findOne(id, userId)
    if (!transaction) throw new NotFoundError('Transação')
    return transaction as unknown as TransactionModel
  }

  create(data: CreateTransactionInput, userId: string): Promise<TransactionModel> {
    return this.repo.create({ ...data, userId }) as unknown as Promise<TransactionModel>
  }

  async update(id: string, data: UpdateTransactionInput, userId: string): Promise<TransactionModel> {
    await this.getById(id, userId)
    return this.repo.update(id, data) as unknown as Promise<TransactionModel>
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.getById(id, userId)
    await this.repo.delete(id)
    return true
  }
}
