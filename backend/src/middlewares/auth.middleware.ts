import { MiddlewareFn } from 'type-graphql'
import { GraphqlContext } from '../graphql/context'
import { UnauthorizedError } from '../errors/UnauthorizedError'

export const IsAuth: MiddlewareFn<GraphqlContext> = ({ context }, next) => {
  if (!context.user) throw new UnauthorizedError('Usuário não autenticado')
  return next()
}
