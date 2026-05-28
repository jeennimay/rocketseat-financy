import { chromium } from '@playwright/test'

const GQL = 'http://localhost:4000/graphql'
const BASE = 'http://localhost:5173'
const OUT  = 'C:/Users/jenni/AppData/Local/Temp/financy-screens'

async function gql(query: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const r = await fetch(GQL, { method: 'POST', headers, body: JSON.stringify({ query }) })
  return r.json()
}

;(async () => {
  // login com usuário demo
  const json  = await gql(`mutation { login(data: { email: "demo@financy.com", password: "senha123" }) { token user { id name email } } }`)
  const token = json.data.login.token
  const user  = json.data.login.user
  const auth  = JSON.stringify({ state: { user, token, isAuthenticated: true }, version: 0 })

  const browser = await chromium.launch()
  const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page    = await ctx.newPage()

  // injeta auth no localStorage antes de navegar
  await page.addInitScript((a) => localStorage.setItem('financy-auth', a), auth)

  const shot = async (name: string, url: string, extra?: () => Promise<void>) => {
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' })
    if (extra) await extra()
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false })
    console.log(`✔ ${name}`)
  }

  // ── Páginas ──────────────────────────────────────────────
  await shot('dashboard',    '/')
  await shot('transactions', '/transactions')
  await shot('categories',   '/categories')
  await shot('profile',      '/profile')

  // modais
  await shot('modal-transaction', '/', async () => {
    await page.click('text=Nova transação')
    await page.waitForSelector('[role="dialog"]')
  })
  await shot('modal-category', '/categories', async () => {
    await page.click('text=Nova categoria')
    await page.waitForSelector('[role="dialog"]')
  })

  // auth (sem token)
  const page2 = await ctx.newPage()
  await page2.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page2.screenshot({ path: `${OUT}/login.png` })
  console.log('✔ login')
  await page2.goto(`${BASE}/signup`, { waitUntil: 'networkidle' })
  await page2.screenshot({ path: `${OUT}/signup.png` })
  console.log('✔ signup')

  await browser.close()
  console.log(`\nScreenshots salvos em ${OUT}`)
})()
