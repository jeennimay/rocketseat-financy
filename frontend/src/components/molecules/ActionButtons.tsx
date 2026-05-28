import { Trash2, Pencil } from 'lucide-react'
import { IconButton } from '@/components/atoms/IconButton'

interface Props {
  onEdit?: () => void
  onDelete?: () => void
}

export function ActionButtons({ onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-1">
      {onDelete && (
        <IconButton
          variant="danger"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          onClick={onDelete}
          aria-label="Excluir"
        />
      )}
      {onEdit && (
        <IconButton
          variant="default"
          icon={<Pencil className="h-3.5 w-3.5" />}
          onClick={onEdit}
          aria-label="Editar"
        />
      )}
    </div>
  )
}
