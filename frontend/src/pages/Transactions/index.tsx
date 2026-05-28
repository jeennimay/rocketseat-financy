import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transactions"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import type { Transaction, Category } from "@/types"
import { Plus, Search, Trash2, Pencil, ChevronLeft, ChevronRight, CircleArrowDown, CircleArrowUp } from "lucide-react"
import { CategoryIcon, CategoryTag } from "@/components/CategoryIcon"
import { TransactionDialog } from "./components/TransactionDialog"
import { toast } from "sonner"

type TxData = { listTransactions: Transaction[] }
type CatData = { listCategories: Category[] }

const PAGE_SIZE = 10

function buildPeriodOptions(transactions: Transaction[]) {
  const seen = new Set<string>()
  const options: { value: string; label: string }[] = []
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const t of sorted) {
    const d = new Date(t.date)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!seen.has(value)) {
      seen.add(value)
      const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d)
      options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) })
    }
  }
  return options
}

export function Transactions() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [page, setPage] = useState(1)

  const { data: txData } = useQuery<TxData>(LIST_TRANSACTIONS)
  const { data: catData } = useQuery<CatData>(LIST_CATEGORIES)
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: LIST_TRANSACTIONS }],
    onCompleted: () => toast.success("Transação excluída"),
    onError: () => toast.error("Erro ao excluir"),
  })

  const categories = catData?.listCategories ?? []
  const all = [...(txData?.listTransactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const periodOptions = useMemo(() => buildPeriodOptions(all), [all])

  const filtered = useMemo(() => {
    return all.filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === "all" || t.type === typeFilter
      const matchCat = categoryFilter === "all" || t.categoryId === categoryFilter
      const matchPeriod = periodFilter === "all" || (() => {
        const d = new Date(t.date)
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        return value === periodFilter
      })()
      return matchSearch && matchType && matchCat && matchPeriod
    })
  }, [all, search, typeFilter, categoryFilter, periodFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleEdit(t: Transaction) { setEditing(t); setOpen(true) }
  function handleClose() { setOpen(false); setEditing(null) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="mt-0.5 text-sm text-gray-500">Gerencie todas as suas transações financeiras</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova transação
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-600">Buscar</p>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-green-600">
              <Search className="h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-600">Tipo</p>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600">
              <option value="all">Todos</option>
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-600">Categoria</p>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600">
              <option value="all">Todas</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-600">Período</p>
            <select value={periodFilter} onChange={(e) => { setPeriodFilter(e.target.value); setPage(1) }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600">
              <option value="all">Todos</option>
              {periodOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] border-b border-gray-100 px-6 py-3">
          {["DESCRIÇÃO", "DATA", "CATEGORIA", "TIPO", "VALOR", "AÇÕES"].map((h) => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</span>
          ))}
        </div>

        {paged.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400">Nenhuma transação encontrada.</p>
        ) : (
          paged.map((t) => (
            <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] items-center border-b border-gray-50 px-6 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <CategoryIcon icon={t.category?.icon} color={t.category?.color} size="sm" />
                <span className="text-sm font-medium text-gray-900">{t.description}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(t.date))}
              </span>
              <div>{t.category ? <CategoryTag name={t.category.name} color={t.category.color} /> : <span className="text-xs text-gray-400">—</span>}</div>
              <div className="flex items-center gap-1.5">
                {t.type === "income"
                  ? <span className="flex items-center gap-1 text-xs font-medium text-green-600"><CircleArrowUp className="h-3.5 w-3.5" /> Entrada</span>
                  : <span className="flex items-center gap-1 text-xs font-medium text-red-500"><CircleArrowDown className="h-3.5 w-3.5" /> Saída</span>}
              </div>
              <span className={`text-sm font-semibold tabular-nums ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                {t.type === "income" ? "+" : "-"} {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(t.amount)}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => deleteTransaction({ variables: { id: t.id } })}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleEdit(t)}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3">
          <span className="text-xs text-gray-400">
            {filtered.length === 0 ? "0 resultados" : `${(page - 1) * PAGE_SIZE + 1} a ${Math.min(page * PAGE_SIZE, filtered.length)} | ${filtered.length} resultados`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${n === page ? "bg-green-700 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <TransactionDialog open={open} onClose={handleClose} transaction={editing} />
    </div>
  )
}
