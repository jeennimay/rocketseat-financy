import { test, expect } from '@playwright/test'
import { registerTestUser, loginViaLocalStorage } from '../helpers/auth'

test.describe('Transações', () => {
  test.beforeEach(async ({ page, request }) => {
    const auth = await registerTestUser(request)
    await loginViaLocalStorage(page, auth)
    await page.goto('/transactions')
  })

  test('página carrega com título e botão de nova transação', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible()
    await expect(page.getByRole('button', { name: /nova transação/i })).toBeVisible()
  })

  test('cria uma transação de despesa e ela aparece na tabela', async ({ page }) => {
    await page.getByRole('button', { name: /nova transação/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // seleciona tipo Despesa (já selecionado por padrão)
    await dialog.getByRole('button', { name: /despesa/i }).click()
    await dialog.getByPlaceholder('Ex. Almoço no restaurante').fill('Almoço E2E')
    await dialog.locator('input[type="date"]').fill('2025-11-30')
    await dialog.locator('input[type="number"]').fill('89.50')
    await dialog.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Transação criada')).toBeVisible()
    await expect(page.getByText('Almoço E2E')).toBeVisible()
  })

  test('cria uma transação de receita e exibe corretamente', async ({ page }) => {
    await page.getByRole('button', { name: /nova transação/i }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: /receita/i }).click()
    await dialog.getByPlaceholder('Ex. Almoço no restaurante').fill('Salário E2E')
    await dialog.locator('input[type="date"]').fill('2025-11-01')
    await dialog.locator('input[type="number"]').fill('5000')
    await dialog.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Transação criada')).toBeVisible()
    await expect(page.getByText('Salário E2E')).toBeVisible()
    await expect(page.getByText('Entrada')).toBeVisible()
  })

  test('edita uma transação existente', async ({ page }) => {
    // cria primeiro
    await page.getByRole('button', { name: /nova transação/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Ex. Almoço no restaurante').fill('Editar depois')
    await dialog.locator('input[type="date"]').fill('2025-11-15')
    await dialog.locator('input[type="number"]').fill('100')
    await dialog.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Transação criada')).toBeVisible()

    // edita
    await page.getByRole('button', { name: 'Editar' }).first().click()
    const editDialog = page.getByRole('dialog')
    await editDialog.getByPlaceholder('Ex. Almoço no restaurante').fill('Editado E2E')
    await editDialog.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Transação atualizada')).toBeVisible()
    await expect(page.getByText('Editado E2E')).toBeVisible()
  })

  test('deleta uma transação', async ({ page }) => {
    // cria primeiro
    await page.getByRole('button', { name: /nova transação/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Ex. Almoço no restaurante').fill('Deletar E2E')
    await dialog.locator('input[type="date"]').fill('2025-11-20')
    await dialog.locator('input[type="number"]').fill('50')
    await dialog.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Transação criada')).toBeVisible()

    // deleta
    await page.getByRole('button', { name: 'Excluir' }).first().click()
    await expect(page.getByText('Transação excluída')).toBeVisible()
    await expect(page.getByText('Deletar E2E')).not.toBeVisible()
  })

  test('filtro por tipo funciona corretamente', async ({ page }) => {
    await page.getByLabel('Tipo').selectOption('income')
    await expect(page.getByText('Saída')).not.toBeVisible()
  })
})
