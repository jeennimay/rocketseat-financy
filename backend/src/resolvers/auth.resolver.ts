import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { LoginOutput, RegisterOutput } from '../dtos/output/auth.output'
import { AuthService } from '../services/auth.service'
import { UserModel } from '../models/user.model'
import { GraphqlContext } from '../graphql/context'
import { IsAuth } from '../middlewares/auth.middleware'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => LoginOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data)
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data)
  }

  @Query(() => UserModel)
  @UseMiddleware(IsAuth)
  async me(@Ctx() ctx: GraphqlContext): Promise<UserModel> {
    return this.authService.me(ctx.user!)
  }
}
