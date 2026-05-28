import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import type { Transaction } from '@/types'
import { Plus, Tag, ArrowLeftRight } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Badge } from '@/components/atoms/Badge'
import { SummaryCard } from '@/components/molecules/SummaryCard'
import { EmptyState } from '@/components/molecules/EmptyState'
import { ActionButtons } from '@/components/molecules/ActionButtons'
import { CategoryDialog } from './components/CategoryDialog'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/atoms/Skeleton'

type TxData = { listTransactions: Transaction[] }

export function Categories() {
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState<ReturnType<typeof useCategories>['categories'][0] | null>(null)

  const { categories, loading, deleteCategory } = useCategories()
  const { data: txData }               = useQuery<TxData>(LIST_TRANSACTIONS)
  const transactions                   = txData?.listTransactions ?? []

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
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton height="h-8" width="w-36" />
          <Skeleton height="h-4" width="w-64" />
        </div>
        <Skeleton height="h-10" width="w-40" radius="rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => <Skeleton key={i} height="h-28" radius="rounded-xl" />)}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} height="h-44" radius="rounded-xl" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="mt-0.5 text-sm text-gray-500">Organize suas transações por categorias</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors">
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-5">
        <SummaryCard
          label="TOTAL DE CATEGORIAS"
          value={categories.length}
          icon={<Tag className="h-5 w-5" />}
          iconBg=""
        />
        <SummaryCard
          label="TOTAL DE TRANSAÇÕES"
          value={transactions.length}
          icon={<ArrowLeftRight className="h-5 w-5" />}
          iconBg=""
        />
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          {mostUsed ? (
            <CategoryIcon icon={mostUsed.icon} color={mostUsed.color} />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100" />
          )}
          <div>
            <p className="text-2xl font-bold text-gray-900">{mostUsed?.name ?? '—'}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Categoria Mais Utilizada</p>
          </div>
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
        <div className="grid grid-cols-4 gap-4">
          {categories.map((c) => {
            const count = transactions.filter((t) => t.categoryId === c.id).length
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <CategoryIcon icon={c.icon} color={c.color} />
                  <ActionButtons
                    onDelete={() => deleteCategory({ variables: { id: c.id } })}
                    onEdit={() => handleEdit(c)}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  {c.description && <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{c.description}</p>}
                </div>
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
