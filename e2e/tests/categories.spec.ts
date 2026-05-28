import { test, expect } from '@playwright/test'
import { registerTestUser, loginViaLocalStorage } from '../helpers/auth'

test.describe('Categorias', () => {
  test.beforeEach(async ({ page, request }) => {
    const auth = await registerTestUser(request)
    await loginViaLocalStorage(page, auth)
    await page.goto('/categories')
  })

  test('página carrega com título e botão de nova categoria', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible()
    await expect(page.getByRole('button', { name: /nova categoria/i })).toBeVisible()
  })

  test('exibe estado vazio quando não há categorias', async ({ page }) => {
    await expect(page.getByText('Nenhuma categoria cadastrada.')).toBeVisible()
  })

  test('cria uma categoria e ela aparece no grid', async ({ page }) => {
    await page.getByRole('button', { name: /nova categoria/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByPlaceholder('Ex. Alimentação').fill('Alimentação E2E')
    await dialog.getByPlaceholder('Descrição da categoria').fill('Restaurantes e delivery')
    await dialog.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Categoria criada')).toBeVisible()
    await expect(page.getByText('Alimentação E2E')).toBeVisible()
  })

  test('cards de resumo atualizam ao criar categoria', async ({ page }) => {
    // antes: 0 categorias
    await expect(page.getByText('0').first()).toBeVisible()

    await page.getByRole('button', { name: /nova categoria/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Ex. Alimentação').fill('Transporte E2E')
    await dialog.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Categoria criada')).toBeVisible()

    // depois: 1 categoria
    await expect(page.getByText('1')).toBeVisible()
  })

  test('edita uma categoria existente', async ({ page }) => {
    // cria
    await page.getByRole('button', { name: /nova categoria/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Ex. Alimentação').fill('Editar Cat')
    await dialog.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Categoria criada')).toBeVisible()

    // edita
    await page.getByRole('button', { name: 'Editar' }).first().click()
    const editDialog = page.getByRole('dialog')
    await editDialog.getByPlaceholder('Ex. Alimentação').fill('Categoria Editada E2E')
    await editDialog.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Categoria atualizada')).toBeVisible()
    await expect(page.getByText('Categoria Editada E2E')).toBeVisible()
  })

  test('deleta uma categoria', async ({ page }) => {
    // cria
    await page.getByRole('button', { name: /nova categoria/i }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Ex. Alimentação').fill('Deletar Cat E2E')
    await dialog.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Categoria criada')).toBeVisible()

    // deleta
    await page.getByRole('button', { name: 'Excluir' }).first().click()
    await expect(page.getByText('Categoria excluída')).toBeVisible()
    await expect(page.getByText('Deletar Cat E2E')).not.toBeVisible()
  })
})
