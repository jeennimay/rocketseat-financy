import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CategoryModel } from '../models/category.model'

export class CategoryService {
  async list(userId: string): Promise<CategoryModel[]> {
    return prismaClient.category.findMany({ where: { userId } })
  }

  async getById(id: string, userId: string): Promise<CategoryModel> {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) throw new Error('Categoria não encontrada!')
    return category
  }

  async create(data: CreateCategoryInput, userId: string): Promise<CategoryModel> {
    return prismaClient.category.create({
      data: { ...data, userId },
    })
  }

  async update(id: string, data: UpdateCategoryInput, userId: string): Promise<CategoryModel> {
    await this.getById(id, userId)
    return prismaClient.category.update({
      where: { id },
      data,
    })
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.getById(id, userId)
    await prismaClient.category.delete({ where: { id } })
    return true
  }
}
