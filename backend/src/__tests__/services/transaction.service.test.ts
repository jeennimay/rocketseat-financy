import { TransactionService } from '../../services/transaction.service'
import { NotFoundError } from '../../errors/NotFoundError'

const mockRepo = {
  findAll:  jest.fn(),
  findOne:  jest.fn(),
  create:   jest.fn(),
  update:   jest.fn(),
  delete:   jest.fn(),
}

const fakeTransaction = {
  id:          'tx-1',
  description: 'Almoço',
  amount:      89.50,
  type:        'expense' as const,
  date:        new Date('2025-11-30'),
  userId:      'user-1',
  categoryId:  null,
  category:    null,
  createdAt:   new Date(),
  updatedAt:   new Date(),
}

describe('TransactionService', () => {
  let service: TransactionService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new TransactionService(mockRepo as any)
  })

  // ── list ───────────────────────────────────────────────────────────────
  describe('list', () => {
    it('retorna todas as transações do usuário', async () => {
      mockRepo.findAll.mockResolvedValue([fakeTransaction])
      const result = await service.list('user-1')
      expect(result).toEqual([fakeTransaction])
      expect(mockRepo.findAll).toHaveBeenCalledWith('user-1')
    })
  })

  // ── getById ────────────────────────────────────────────────────────────
  describe('getById', () => {
    it('lança NotFoundError quando transação não existe', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.getById('tx-x', 'user-1')).rejects.toThrow(NotFoundError)
    })

    it('retorna a transação quando encontrada', async () => {
      mockRepo.findOne.mockResolvedValue(fakeTransaction)
      const result = await service.getById('tx-1', 'user-1')
      expect(result).toEqual(fakeTransaction)
    })

    it('garante isolamento por usuário ao buscar', async () => {
      mockRepo.findOne.mockResolvedValue(fakeTransaction)
      await service.getById('tx-1', 'user-1')
      expect(mockRepo.findOne).toHaveBeenCalledWith('tx-1', 'user-1')
    })
  })

  // ── create ─────────────────────────────────────────────────────────────
  describe('create', () => {
    it('chama repo.create com os dados e userId', async () => {
      mockRepo.create.mockResolvedValue(fakeTransaction)
      const input = {
        description: 'Almoço',
        amount: 89.50,
        type: 'expense' as const,
        date: new Date('2025-11-30'),
      }
      await service.create(input, 'user-1')
      expect(mockRepo.create).toHaveBeenCalledWith({ ...input, userId: 'user-1' })
    })
  })

  // ── update ─────────────────────────────────────────────────────────────
  describe('update', () => {
    it('lança NotFoundError quando transação não pertence ao usuário', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.update('tx-1', { amount: 100 }, 'user-1'))
        .rejects.toThrow(NotFoundError)
    })

    it('verifica propriedade antes de atualizar', async () => {
      const updated = { ...fakeTransaction, amount: 150 }
      mockRepo.findOne.mockResolvedValue(fakeTransaction)
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update('tx-1', { amount: 150 }, 'user-1')
      expect(result.amount).toBe(150)
      expect(mockRepo.update).toHaveBeenCalledWith('tx-1', { amount: 150 })
    })
  })

  // ── delete ─────────────────────────────────────────────────────────────
  describe('delete', () => {
    it('lança NotFoundError quando transação não pertence ao usuário', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.delete('tx-1', 'user-1')).rejects.toThrow(NotFoundError)
    })

    it('deleta e retorna true', async () => {
      mockRepo.findOne.mockResolvedValue(fakeTransaction)
      mockRepo.delete.mockResolvedValue(undefined)
      const result = await service.delete('tx-1', 'user-1')
      expect(result).toBe(true)
      expect(mockRepo.delete).toHaveBeenCalledWith('tx-1')
    })
  })
})
