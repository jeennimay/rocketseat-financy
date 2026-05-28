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

export function CategoryDialog({ open, onClose, category }: Props) {
  const isEditing = !!category
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Tag")
  const [color, setColor] = useState(COLORS[0])

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description ?? "")
      setIcon(category.icon ?? "Tag")
      setColor(category.color ?? COLORS[0])
    } else {
      setName(""); setDescription(""); setIcon("Tag"); setColor(COLORS[0])
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex. Alimentação"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <span className="text-xs text-gray-400">Opcional</span>
            </div>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da categoria"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-8 gap-1.5">
              {CATEGORY_ICONS.map(({ name: n, Icon }) => (
                <button key={n} type="button" onClick={() => setIcon(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors ${icon === n ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                  <Icon className="h-4 w-4" style={{ color: icon === n ? "#1F6F43" : "#6b7280" }} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
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
