# Financy — Backend

API GraphQL para gerenciamento de finanças pessoais, construída com TypeGraphQL, Apollo Server, Prisma e SQLite.

## Stack

- **TypeScript** + **Node.js**
- **GraphQL** via TypeGraphQL 2.x
- **Apollo Server** 5.x + Express 5.x
- **Prisma** 6.x → SQLite
- **JWT** (jsonwebtoken) + **bcryptjs**

## Estrutura

```
src/
├── config/
│   └── env.ts                 # Lê e valida variáveis de ambiente
├── errors/
│   ├── AppError.ts            # Classe base (message + statusCode)
│   ├── NotFoundError.ts       # 404
│   ├── ConflictError.ts       # 409
│   └── UnauthorizedError.ts   # 401
├── repositories/              # Acesso direto ao Prisma (Repository Pattern)
│   ├── user.repository.ts
│   ├── category.repository.ts
│   └── transaction.repository.ts
├── services/                  # Regras de negócio
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── transaction.service.ts
├── resolvers/                 # Endpoints GraphQL
│   ├── auth.resolver.ts
│   ├── category.resolver.ts
│   └── transaction.resolver.ts
├── models/                    # ObjectTypes
├── dtos/                      # InputTypes
├── middlewares/
│   └── auth.middleware.ts     # Verifica JWT (IsAuth)
├── graphql/
│   ├── context/               # Extrai userId do Bearer token
│   └── decorators/            # @GqlUser
└── utils/
    ├── hash.ts                # hashPassword, comparePassword
    └── jwt.ts                 # signJwt, verifyJwt
```

## Camadas (Repository Pattern)

```
Resolver  →  Service  →  Repository  →  Prisma  →  SQLite
   ↑             ↑              ↑
 GraphQL    regras de       queries
 endpoint    negócio          ORM
```

Os **Services** nunca importam o Prisma diretamente. Toda query ao banco passa pelos **Repositories**, tornando os Services testáveis com mocks simples.

## Configuração

```bash
cp .env.example .env
npm install
npm run migrate   # cria dev.db e aplica migrations
npm run dev       # tsx watch — hot reload
```

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `JWT_SECRET` | ✅ | Segredo para assinar tokens |
| `DATABASE_URL` | ✅ | `file:./prisma/dev.db` |
| `CORS_ORIGIN` | ❌ | Padrão: `http://localhost:5173` |
| `PORT` | ❌ | Padrão: `4000` |

## API GraphQL

### Mutations de Autenticação
```graphql
mutation Register($data: RegisterInput!) {
  register(data: $data) { token refreshToken user { id name email } }
}

mutation Login($data: LoginInput!) {
  login(data: $data) { token refreshToken user { id name email } }
}
```

### Queries/Mutations protegidas (requer `Authorization: Bearer <token>`)
```graphql
query { me { id name email } }
query { listCategories { id name color icon } }
query { listTransactions { id description amount type date category { name } } }

mutation CreateCategory($data: CreateCategoryInput!) { ... }
mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) { ... }
mutation DeleteCategory($id: String!) { ... }

mutation CreateTransaction($data: CreateTransactionInput!) { ... }
mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) { ... }
mutation DeleteTransaction($id: String!) { ... }
```

## Testes

```bash
npm test            # roda todos os testes
npm run test:watch  # modo watch
npm run test:coverage
```

**Cobertura:** 48 testes | 6 suites

| Suite | Testes |
|---|---|
| `utils/hash` | hashPassword, comparePassword |
| `utils/jwt` | signJwt, verifyJwt, expiração |
| `errors/AppError` | hierarquia de erros tipados |
| `services/AuthService` | login, register, me |
| `services/CategoryService` | CRUD + isolamento por userId |
| `services/TransactionService` | CRUD + isolamento por userId |
