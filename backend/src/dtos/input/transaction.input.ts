import { Field, Float, GraphQLISODateTime, InputType } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string

  @Field(() => Float)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}
