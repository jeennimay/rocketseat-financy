import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, User, LogOut } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"

export function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? "")

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?"

  function handleLogout() {
    logout()
    navigate("/login")
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Alterações salvas")
  }

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-600">
            {initials}
          </div>
          <p className="text-lg font-bold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <hr className="mb-6 border-gray-200" />

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nome completo</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-green-600">
              <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <input type="email" value={user?.email ?? ""} disabled
                className="w-full bg-transparent text-sm text-gray-500 outline-none" />
            </div>
            <p className="text-xs text-gray-400">O e-mail não pode ser alterado</p>
          </div>

          <button type="submit"
            className="w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors">
            Salvar alterações
          </button>
        </form>

        <button onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" /> Sair da conta
        </button>
      </div>
    </div>
  )
}
