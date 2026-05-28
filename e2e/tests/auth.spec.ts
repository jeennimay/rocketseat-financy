import { test, expect } from '@playwright/test'
import { registerTestUser, loginViaLocalStorage } from '../helpers/auth'

test.describe('Autenticação', () => {
  test('login com credenciais válidas redireciona para o dashboard', async ({ page, request }) => {
    const auth = await registerTestUser(request)

    await page.goto('/login')
    await page.getByPlaceholder('mail@exemplo.com').fill(auth.credentials.email)
    await page.getByPlaceholder('Digite sua senha').fill(auth.credentials.password)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('SALDO TOTAL')).toBeVisible()
  })

  test('senha incorreta exibe mensagem de erro', async ({ page, request }) => {
    const auth = await registerTestUser(request)

    await page.goto('/login')
    await page.getByPlaceholder('mail@exemplo.com').fill(auth.credentials.email)
    await page.getByPlaceholder('Digite sua senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByText('E-mail ou senha inválidos')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('cadastro cria conta e redireciona para o dashboard', async ({ page }) => {
    const email = `signup-${Date.now()}@test.com`

    await page.goto('/signup')
    await page.getByPlaceholder('Seu nome completo').fill('Usuário Teste E2E')
    await page.getByPlaceholder('mail@exemplo.com').fill(email)
    await page.getByPlaceholder('Digite sua senha').fill('senha123')
    await page.getByRole('button', { name: 'Cadastrar' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('SALDO TOTAL')).toBeVisible()
  })

  test('usuário não autenticado é redirecionado para /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('logout redireciona para /login', async ({ page, request }) => {
    const auth = await registerTestUser(request)
    await loginViaLocalStorage(page, auth)

    await page.goto('/')
    await expect(page.getByText('SALDO TOTAL')).toBeVisible()

    // navega para perfil e faz logout
    await page.goto('/profile')
    await page.getByRole('button', { name: /sair da conta/i }).click()

    await expect(page).toHaveURL('/login')
  })
})
