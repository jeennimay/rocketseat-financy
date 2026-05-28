import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
      <Toaster />
    </div>
  )
}
