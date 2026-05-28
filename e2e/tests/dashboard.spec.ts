import { test, expect } from '@playwright/test'
import { registerTestUser, loginViaLocalStorage } from '../helpers/auth'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page, request }) => {
    const auth = await registerTestUser(request)
    await loginViaLocalStorage(page, auth)
    await page.goto('/')
  })

  test('exibe os três cards de resumo financeiro', async ({ page }) => {
    await expect(page.getByText('SALDO TOTAL')).toBeVisible()
    await expect(page.getByText('RECEITAS DO MÊS')).toBeVisible()
    await expect(page.getByText('DESPESAS DO MÊS')).toBeVisible()
  })

  test('exibe o painel de transações recentes e categorias', async ({ page }) => {
    await expect(page.getByText('Transações recentes')).toBeVisible()
    await expect(page.getByText('Categorias')).toBeVisible()
  })

  test('"Nova transação" abre o modal de criação', async ({ page }) => {
    await page.getByText('Nova transação').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByText('Nova transação')).toBeVisible()
  })

  test('"Ver todas" navega para /transactions', async ({ page }) => {
    await page.getByRole('link', { name: /ver todas/i }).click()
    await expect(page).toHaveURL('/transactions')
  })

  test('"Gerenciar" navega para /categories', async ({ page }) => {
    await page.getByRole('link', { name: /gerenciar/i }).click()
    await expect(page).toHaveURL('/categories')
  })
})
