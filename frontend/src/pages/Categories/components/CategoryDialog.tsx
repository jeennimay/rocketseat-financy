import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/lib/graphql/mutations/category"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories"
import type { Category } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CATEGORY_ICONS } from "@/components/CategoryIcon"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  category?: Category | null
}

const COLORS = ["#1F6F43", "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#EA580C", "#CA8A04"]

const inputCls = "rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
const labelCls = "text-sm font-medium text-gray-700"

export function CategoryDialog({ open, onClose, category }: Props) {
  const isEditing = !!category
  const [name, setName]               = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon]               = useState("")
  const [color, setColor]             = useState(COLORS[0])

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description ?? "")
      setIcon(category.icon ?? "")
      setColor(category.color ?? COLORS[0])
    } else {
      setName(""); setDescription(""); setIcon(""); setColor(COLORS[0])
    }
  }, [category, open])

  const refetch = [{ query: LIST_CATEGORIES }]

  const [create, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: refetch,
    onCompleted: () => { toast.success("Categoria criada"); onClose() },
    onError: () => toast.error("Erro ao criar categoria"),
  })

  const [update, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: refetch,
    onCompleted: () => { toast.success("Categoria atualizada"); onClose() },
    onError: () => toast.error("Erro ao atualizar categoria"),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = { name, description: description || undefined, icon, color }
    if (isEditing) update({ variables: { id: category.id, data } })
    else create({ variables: { data } })
  }

  const loading = creating || updating

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <p className="text-sm text-gray-500">Organize suas transações com categorias</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Título</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex. Alimentação"
              className={`${inputCls} w-full`}
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da categoria"
              className={`${inputCls} w-full`}
            />
            <span className="text-xs text-gray-400">Opcional</span>
          </div>

          {/* Ícone */}
          <div className="flex flex-col gap-2">
            <label className={labelCls}>Ícone</label>
            <div className="grid grid-cols-8 gap-1.5">
              {CATEGORY_ICONS.map(({ name: n, Icon }) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIcon(n)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    icon === n
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" style={{ color: icon === n ? "#1F6F43" : "#6b7280" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Cor — retângulos arredondados distribuídos igualmente */}
          <div className="flex flex-col gap-2">
            <label className={labelCls}>Cor</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-9 flex-1 rounded-lg border-2 transition-all hover:scale-105 ${
                    color === c ? "border-gray-700 scale-105" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 transition-colors"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
