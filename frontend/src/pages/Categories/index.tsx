import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transactions"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/category"
import type { Category, Transaction } from "@/types"
import { Plus, Tag, ArrowLeftRight, Pencil, Trash2 } from "lucide-react"
import { CategoryIcon, CategoryTag } from "@/components/CategoryIcon"

import { CategoryDialog } from "./components/CategoryDialog"
import { toast } from "sonner"

type CatData = { listCategories: Category[] }
type TxData = { listTransactions: Transaction[] }

export function Categories() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const { data: catData } = useQuery<CatData>(LIST_CATEGORIES)
  const { data: txData } = useQuery<TxData>(LIST_TRANSACTIONS)
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => toast.success("Categoria excluída"),
    onError: () => toast.error("Erro ao excluir"),
  })

  const categories = catData?.listCategories ?? []
  const transactions = txData?.listTransactions ?? []

  const mostUsed = categories.reduce((best, c) => {
    const count = transactions.filter((t) => t.categoryId === c.id).length
    if (!best || count > transactions.filter((t) => t.categoryId === best.id).length) return c
    return best
  }, null as Category | null)

  function handleEdit(c: Category) { setEditing(c); setOpen(true) }
  function handleClose() { setOpen(false); setEditing(null) }

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

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Tag className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total de Categorias</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <ArrowLeftRight className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total de Transações</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          {mostUsed ? (
            <CategoryIcon icon={mostUsed.icon} color={mostUsed.color} />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100" />
          )}
          <div>
            <p className="text-2xl font-bold text-gray-900">{mostUsed?.name ?? "—"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Categoria Mais Utilizada</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 gap-3">
          <Tag className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">Nenhuma categoria cadastrada.</p>
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Plus className="h-4 w-4" /> Criar categoria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {categories.map((c) => {
            const count = transactions.filter((t) => t.categoryId === c.id).length
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <CategoryIcon icon={c.icon} color={c.color} />
                  <div className="flex gap-1">
                    <button onClick={() => deleteCategory({ variables: { id: c.id } })}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleEdit(c)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  {c.description && <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{c.description}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <CategoryTag name={c.name} color={c.color} />
                  <span className="text-xs text-gray-400">{count} {count === 1 ? "item" : "itens"}</span>
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
