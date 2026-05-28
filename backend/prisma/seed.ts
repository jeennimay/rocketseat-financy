import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const EMAIL = 'demo@financy.com'
const SENHA = 'senha123'

function d(year: number, month: number, day: number) {
  return new Date(year, month - 1, day)
}

async function main() {
  console.log('\n🌱  Iniciando seed do Financy...\n')

  // ── Limpa dados do usuário demo anterior ──────────────────
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } })
  if (existing) {
    await prisma.transaction.deleteMany({ where: { userId: existing.id } })
    await prisma.category.deleteMany({ where: { userId: existing.id } })
    await prisma.user.delete({ where: { id: existing.id } })
    console.log('🗑️   Dados anteriores removidos')
  }

  // ── Usuário ───────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      name:     'Conta Demo',
      email:    EMAIL,
      password: await bcrypt.hash(SENHA, 10),
    },
  })
  console.log(`👤  Usuário criado: ${user.email}`)

  // ── Categorias ────────────────────────────────────────────
  const [ali, trans, mor, sau, ent, sal, inv, comp] = await Promise.all([
    prisma.category.create({ data: { name: 'Alimentação',    icon: 'Utensils',     color: '#EA580C', description: 'Restaurantes, delivery e refeições',          userId: user.id } }),
    prisma.category.create({ data: { name: 'Transporte',     icon: 'Car',          color: '#7C3AED', description: 'Gasolina, transporte público e viagens',       userId: user.id } }),
    prisma.category.create({ data: { name: 'Moradia',        icon: 'House',        color: '#2563EB', description: 'Aluguel, contas e manutenção',                 userId: user.id } }),
    prisma.category.create({ data: { name: 'Saúde',          icon: 'Heart',        color: '#DB2777', description: 'Medicamentos, consultas e exames',             userId: user.id } }),
    prisma.category.create({ data: { name: 'Entretenimento', icon: 'Tv',           color: '#CA8A04', description: 'Cinema, streaming e lazer',                    userId: user.id } }),
    prisma.category.create({ data: { name: 'Salário',        icon: 'Briefcase',    color: '#1F6F43', description: 'Renda mensal e bonificações',                  userId: user.id } }),
    prisma.category.create({ data: { name: 'Investimento',   icon: 'PiggyBank',    color: '#059669', description: 'Aplicações e retornos financeiros',            userId: user.id } }),
    prisma.category.create({ data: { name: 'Compras',        icon: 'ShoppingCart', color: '#DC2626', description: 'Roupas, eletrônicos e diversos',               userId: user.id } }),
  ])
  console.log('🏷️   8 categorias criadas')

  // ── Transações ────────────────────────────────────────────
  type TxType = 'income' | 'expense'
  const txs: { description: string; amount: number; type: TxType; date: Date; categoryId: string }[] = [

    // ─── Novembro 2025 ────────────────────────────────────
    { description: 'Salário Novembro',      amount: 6500.00, type: 'income',  date: d(2025, 11,  5), categoryId: sal.id },
    { description: 'Freelance Design',      amount: 1200.00, type: 'income',  date: d(2025, 11, 12), categoryId: sal.id },
    { description: 'Rendimento CDB',        amount:  187.50, type: 'income',  date: d(2025, 11, 15), categoryId: inv.id },
    { description: 'Aluguel',               amount: 1800.00, type: 'expense', date: d(2025, 11,  5), categoryId: mor.id },
    { description: 'Conta de Luz',          amount:  134.80, type: 'expense', date: d(2025, 11,  8), categoryId: mor.id },
    { description: 'Internet',              amount:   99.90, type: 'expense', date: d(2025, 11, 10), categoryId: mor.id },
    { description: 'Supermercado',          amount:  432.60, type: 'expense', date: d(2025, 11,  7), categoryId: ali.id },
    { description: 'iFood - Jantar',        amount:   89.90, type: 'expense', date: d(2025, 11, 14), categoryId: ali.id },
    { description: 'Restaurante Italiano',  amount:  156.00, type: 'expense', date: d(2025, 11, 22), categoryId: ali.id },
    { description: 'Gasolina',              amount:  280.00, type: 'expense', date: d(2025, 11,  6), categoryId: trans.id },
    { description: 'Uber',                  amount:   47.90, type: 'expense', date: d(2025, 11, 18), categoryId: trans.id },
    { description: 'Consulta Médica',       amount:  250.00, type: 'expense', date: d(2025, 11, 20), categoryId: sau.id },
    { description: 'Farmácia',              amount:   78.40, type: 'expense', date: d(2025, 11, 21), categoryId: sau.id },
    { description: 'Netflix',               amount:   55.90, type: 'expense', date: d(2025, 11, 10), categoryId: ent.id },
    { description: 'Cinema',               amount:   64.00, type: 'expense', date: d(2025, 11, 25), categoryId: ent.id },
    { description: 'Roupa - Zara',          amount:  349.00, type: 'expense', date: d(2025, 11, 28), categoryId: comp.id },

    // ─── Dezembro 2025 ────────────────────────────────────
    { description: 'Salário Dezembro',      amount: 7200.00, type: 'income',  date: d(2025, 12,  5), categoryId: sal.id },
    { description: '13º Salário',           amount: 6500.00, type: 'income',  date: d(2025, 12, 10), categoryId: sal.id },
    { description: 'Rendimento Tesouro',    amount:  214.30, type: 'income',  date: d(2025, 12, 15), categoryId: inv.id },
    { description: 'Aluguel',               amount: 1800.00, type: 'expense', date: d(2025, 12,  5), categoryId: mor.id },
    { description: 'Conta de Luz',          amount:  158.20, type: 'expense', date: d(2025, 12,  8), categoryId: mor.id },
    { description: 'Ceia de Natal',         amount:  520.00, type: 'expense', date: d(2025, 12, 24), categoryId: ali.id },
    { description: 'Supermercado',          amount:  398.70, type: 'expense', date: d(2025, 12, 12), categoryId: ali.id },
    { description: 'Gasolina',              amount:  300.00, type: 'expense', date: d(2025, 12,  3), categoryId: trans.id },
    { description: 'Passagem Aérea',        amount:  890.00, type: 'expense', date: d(2025, 12, 15), categoryId: trans.id },
    { description: 'Presentes de Natal',    amount:  650.00, type: 'expense', date: d(2025, 12, 20), categoryId: comp.id },
    { description: 'Fone Bluetooth',        amount:  299.00, type: 'expense', date: d(2025, 12, 26), categoryId: comp.id },
    { description: 'Spotify + Disney+',     amount:   67.80, type: 'expense', date: d(2025, 12, 10), categoryId: ent.id },
    { description: 'Confraternização',      amount:  120.00, type: 'expense', date: d(2025, 12, 18), categoryId: ent.id },

    // ─── Janeiro 2026 ─────────────────────────────────────
    { description: 'Salário Janeiro',       amount: 6500.00, type: 'income',  date: d(2026,  1,  5), categoryId: sal.id },
    { description: 'Consultoria Projeto',   amount: 2500.00, type: 'income',  date: d(2026,  1, 20), categoryId: sal.id },
    { description: 'Dividendos',            amount:  340.00, type: 'income',  date: d(2026,  1, 15), categoryId: inv.id },
    { description: 'Aluguel',               amount: 1800.00, type: 'expense', date: d(2026,  1,  5), categoryId: mor.id },
    { description: 'IPTU Parcela 1',        amount:  420.00, type: 'expense', date: d(2026,  1, 10), categoryId: mor.id },
    { description: 'Supermercado',          amount:  467.30, type: 'expense', date: d(2026,  1,  8), categoryId: ali.id },
    { description: 'Restaurante',           amount:   98.00, type: 'expense', date: d(2026,  1, 16), categoryId: ali.id },
    { description: 'Gasolina',              amount:  260.00, type: 'expense', date: d(2026,  1,  4), categoryId: trans.id },
    { description: 'Manutenção Carro',      amount:  380.00, type: 'expense', date: d(2026,  1, 22), categoryId: trans.id },
    { description: 'Academia',              amount:   99.90, type: 'expense', date: d(2026,  1,  2), categoryId: sau.id },
    { description: 'Plano de Saúde',        amount:  380.00, type: 'expense', date: d(2026,  1,  5), categoryId: sau.id },
    { description: 'Netflix',               amount:   55.90, type: 'expense', date: d(2026,  1, 10), categoryId: ent.id },
    { description: 'Calçado - Nike',        amount:  459.00, type: 'expense', date: d(2026,  1, 25), categoryId: comp.id },

    // ─── Maio 2026 (mês atual) ────────────────────────────
    { description: 'Salário Maio',          amount: 6500.00, type: 'income',  date: d(2026,  5,  5), categoryId: sal.id },
    { description: 'Freelance App',         amount: 1800.00, type: 'income',  date: d(2026,  5, 10), categoryId: sal.id },
    { description: 'Rendimento FII',        amount:  290.00, type: 'income',  date: d(2026,  5, 15), categoryId: inv.id },
    { description: 'Aluguel',               amount: 1800.00, type: 'expense', date: d(2026,  5,  5), categoryId: mor.id },
    { description: 'Conta de Luz',          amount:  122.40, type: 'expense', date: d(2026,  5,  8), categoryId: mor.id },
    { description: 'Internet',              amount:   99.90, type: 'expense', date: d(2026,  5, 10), categoryId: mor.id },
    { description: 'Supermercado',          amount:  389.50, type: 'expense', date: d(2026,  5,  7), categoryId: ali.id },
    { description: 'iFood - Almoço',        amount:   62.90, type: 'expense', date: d(2026,  5, 13), categoryId: ali.id },
    { description: 'Gasolina',              amount:  270.00, type: 'expense', date: d(2026,  5,  4), categoryId: trans.id },
    { description: 'Uber',                  amount:   38.50, type: 'expense', date: d(2026,  5, 20), categoryId: trans.id },
    { description: 'Consulta Médica',       amount:  200.00, type: 'expense', date: d(2026,  5, 18), categoryId: sau.id },
    { description: 'Netflix',               amount:   55.90, type: 'expense', date: d(2026,  5, 10), categoryId: ent.id },
    { description: 'Camisa - Farm',         amount:  189.00, type: 'expense', date: d(2026,  5, 22), categoryId: comp.id },
  ]

  await prisma.transaction.createMany({
    data: txs.map((tx) => ({ ...tx, userId: user.id })),
  })
  console.log(`💰  ${txs.length} transações criadas`)

  // ── Resumo ────────────────────────────────────────────────
  console.log('\n✅  Seed concluído com sucesso!')
  console.log('────────────────────────────────')
  console.log(`📧  E-mail : ${EMAIL}`)
  console.log(`🔑  Senha  : ${SENHA}`)
  console.log('────────────────────────────────\n')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
