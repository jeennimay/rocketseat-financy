import { APIRequestContext, Page } from '@playwright/test'
import { gqlRequest } from './api'

export interface AuthData {
  token: string
  user: { id: string; name: string; email: string }
  credentials: { email: string; password: string }
  localStorageState: object
}

export async function registerTestUser(request: APIRequestContext): Promise<AuthData> {
  const email    = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@test.com`
  const password = 'senha123'

  const json = await gqlRequest(request, `
    mutation {
      register(data: { name: "Usuário E2E", email: "${email}", password: "${password}" }) {
        token
        user { id name email }
      }
    }
  `)

  const { token, user } = json.data.register

  return {
    token,
    user,
    credentials: { email, password },
    localStorageState: {
      state: { user, token, isAuthenticated: true },
      version: 0,
    },
  }
}

/** Injeta o estado de autenticação no localStorage antes de navegar para a página. */
export async function loginViaLocalStorage(page: Page, auth: AuthData) {
  await page.addInitScript((state) => {
    localStorage.setItem('financy-auth', JSON.stringify(state))
  }, auth.localStorageState)
}
