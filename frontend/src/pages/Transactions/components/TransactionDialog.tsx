import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transactions"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories"
import type { Category, Transaction, TransactionType } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CircleDollarSign, CircleArrowDown } from "lucide-react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  transaction?: Transaction | null
}

type CatData = { listCategories: Category[] }

export function TransactionDialog({ open, onClose, transaction }: Props) {
  const isEditing = !!transaction
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<TransactionType>("expense")
  const [date, setDate] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const { data } = useQuery<CatData>(LIST_CATEGORIES)
  const categories = data?.listCategories ?? []
  const refetch = [{ query: LIST_TRANSACTIONS }]

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description)
      setAmount(String(transaction.amount))
      setType(transaction.type)
      setDate(transaction.date.slice(0, 10))
      setCategoryId(transaction.categoryId ?? "")
    } else {
      setDescription(""); setAmount(""); setType("expense")
      setDate(""); setCategoryId("")
    }
  }, [transaction, open])

  const [create, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: refetch,
    onCompleted: () => { toast.success("Transação criada"); onClose() },
    onError: () => toast.error("Erro ao criar transação"),
  })

  const [update, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: refetch,
    onCompleted: () => { toast.success("Transação atualizada"); onClose() },
    onError: () => toast.error("Erro ao atualizar transação"),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(date + "T12:00:00").toISOString(),
      categoryId: categoryId || undefined,
    }
    if (isEditing) update({ variables: { id: transaction.id, data } })
    else create({ variables: { data } })
  }

  const loading = creating || updating

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
          <p className="text-sm text-gray-500">Registre sua despesa ou receita</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setType("expense")}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-medium transition-colors ${type === "expense" ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              <CircleArrowDown className="h-4 w-4" /> Despesa
            </button>
            <button type="button" onClick={() => setType("income")}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-medium transition-colors ${type === "income" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              <CircleDollarSign className="h-4 w-4" /> Receita
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Ex. Almoço no restaurante"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Valor</label>
              <div className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-green-600">
                <span className="text-sm text-gray-400">R$</span>
                <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0,00"
                  className="w-full bg-transparent text-sm outline-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600">
              <option value="">Selecione</option>
              {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="mt-1 w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
