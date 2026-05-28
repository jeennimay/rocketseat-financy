# Financy 💚

Aplicação full-stack de gerenciamento de finanças pessoais desenvolvida como projeto de conclusão de pós-graduação na **Rocketseat**.

## Visão Geral

O Financy permite que o usuário controle suas receitas e despesas por meio de uma interface moderna e responsiva, conectada a uma API GraphQL segura com autenticação JWT.

## Funcionalidades

- **Autenticação** — cadastro e login com JWT
- **Dashboard** — saldo total, receitas e despesas do mês, transações recentes
- **Transações** — criar, editar, excluir e listar com filtros por tipo, categoria e período
- **Categorias** — criar, editar, excluir e listar com ícone e cor personalizados
- **Perfil** — visualização e edição dos dados do usuário

## Stack Tecnológica

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js + TypeScript | 5.x | Runtime e linguagem |
| GraphQL + TypeGraphQL | 2.x | Camada de API |
| Apollo Server | 5.x | Servidor GraphQL |
| Prisma | 6.x | ORM e migrations |
| SQLite | — | Banco de dados |
| JWT (jsonwebtoken) | 9.x | Autenticação |
| bcryptjs | 3.x | Hash de senhas |
| Express | 5.x | HTTP server |

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19.x | Interface |
| TypeScript | 5.x | Tipagem |
| Vite | 7.x | Bundler |
| Apollo Client | 4.x | Cliente GraphQL |
| TailwindCSS | 3.x | Estilização |
| Zustand | 5.x | Estado global (auth) |
| Lucide React | — | Ícones |
| Sonner | — | Notificações toast |

### Testes
| Ferramenta | Onde | Tipo |
|---|---|---|
| Jest + RTL | Frontend | Unitários (atoms, molecules, hooks, utils) |
| Jest | Backend | Unitários (services, utils, errors) |
| Playwright | E2E | Integração (auth, dashboard, transações, categorias) |

## Arquitetura

```
rocketseat-financy/
├── backend/          # API GraphQL
│   └── src/
│       ├── config/         # Variáveis de ambiente centralizadas
│       ├── errors/         # Erros tipados (NotFound, Conflict, Unauthorized)
│       ├── repositories/   # Camada de acesso ao Prisma
│       ├── services/       # Regras de negócio
│       ├── resolvers/      # Endpoints GraphQL (TypeGraphQL)
│       ├── models/         # ObjectTypes do GraphQL
│       ├── dtos/           # InputTypes do GraphQL
│       ├── middlewares/    # Auth middleware
│       └── utils/          # JWT e hash
│
├── frontend/         # SPA React
│   └── src/
│       ├── components/
│       │   ├── atoms/      # Button, Badge, IconButton
│       │   └── molecules/  # FormField, SummaryCard, EmptyState, ActionButtons
│       ├── hooks/          # useTransactions, useCategories, usePagination
│       ├── pages/          # Auth, Dashboard, Transactions, Categories, Profile
│       ├── stores/         # Auth store (Zustand + persist)
│       ├── utils/          # formatCurrency, formatDate
│       └── lib/graphql/    # Queries e mutations Apollo
│
└── e2e/              # Testes end-to-end (Playwright)
    ├── helpers/      # Autenticação e requests GraphQL
    └── tests/        # auth, dashboard, transactions, categories
```

## Padrões de Design Aplicados

### Backend
- **Repository Pattern** — isola o Prisma dos Services; trocar ORM afeta só os repositórios
- **Custom Errors** — hierarquia `AppError → NotFoundError / ConflictError / UnauthorizedError`
- **Config centralizado** — `env.ts` valida env vars na inicialização

### Frontend
- **Atomic Design** — `atoms → molecules → organisms (pages)`
- **Custom Hooks** — `useTransactions`, `useCategories`, `usePagination`
- **Utils puras** — `formatCurrency`, `formatDate` testáveis isoladamente

## Como Executar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
cp .env.example .env       # configure JWT_SECRET
npm install
npm run migrate            # cria o banco SQLite e roda migrations
npm run dev                # http://localhost:4000/graphql
```

### Frontend

```bash
cd frontend
cp .env.example .env       # VITE_BACKEND_URL=http://localhost:4000
npm install
npm run dev                # http://localhost:5173
```

## Testes

### Backend (Jest — unitários)
```bash
cd backend
npm test
# 48 testes | 6 suites
```

### Frontend (Jest + RTL — unitários)
```bash
cd frontend
npm test
# 45 testes | 8 suites
```

### E2E (Playwright — integração)
```bash
# Com os dois servidores rodando:
cd e2e
npm test
```

## Variáveis de Ambiente

### `backend/.env.example`
```env
JWT_SECRET=               # segredo para assinar tokens JWT
DATABASE_URL=file:./dev.db
CORS_ORIGIN=http://localhost:5173
```

### `frontend/.env.example`
```env
VITE_BACKEND_URL=http://localhost:4000
```

## Autor

Desenvolvido por **Jennifer Mayumi** — Pós-Graduação Full-Stack, Rocketseat 2025.
