interface Props {
  name: string
  color?: string
}

export function Badge({ name, color }: Props) {
  const bg   = color ? `${color}20` : '#e5e7eb'
  const text = color ?? '#374151'
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {name}
    </span>
  )
}
