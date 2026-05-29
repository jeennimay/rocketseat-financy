# Guia de Contribuição — Financy

## Fluxo de desenvolvimento recomendado

```
Style Guide (tokens, cores, tipografia)
        ↓
Atoms (Button, Badge, IconButton, Skeleton)
        ↓
Molecules (FormField, SummaryCard, EmptyState, ActionButtons)
        ↓
Organisms (Header, Layout)
        ↓
Pages (Dashboard, Transactions, Categories, Profile)
```

Sempre construa de baixo para cima. Defina os tokens e componentes base antes de criar páginas.

---

## Estrutura de pastas

### Frontend (`frontend/src/`)

```
components/
  atoms/        ← primitivos sem dependências de negócio
  molecules/    ← composições de atoms
  organisms/    ← Header, Layout (complexos, com contexto)
  ui/           ← shadcn/radix (não editar diretamente)
hooks/          ← useTransactions, useCategories, usePagination
pages/          ← uma pasta por rota; componentes locais em components/
stores/         ← estado global (Zustand)
utils/          ← funções puras (format.ts)
lib/graphql/    ← queries, mutations, apollo client
```

### Backend (`backend/src/`)

```
config/         ← variáveis de ambiente centralizadas (env.ts)
errors/         ← hierarquia de erros tipados
repositories/   ← acesso ao Prisma (única camada que importa prismaClient)
services/       ← regras de negócio (dependem de repositories via injeção)
resolvers/      ← endpoints GraphQL (dependem de services)
models/         ← ObjectTypes do TypeGraphQL
dtos/           ← InputTypes do TypeGraphQL
middlewares/    ← IsAuth
utils/          ← hash, jwt
```

---

## Padrões de código

### Componentes React

- Nomes em **PascalCase**: `Button.tsx`, `SummaryCard.tsx`
- Props tipadas com `interface Props`; sem `React.FC`
- Sem comentários óbvios; apenas WHY, nunca WHAT
- Usar `@/` para imports absolutos (alias configurado no vite/tsconfig)

### Atoms

- Sem dependências de Apollo, Zustand ou hooks de negócio
- Aceitam somente props primitivas ou `React.ReactNode`
- Devem ter teste unitário em `src/__tests__/atoms/`

### Molecules

- Podem compor atoms entre si
- Sem chamadas de API
- Devem ter teste unitário em `src/__tests__/molecules/`

### Hooks

- `useTransactions`, `useCategories`: encapsulam Apollo + toast
- `usePagination`: lógica pura, deve ter teste em `src/__tests__/hooks/`

### Backend — camadas

| Camada | Pode importar |
|---|---|
| `resolvers/` | `services/`, DTOs, middlewares |
| `services/` | `repositories/`, `errors/`, `utils/` |
| `repositories/` | `prismaClient`, DTOs |

Nunca importe `prismaClient` diretamente em services ou resolvers.

---

## Testes

### Frontend (Jest + React Testing Library)

```bash
cd frontend
npm test              # todos os testes
npm run test:watch    # modo watch
npm run test:coverage # relatório de cobertura
```

**Regra:** todo atom e molecule deve ter um arquivo `.test.tsx` correspondente.

### Backend (Jest)

```bash
cd backend
npm test
```

**Regra:** todo service deve ter um arquivo `.test.ts` testando os cenários de erro e sucesso com repositórios mockados.

### E2E (Playwright)

```bash
# com backend (:4000) e frontend (:5173) rodando:
cd e2e
npm test
```

---

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): descrição curta em minúsculo
fix(scope): descrição
refactor(scope): descrição
test(scope): descrição
docs(scope): descrição
```

Exemplos:
```
feat(transactions): adiciona filtro por periodo
fix(dashboard): cards zerados no mes atual
refactor(backend): repository pattern nas services
test(atoms): testes para Button e Badge
```

---

## Variáveis de ambiente

- **Nunca** commitar arquivos `.env` (estão no `.gitignore`)
- Sempre manter `.env.example` atualizado ao adicionar novas variáveis
- `CORS_ORIGIN` em produção deve conter domínios explícitos (sem `*`), pois `credentials: true` exige origem específica

---

## Pull Requests

1. Branch a partir de `main`: `git checkout -b feat/nome-da-feature`
2. Testes devem passar: `npm test` em backend e frontend
3. Build deve passar: `npm run build` no frontend
4. PR com descrição clara do que foi feito e por quê
