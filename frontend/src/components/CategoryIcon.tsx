import {
  Briefcase, Car, Heart, PiggyBank, ShoppingCart, Scissors, Gift, Utensils,
  CircleDollarSign, House, Tag, BookOpen, Building2, Tv, FileText, ShoppingBag,
  Zap, Coffee, Plane, Music, Gamepad2, Dumbbell, Baby, GraduationCap,
} from "lucide-react"

export const CATEGORY_ICONS: { name: string; Icon: React.ElementType }[] = [
  { name: "Utensils", Icon: Utensils },
  { name: "Car", Icon: Car },
  { name: "Heart", Icon: Heart },
  { name: "PiggyBank", Icon: PiggyBank },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Scissors", Icon: Scissors },
  { name: "Gift", Icon: Gift },
  { name: "Briefcase", Icon: Briefcase },
  { name: "CircleDollarSign", Icon: CircleDollarSign },
  { name: "House", Icon: House },
  { name: "ShoppingBag", Icon: ShoppingBag },
  { name: "Tag", Icon: Tag },
  { name: "BookOpen", Icon: BookOpen },
  { name: "Building2", Icon: Building2 },
  { name: "Tv", Icon: Tv },
  { name: "FileText", Icon: FileText },
  { name: "Zap", Icon: Zap },
  { name: "Coffee", Icon: Coffee },
  { name: "Plane", Icon: Plane },
  { name: "Music", Icon: Music },
  { name: "Gamepad2", Icon: Gamepad2 },
  { name: "Dumbbell", Icon: Dumbbell },
  { name: "Baby", Icon: Baby },
  { name: "GraduationCap", Icon: GraduationCap },
]

function getIcon(name?: string): React.ElementType {
  return CATEGORY_ICONS.find((i) => i.name === name)?.Icon ?? Tag
}

export function CategoryTag({ name, color }: { name: string; color?: string }) {
  const bg = color ? `${color}20` : "#e5e7eb"
  const text = color ?? "#374151"
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: bg, color: text }}>
      {name}
    </span>
  )
}

interface Props {
  icon?: string
  color?: string
  size?: "sm" | "md"
}

export function CategoryIcon({ icon, color, size = "md" }: Props) {
  const Icon = getIcon(icon)
  const bg = color ? `${color}25` : "#e5e7eb"
  const iconColor = color ?? "#6b7280"
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10"
  const iconDim = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-lg ${dim}`}
      style={{ backgroundColor: bg }}
    >
      <Icon className={iconDim} style={{ color: iconColor }} />
    </div>
  )
}
