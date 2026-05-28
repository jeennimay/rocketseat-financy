import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import { DELETE_CATEGORY } from '@/lib/graphql/mutations/category'
import type { Category } from '@/types'

type Data = { listCategories: Category[] }

export function useCategories() {
  const { data, loading } = useQuery<Data>(LIST_CATEGORIES)

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => toast.success('Categoria excluída'),
    onError:     () => toast.error('Erro ao excluir'),
  })

  const categories = data?.listCategories ?? []

  return { categories, loading, deleteCategory }
}
