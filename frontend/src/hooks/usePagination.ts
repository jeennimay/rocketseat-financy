import { useState } from 'react'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paged      = items.slice((safePage - 1) * pageSize, safePage * pageSize)

  const next  = () => setPage((p) => Math.min(totalPages, p + 1))
  const prev  = () => setPage((p) => Math.max(1, p - 1))
  const reset = () => setPage(1)

  return { page: safePage, setPage, totalPages, paged, next, prev, reset }
}
