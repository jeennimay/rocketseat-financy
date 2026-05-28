import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

export class CategoryRepository {
  findAll(userId: string) {
    return prismaClient.category.findMany({ where: { userId } })
  }

  findOne(id: string, userId: string) {
    return prismaClient.category.findFirst({ where: { id, userId } })
  }

  create(data: CreateCategoryInput & { userId: string }) {
    return prismaClient.category.create({ data })
  }

  update(id: string, data: UpdateCategoryInput) {
    return prismaClient.category.update({ where: { id }, data })
  }

  delete(id: string) {
    return prismaClient.category.delete({ where: { id } })
  }
}
