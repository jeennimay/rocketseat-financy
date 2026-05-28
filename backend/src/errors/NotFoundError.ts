import { AppError } from './AppError'

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)!`, 404)
  }
}
