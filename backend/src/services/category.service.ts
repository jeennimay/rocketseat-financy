import { CategoryRepository } from '../repositories/category.repository'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CategoryModel } from '../models/category.model'
import { NotFoundError } from '../errors/NotFoundError'

export class CategoryService {
  constructor(private repo = new CategoryRepository()) {}

  list(userId: string): Promise<CategoryModel[]> {
    return this.repo.findAll(userId)
  }

  async getById(id: string, userId: string): Promise<CategoryModel> {
    const category = await this.repo.findOne(id, userId)
    if (!category) throw new NotFoundError('Categoria')
    return category
  }

  create(data: CreateCategoryInput, userId: string): Promise<CategoryModel> {
    return this.repo.create({ ...data, userId })
  }

  async update(id: string, data: UpdateCategoryInput, userId: string): Promise<CategoryModel> {
    await this.getById(id, userId)
    return this.repo.update(id, data)
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.getById(id, userId)
    await this.repo.delete(id)
    return true
  }
}
