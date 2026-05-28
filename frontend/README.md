# Financy — Frontend

SPA React para gerenciamento de finanças pessoais, conectada à API GraphQL do Financy Backend.

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Apollo Client 4** — cliente GraphQL
- **TailwindCSS 3** — estilização
- **Zustand 5** — estado global de autenticação (persiste no localStorage)
- **Lucide React** — ícones
- **Sonner** — toasts/notificações

## Páginas

| Rota | Página | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/signup` | Cadastro | Público |
| `/` | Dashboard | Autenticado |
| `/transactions` | Transações | Autenticado |
| `/categories` | Categorias | Autenticado |
| `/profile` | Perfil | Autenticado |

## Estrutura (Atomic Design)

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.tsx        # primary | outline | ghost + loading
│   │   ├── Badge.tsx         # pílula colorida (categorias)
│   │   └── IconButton.tsx    # botão ícone (default | danger)
│   ├── molecules/
│   │   ├── FormField.tsx     # label + slot de input + ícone prefixo
│   │   ├── SummaryCard.tsx   # card de estatística (ícone + label + valor)
│   │   ├── EmptyState.tsx    # estado vazio com ação opcional
│   │   └── ActionButtons.tsx # par trash + edit encapsulado
│   ├── CategoryIcon.tsx      # ícone de categoria com cor
│   ├── Header.tsx
│   └── Layout.tsx
├── hooks/
│   ├── useTransactions.ts    # query + delete mutation encapsulados
│   ├── useCategories.ts      # query + delete mutation encapsulados
│   └── usePagination.ts      # página, totalPages, next, prev, reset
├── pages/
│   ├── Auth/                 # Login.tsx, Signup.tsx
│   ├── Dashboard/
│   ├── Transactions/         # index.tsx + TransactionDialog.tsx
│   ├── Categories/           # index.tsx + CategoryDialog.tsx
│   └── Profile/
├── stores/
│   └── auth.ts               # Zustand + persist (key: 'financy-auth')
├── utils/
│   └── format.ts             # formatCurrency, formatDate
└── lib/graphql/
    ├── apollo.ts             # ApolloClient com authLink (Bearer token)
    ├── mutations/            # category.ts, transaction.ts, Login.ts, Register.ts
    └── queries/              # categories.ts, transactions.ts
```

## Configuração

```bash
cp .env.example .env   # VITE_BACKEND_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:5173
```

### Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_BACKEND_URL` | URL do backend (ex: `http://localhost:4000`) |

## Testes

```bash
npm test             # roda todos os testes
npm run test:watch   # modo watch
npm run test:coverage
```

**Cobertura:** 45 testes | 8 suites

| Suite | O que testa |
|---|---|
| `atoms/Button` | render, click, disabled, loading, variantes |
| `atoms/Badge` | render, cores aplicadas via style |
| `atoms/IconButton` | render, click, variantes (danger/default) |
| `molecules/SummaryCard` | label, value, icon, iconBg |
| `molecules/EmptyState` | mensagem, ação opcional |
| `molecules/FormField` | label, opcional, slot, ícone prefixo |
| `hooks/usePagination` | page, totalPages, next, prev, reset, paged |
| `utils/format` | formatCurrency, formatDate (com locale pt-BR) |

## Build de Produção

```bash
npm run build   # gera dist/ — TypeScript + Vite
```
