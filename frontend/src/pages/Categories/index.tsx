import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import type { Transaction } from '@/types'
import { Plus, Tag, ArrowLeftRight, Trash2, Pencil } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Badge } from '@/components/atoms/Badge'
import { EmptyState } from '@/components/molecules/EmptyState'
import { CategoryDialog } from './components/CategoryDialog'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/atoms/Skeleton'

type TxData = { listTransactions: Transaction[] }

export function Categories() {
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState<ReturnType<typeof useCategories>['categories'][0] | null>(null)

  const { categories, loading, deleteCategory } = useCategories()
  const { data: txData }    = useQuery<TxData>(LIST_TRANSACTIONS)
  const transactions         = txData?.listTransactions ?? []

  const mostUsed = categories.reduce(
    (best, c) => {
      const count = transactions.filter((t) => t.categoryId === c.id).length
      if (!best || count > transactions.filter((t) => t.categoryId === best.id).length) return c
      return best
    },
    null as (typeof categories)[0] | null
  )

  function handleEdit(c: (typeof categories)[0]) { setEditing(c); setOpen(true) }
  function handleClose() { setOpen(false); setEditing(null) }

  if (loading) return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton height="h-8" width="w-36" />
          <Skeleton height="h-4" width="w-64" />
        </div>
        <Skeleton height="h-10" width="w-40" radius="rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} height="h-28" radius="rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} height="h-44" radius="rounded-xl" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="mt-0.5 text-sm text-gray-500">Organize suas transações por categorias</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">

        {/* Total de categorias */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-400" />
            <span className="text-3xl font-bold text-gray-900">{categories.length}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Total de Categorias</p>
        </div>

        {/* Total de transações */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="h-5 w-5 text-violet-500" />
            <span className="text-3xl font-bold text-gray-900">{transactions.length}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Total de Transações</p>
        </div>

        {/* Categoria mais utilizada */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            {mostUsed
              ? <CategoryIcon icon={mostUsed.icon} color={mostUsed.color} />
              : <div className="h-10 w-10 rounded-lg bg-gray-100" />}
            <span className="text-2xl font-bold text-gray-900 truncate">{mostUsed?.name ?? '—'}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Categoria Mais Utilizada</p>
        </div>
      </div>

      {/* Grid de categorias */}
      {categories.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-8 w-8" />}
          message="Nenhuma categoria cadastrada."
          action={{ label: 'Criar categoria', onClick: () => setOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => {
            const count = transactions.filter((t) => t.categoryId === c.id).length
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
                {/* Ícone + ações */}
                <div className="flex items-start justify-between">
                  <CategoryIcon icon={c.icon} color={c.color} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteCategory({ variables: { id: c.id } })}
                      aria-label="Excluir"
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      aria-label="Editar"
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nome + descrição */}
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  {c.description && (
                    <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{c.description}</p>
                  )}
                </div>

                {/* Badge + contagem */}
                <div className="flex items-center justify-between">
                  <Badge name={c.name} color={c.color} />
                  <span className="text-xs text-gray-400">{count} {count === 1 ? 'item' : 'itens'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CategoryDialog open={open} onClose={handleClose} category={editing} />
    </div>
  )
}
