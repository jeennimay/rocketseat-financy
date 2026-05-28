import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input'
import { TransactionModel } from '../models/transaction.model'
import { TransactionService } from '../services/transaction.service'
import { GraphqlContext } from '../graphql/context'
import { IsAuth } from '../middlewares/auth.middleware'

@Resolver()
export class TransactionResolver {
  private service = new TransactionService()

  @Query(() => [TransactionModel])
  @UseMiddleware(IsAuth)
  async listTransactions(@Ctx() ctx: GraphqlContext): Promise<TransactionModel[]> {
    return this.service.list(ctx.user!)
  }

  @Query(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async getTransaction(
    @Arg('id') id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.service.getById(id, ctx.user!)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg('data') data: CreateTransactionInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.service.create(data, ctx.user!)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg('id') id: string,
    @Arg('data') data: UpdateTransactionInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.service.update(id, data, ctx.user!)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg('id') id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<boolean> {
    return this.service.delete(id, ctx.user!)
  }
}
