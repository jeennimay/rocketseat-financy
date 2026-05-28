import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/transaction'
import type { Transaction } from '@/types'

type Data = { listTransactions: Transaction[] }

export function useTransactions() {
  const { data, loading } = useQuery<Data>(LIST_TRANSACTIONS)

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: LIST_TRANSACTIONS }],
    onCompleted: () => toast.success('Transação excluída'),
    onError:     () => toast.error('Erro ao excluir'),
  })

  const transactions = [...(data?.listTransactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { transactions, loading, deleteTransaction }
}
