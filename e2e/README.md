# Financy — Testes E2E (Playwright)

Testes end-to-end que validam o projeto completo com backend + frontend rodando em conjunto.

## Stack

- **Playwright** — automação de browser (Chromium)

## O que é testado

| Arquivo | Cenários |
|---|---|
| `auth.spec.ts` | Login válido, senha errada, cadastro, proteção de rota, logout |
| `dashboard.spec.ts` | Cards de resumo, modal de nova transação, links de navegação |
| `transactions.spec.ts` | Criar despesa, criar receita, editar, excluir, filtrar por tipo |
| `categories.spec.ts` | Estado vazio, criar, cards de resumo atualizados, editar, excluir |

## Pré-requisitos

Ambos os servidores devem estar rodando antes de executar os testes:

```bash
# Terminal 1
cd ../backend && npm run dev    # porta 4000

# Terminal 2
cd ../frontend && npm run dev   # porta 5173
```

## Executar

```bash
cd e2e
npm install
npm test                 # headless (padrão)
npm run test:headed      # com janela do browser visível
npm run test:ui          # interface interativa do Playwright
npm run test:report      # abre o relatório HTML do último run
```

## Estratégia de Isolamento

Cada suite de teste registra um **usuário único** via API GraphQL antes de executar:

```typescript
// helpers/auth.ts
const auth = await registerTestUser(request)
// → email único por timestamp + random suffix
// → injeta token no localStorage (Zustand persist)
// → sem interferência entre suites paralelas
```

Isso garante que dados criados em um teste não afetam outros, sem necessidade de limpar banco entre runs.

## Estrutura

```
e2e/
├── helpers/
│   ├── api.ts      # gqlRequest(query, token?) — helper HTTP para GraphQL
│   └── auth.ts     # registerTestUser() + loginViaLocalStorage()
├── tests/
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   ├── transactions.spec.ts
│   └── categories.spec.ts
└── playwright.config.ts
```
