interface Props {
  label: string
  value: string | number
  icon: React.ReactNode
  iconBg?: string
}

export function SummaryCard({ label, value, icon, iconBg = 'bg-gray-100' }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
