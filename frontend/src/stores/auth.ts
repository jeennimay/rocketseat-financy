import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import type { User, RegisterInput, LoginInput } from '@/types'
import { REGISTER } from '@/lib/graphql/mutations/Register'
import { LOGIN } from '@/lib/graphql/mutations/Login'

type AuthMutationData<K extends string> = {
  [key in K]: {
    token: string
    user: User
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signup: (data: RegisterInput) => Promise<boolean>
  login: (data: LoginInput) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<AuthMutationData<'login'>, { data: LoginInput }>({
            mutation: LOGIN,
            variables: { data: loginData },
          })
          if (data?.login) {
            const { user, token } = data.login
            set({ user, token, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error("Erro ao fazer login", error)
          throw error
        }
      },

      signup: async (registerData: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<AuthMutationData<'register'>, { data: RegisterInput }>({
            mutation: REGISTER,
            variables: { data: registerData },
          })
          if (data?.register) {
            const { user, token } = data.register
            set({ user, token, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error("Erro ao fazer cadastro", error)
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        apolloClient.clearStore()
      },
    }),
    { name: 'financy-auth' }
  )
)
