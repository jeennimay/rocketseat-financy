import type { Transaction } from "@/types"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

interface Props {
  transaction: Transaction
  onEdit?: (t: Transaction) => void
  onDelete?: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

export function TransactionRow({ transaction, onEdit, onDelete }: Props) {
  const isIncome = transaction.type === "income"

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {isIncome ? (
          <ArrowUpCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{transaction.description}</span>
          <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {transaction.category && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: transaction.category.color
                ? `${transaction.category.color}20`
                : "#e5e7eb",
              color: transaction.category.color ?? "#374151",
            }}
          >
            {transaction.category.name}
          </span>
        )}
        <span
          className={`text-sm font-semibold tabular-nums ${
            isIncome ? "text-green-600" : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
