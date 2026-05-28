import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import { GraphqlContext } from '../graphql/context'
import { IsAuth } from '../middlewares/auth.middleware'

@Resolver()
export class CategoryResolver {
  private service = new CategoryService()

  @Query(() => [CategoryModel])
  @UseMiddleware(IsAuth)
  async listCategories(@Ctx() ctx: GraphqlContext): Promise<CategoryModel[]> {
    return this.service.list(ctx.user!)
  }

  @Query(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async getCategory(
    @Arg('id') id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.service.getById(id, ctx.user!)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async createCategory(
    @Arg('data') data: CreateCategoryInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.service.create(data, ctx.user!)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async updateCategory(
    @Arg('id') id: string,
    @Arg('data') data: UpdateCategoryInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.service.update(id, data, ctx.user!)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteCategory(
    @Arg('id') id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<boolean> {
    return this.service.delete(id, ctx.user!)
  }
}
