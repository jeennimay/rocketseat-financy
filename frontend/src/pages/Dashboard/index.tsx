import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import type { Transaction, Category } from '@/types'
import { Wallet, ArrowUpCircle, ArrowDownCircle, ChevronRight, Plus, CircleArrowUp, CircleArrowDown } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Badge } from '@/components/atoms/Badge'
import { SummaryCard } from '@/components/molecules/SummaryCard'
import { Skeleton } from '@/components/atoms/Skeleton'
import { TransactionDialog } from '../Transactions/components/TransactionDialog'
import { formatCurrency, formatDate } from '@/utils/format'

type TxData  = { listTransactions: Transaction[] }
type CatData = { listCategories: Category[] }

export function Dashboard() {
  const [openModal, setOpenModal] = useState(false)
  const { data: txData,  loading: txLoading }  = useQuery<TxData>(LIST_TRANSACTIONS)
  const { data: catData, loading: catLoading } = useQuery<CatData>(LIST_CATEGORIES)
  const loading = txLoading || catLoading

  const transactions = txData?.listTransactions ?? []
  const categories   = catData?.listCategories ?? []

  const now       = new Date()
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const income  = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const catTotals = categories
    .map((c) => {
      const txs = transactions.filter((t) => t.categoryId === c.id && t.type === 'expense')
      return { ...c, count: txs.length, total: txs.reduce((s, t) => s + t.amount, 0) }
    })
    .filter((c) => c.count > 0)
    .slice(0, 5)

  if (loading) return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => <Skeleton key={i} height="h-32" radius="rounded-xl" />)}
      </div>
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <Skeleton height="h-5" width="w-48" />
          <Skeleton lines={5} height="h-14" gap="gap-3" radius="rounded-lg" />
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <Skeleton height="h-5" width="w-32" />
          <Skeleton lines={5} height="h-8" gap="gap-3" radius="rounded-lg" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-5">
        <SummaryCard label="SALDO TOTAL"     value={formatCurrency(balance)} icon={<Wallet className="h-5 w-5 text-violet-500" />}       iconBg="bg-violet-50" iconShape="rounded-lg" />
        <SummaryCard label="RECEITAS DO MÊS" value={formatCurrency(income)}  icon={<ArrowUpCircle className="h-6 w-6 text-green-500" />}  iconBg="" />
        <SummaryCard label="DESPESAS DO MÊS" value={formatCurrency(expense)} icon={<ArrowDownCircle className="h-6 w-6 text-red-500" />}  iconBg="" />
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Transações recentes</span>
            <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-green-700 hover:underline">
              Ver todas <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recent.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400">Nenhuma transação ainda.</p>
            ) : (
              recent.map((t) => <DashboardTxRow key={t.id} transaction={t} />)
            )}
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex w-full items-center justify-center gap-2 border-t border-gray-100 py-4 text-sm font-medium text-green-700 transition-colors hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" /> Nova transação
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Categorias</span>
            <Link to="/categories" className="flex items-center gap-1 text-xs font-medium text-green-700 hover:underline">
              Gerenciar <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {catTotals.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400">Nenhuma categoria com transações.</p>
            ) : (
              catTotals.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-3">
                  <Badge name={c.name} color={c.color} />
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs text-gray-400">{c.count} {c.count === 1 ? 'item' : 'itens'}</span>
                    <span className="text-sm font-semibold text-gray-800">{formatCurrency(c.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TransactionDialog open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  )
}

function DashboardTxRow({ transaction: t }: { transaction: Transaction }) {
  const isIncome = t.type === 'income'
  return (
    <div className="flex items-center gap-4 px-6 py-3.5">
      <CategoryIcon icon={t.category?.icon} color={t.category?.color} size="sm" />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-gray-900">{t.description}</span>
        <span className="text-xs text-gray-400">{formatDate(t.date, { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
      </div>
      {t.category && <Badge name={t.category.name} color={t.category.color} />}
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
        </span>
        {isIncome
          ? <CircleArrowUp className="h-4 w-4 text-green-500" />
          : <CircleArrowDown className="h-4 w-4 text-red-500" />}
      </div>
    </div>
  )
}
