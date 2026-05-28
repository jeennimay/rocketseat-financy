import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import logo from "@/assets/logo.svg"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/transactions", label: "Transações" },
    { path: "/categories", label: "Categorias" },
  ]

  if (!isAuthenticated) return null

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-8">
        <Link to="/">
          <img src={logo} alt="Financy" className="h-7" />
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map(({ path, label }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-green-700 font-semibold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <button onClick={() => navigate("/profile")}>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback className="bg-gray-300 text-gray-700 text-sm font-semibold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
