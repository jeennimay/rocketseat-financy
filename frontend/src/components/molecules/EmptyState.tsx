import { Button } from '@/components/atoms/Button'
import { Plus } from 'lucide-react'

interface Props {
  icon: React.ReactNode
  message: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 gap-3">
      <span className="text-gray-300">{icon}</span>
      <p className="text-sm text-gray-400">{message}</p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  )
}
