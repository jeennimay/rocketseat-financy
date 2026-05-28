import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import type { Transaction, Category } from '@/types'
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Badge } from '@/components/atoms/Badge'
import { ActionButtons } from '@/components/molecules/ActionButtons'
import { TransactionDialog } from './components/TransactionDialog'
import { useTransactions } from '@/hooks/useTransactions'
import { usePagination } from '@/hooks/usePagination'
import { formatCurrency, formatDate } from '@/utils/format'
import { Skeleton } from '@/components/atoms/Skeleton'

type CatData = { listCategories: Category[] }

const PAGE_SIZE = 10

const selectCls = 'w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 transition-colors'
const labelCls  = 'mb-1.5 text-sm font-medium text-gray-500'

function buildPeriodOptions(transactions: Transaction[]) {
  const seen = new Set<string>()
  const opts: { value: string; label: string }[] = []
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const t of sorted) {
    const d     = new Date(t.date)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!seen.has(value)) {
      seen.add(value)
      const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(d)
      opts.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) })
    }
  }
  return opts
}

function FilterSelect({ value, onChange, children }: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  )
}

export function Transactions() {
  const [open, setOpen]               = useState(false)
  const [editing, setEditing]         = useState<Transaction | null>(null)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [periodFilter, setPeriodFilter]     = useState('all')

  const { transactions, loading, deleteTransaction } = useTransactions()
  const { data: catData } = useQuery<CatData>(LIST_CATEGORIES)
  const categories = catData?.listCategories ?? []

  const periodOptions = useMemo(() => buildPeriodOptions(transactions), [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch  = t.description.toLowerCase().includes(search.toLowerCase())
      const matchType    = typeFilter === 'all' || t.type === typeFilter
      const matchCat     = categoryFilter === 'all' || t.categoryId === categoryFilter
      const matchPeriod  = periodFilter === 'all' || (() => {
        const d     = new Date(t.date)
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        return value === periodFilter
      })()
      return matchSearch && matchType && matchCat && matchPeriod
    })
  }, [transactions, search, typeFilter, categoryFilter, periodFilter])

  const { page, setPage, totalPages, paged, next, prev } = usePagination(filtered, PAGE_SIZE)

  function handleEdit(t: Transaction) { setEditing(t); setOpen(true) }
  function handleClose() { setOpen(false); setEditing(null) }

  if (loading) return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton height="h-8" width="w-40" />
          <Skeleton height="h-4" width="w-72" />
        </div>
        <Skeleton height="h-10" width="w-40" radius="rounded-lg" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} height="h-10" radius="rounded-lg" />)}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-3">
        <Skeleton height="h-8" radius="rounded-lg" />
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <Skeleton key={i} height="h-14" radius="rounded-lg" />
        ))}
      </div>
    </div>
  )

  const COLS = 'grid-cols-[minmax(0,2fr)_minmax(70px,1fr)_minmax(100px,1.5fr)_minmax(80px,1fr)_minmax(100px,1.5fr)_64px]'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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

      {/* Filtros */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Buscar */}
          <div>
            <p className={labelCls}>Buscar</p>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-green-600 transition-colors">
              <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
          </div>
          {/* Tipo */}
          <div>
            <p className={labelCls}>Tipo</p>
            <FilterSelect value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <option value="all">Todos</option>
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </FilterSelect>
          </div>
          {/* Categoria */}
          <div>
            <p className={labelCls}>Categoria</p>
            <FilterSelect value={categoryFilter} onChange={(v) => { setCategoryFilter(v); setPage(1) }}>
              <option value="all">Todas</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </FilterSelect>
          </div>
          {/* Período */}
          <div>
            <p className={labelCls}>Período</p>
            <FilterSelect value={periodFilter} onChange={(v) => { setPeriodFilter(v); setPage(1) }}>
              <option value="all">Todos</option>
              {periodOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </FilterSelect>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {/* Cabeçalho */}
        <div className={`grid ${COLS} border-b border-gray-100 py-3 min-w-[700px]`}>
          {['DESCRIÇÃO', 'DATA', 'CATEGORIA', 'TIPO', 'VALOR', 'AÇÕES'].map((h) => (
            <span key={h} className="px-6 text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</span>
          ))}
        </div>

        {paged.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400">Nenhuma transação encontrada.</p>
        ) : (
          paged.map((t) => (
            <div key={t.id} className={`grid ${COLS} items-center border-b border-gray-100 py-5 min-w-[700px] hover:bg-gray-50 transition-colors`}>
              {/* Descrição */}
              <div className="flex items-center gap-3 min-w-0 px-6">
                <CategoryIcon icon={t.category?.icon} color={t.category?.color} size="sm" />
                <span className="truncate text-sm font-medium text-gray-900" title={t.description}>{t.description}</span>
              </div>
              {/* Data */}
              <span className="px-6 text-sm text-gray-500">
                {formatDate(t.date, { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </span>
              {/* Categoria */}
              <div className="flex justify-center px-6">
                {t.category
                  ? <Badge name={t.category.name} color={t.category.color} />
                  : <span className="text-xs text-gray-400">—</span>}
              </div>
              {/* Tipo */}
              <div className="flex items-center gap-1.5 px-6">
                {t.type === 'income'
                  ? <span className="flex items-center gap-1 text-xs font-medium text-green-600"><CircleArrowUp className="h-3.5 w-3.5" /> Entrada</span>
                  : <span className="flex items-center gap-1 text-xs font-medium text-red-500"><CircleArrowDown className="h-3.5 w-3.5" /> Saída</span>}
              </div>
              {/* Valor */}
              <div className="px-6 text-right text-sm font-semibold tabular-nums text-gray-900 whitespace-nowrap">
                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
              </div>
              {/* Ações */}
              <div className="flex items-center justify-end px-6">
                <ActionButtons
                  onDelete={() => deleteTransaction({ variables: { id: t.id } })}
                  onEdit={() => handleEdit(t)}
                />
              </div>
            </div>
          ))
        )}

        {/* Paginação */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm text-gray-400">
            {filtered.length === 0 ? '0 resultados' : `${(page - 1) * PAGE_SIZE + 1} a ${Math.min(page * PAGE_SIZE, filtered.length)} | ${filtered.length} resultados`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={prev} disabled={page === 1}
              className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${n === page ? 'bg-green-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {n}
              </button>
            ))}
            <button onClick={next} disabled={page === totalPages}
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
