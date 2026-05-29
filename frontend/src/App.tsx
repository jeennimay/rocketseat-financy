import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "@/components/organisms/Layout"
import { Login } from "./pages/Auth/Login"
import { Signup } from "./pages/Auth/Signup"
import { Dashboard } from "./pages/Dashboard"
import { Transactions } from "./pages/Transactions"
import { Categories } from "./pages/Categories"
import { Profile } from "./pages/Profile"
import { useAuthStore } from "./stores/auth"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App
