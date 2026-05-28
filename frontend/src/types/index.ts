export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  color?: string
  icon?: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  userId: string
  categoryId?: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId?: string
}

export interface UpdateTransactionInput {
  description?: string
  amount?: number
  type?: TransactionType
  date?: string
  categoryId?: string
}

export interface CreateCategoryInput {
  name: string
  color?: string
  icon?: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  color?: string
  icon?: string
  description?: string
}
