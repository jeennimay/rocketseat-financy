import { CategoryService } from '../../services/category.service'
import { NotFoundError } from '../../errors/NotFoundError'

const mockRepo = {
  findAll:  jest.fn(),
  findOne:  jest.fn(),
  create:   jest.fn(),
  update:   jest.fn(),
  delete:   jest.fn(),
}

const fakeCategory = {
  id:          'cat-1',
  name:        'Alimentação',
  color:       '#1F6F43',
  icon:        'Utensils',
  description: 'Refeições',
  userId:      'user-1',
  createdAt:   new Date(),
  updatedAt:   new Date(),
}

describe('CategoryService', () => {
  let service: CategoryService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new CategoryService(mockRepo as any)
  })

  // ── list ───────────────────────────────────────────────────────────────
  describe('list', () => {
    it('retorna todas as categorias do usuário', async () => {
      mockRepo.findAll.mockResolvedValue([fakeCategory])
      const result = await service.list('user-1')
      expect(result).toEqual([fakeCategory])
      expect(mockRepo.findAll).toHaveBeenCalledWith('user-1')
    })
  })

  // ── getById ────────────────────────────────────────────────────────────
  describe('getById', () => {
    it('lança NotFoundError quando categoria não existe', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.getById('id-x', 'user-1')).rejects.toThrow(NotFoundError)
    })

    it('retorna a categoria quando encontrada', async () => {
      mockRepo.findOne.mockResolvedValue(fakeCategory)
      const result = await service.getById('cat-1', 'user-1')
      expect(result).toEqual(fakeCategory)
    })

    it('repassa userId para o repositório (isolamento entre usuários)', async () => {
      mockRepo.findOne.mockResolvedValue(fakeCategory)
      await service.getById('cat-1', 'user-1')
      expect(mockRepo.findOne).toHaveBeenCalledWith('cat-1', 'user-1')
    })
  })

  // ── create ─────────────────────────────────────────────────────────────
  describe('create', () => {
    it('chama repo.create com os dados e userId', async () => {
      mockRepo.create.mockResolvedValue(fakeCategory)
      const input = { name: 'Alimentação', color: '#1F6F43' }
      await service.create(input, 'user-1')
      expect(mockRepo.create).toHaveBeenCalledWith({ ...input, userId: 'user-1' })
    })
  })

  // ── update ─────────────────────────────────────────────────────────────
  describe('update', () => {
    it('lança NotFoundError quando categoria não pertence ao usuário', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.update('cat-1', { name: 'X' }, 'user-1'))
        .rejects.toThrow(NotFoundError)
    })

    it('atualiza e retorna a categoria', async () => {
      const updated = { ...fakeCategory, name: 'Novo Nome' }
      mockRepo.findOne.mockResolvedValue(fakeCategory)
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update('cat-1', { name: 'Novo Nome' }, 'user-1')
      expect(result.name).toBe('Novo Nome')
    })
  })

  // ── delete ─────────────────────────────────────────────────────────────
  describe('delete', () => {
    it('lança NotFoundError quando categoria não pertence ao usuário', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(service.delete('cat-1', 'user-1')).rejects.toThrow(NotFoundError)
    })

    it('deleta e retorna true', async () => {
      mockRepo.findOne.mockResolvedValue(fakeCategory)
      mockRepo.delete.mockResolvedValue(undefined)
      const result = await service.delete('cat-1', 'user-1')
      expect(result).toBe(true)
      expect(mockRepo.delete).toHaveBeenCalledWith('cat-1')
    })
  })
})
