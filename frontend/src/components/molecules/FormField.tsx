interface Props {
  label: string
  optional?: boolean
  prefixIcon?: React.ReactNode
  children: React.ReactNode
}

export function FormField({ label, optional, prefixIcon, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {optional && <span className="text-xs text-gray-400">Opcional</span>}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
        {prefixIcon && <span className="flex-shrink-0 text-gray-400">{prefixIcon}</span>}
        {children}
      </div>
    </div>
  )
}
