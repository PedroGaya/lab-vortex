# lab-vortex

Desafio para processo seletivo do Laboratório Vortex.

# Instalação

Primeiro, instalar o runtime Bun:

```bash
curl -fsSL https://bun.com/install | bash # macOS, Linux, and WSL
```

```bash
powershell -c "irm bun.sh/install.ps1|iex" # Windows
```

Para rodar o servidor, crie o arquivo `./server/.env`:

```bash
APP_HOST="localhost"
APP_PORT="4000"

JWT_SECRET="HERE'S JOHNNY WEB TOKEN!"

DATABASE_URL="file:./dev.db"
```

Depois, configure o banco de dados:

```bash
bun install
cd server
bunx run prisma migrate --dev
```

Para rodar o site e servidor:

```bash
cd site
bun install
bun run dev
```

```bash
cd server
bun install
bun run dev
```

Para acessar o site, visite `localhost:3000`.

# Stack

Foi utilizado o runtime `Bun` para `TypeScript`.

- Servidor:
  - Elysia
  - Prisma ORM
  - SQLite
  - bcrypt
- Site:
  - Vite
  - React
    - TanStack Query
    - TanStack Router

## Justificativas

Para manter paridade de linguagens de programação, sistemas de gerenciamento de dependências e runtimes entre o site e servidor, o ambiente `TypeScript` foi utilizado.

O ambiente `Bun` funciona como um _drop in replacement_ para o `npm` e `Node`, entregando velocidades mais altas, api de testes integrada e função de _watch_ - Tudo "out of the box", sem bibliotecas de terceiros.

`Prisma` e `Elysia` foram escolhidos, principalmente, por familiaridade, além de serem recomendações "padrão" para novos projetos no ecossistema.

O servidor `Elysia` proporciona tipagem ao longo de toda a cadeia da rota, middlewares inclusos, bons benchmarks e uma API reminiscente do `express`.

A ORM `Prisma` abstrai a necessidade de SQL com uma elegante linguagem de schema, mas mantém a capacidade de construção de queries de SQL via código, além de inspeção em tempo real do banco e de queries.

Para a maioria dos projetos, procuro desculpas para NÃO utilizar o `SQLite` - Não encontrei nenhuma aqui, então sigo com a sua simplicidade.

Para o site, o `Vite` segue como uma das melhores soluções para bundling, com configuração simples, ecosistema robusto e boa velocidade. Como quis implementar funcionalidades como atualizações em tempo real e cookies, decidi utilizar framework - `React` é a única que sei utilizar.

As bibliotecas `TanStack` proporcionam uma API "sã", com baixo overhead e boilerplate, para a resolução de problemas típicos do front-end. No caso, o roteamento entre telas em SPA e queries dinâmicas para o servidor. Além disso, o `Vite` proporciona templates prontos para essas bibliotecas.

# Detalhes

Abaixo, segue detalhes técnicos da implementação dos requisitos listados pelo edital.

## API

O servidor expõe as seguintes rotas:

```http
## Expect {
##   message: string,
##   user: {
##    id: string,
##    name: string,
##    email: string,
##    refCode: string,
##    refCount: number
##   }
## } Code 200
## Error: { error: string } Code 401, 500
GET /user/me

## Expect: {
##   message: string,
##   user: {
##    id: string,
##    name: string,
##    email: string,
##    refCode: string,
##    refCount: number
##   }
## } Code 201
## Error: { error: string } Code 401, 500
POST /user/register?ref=refCode
Content-Type: application/json
  {
    "name": string,
    "email": string,
    "pwd": string,
    "referred": boolean
  }

## Expect: {
##   message: string,
##   user: {
##    id: string,
##    name: string,
##    email: string,
##    refCode: string,
##    refCount: number
##   }
## } Code 200
## Error: { error: string } Code 401, 500
POST /user/login
Content-Type: application/json
   {
     "identifier": string,
     "pwd": string
   }

## Expect: {
##   message: string,
## } Code 200
## Error: { error: string } Code 500
POST /user/logout

## Expect: {
##   message: string,
##   user: {
##    id: string,
##    name: string,
##    email: string,
##    refCode: string,
##    refCount: number
##   }
## } Code 200
## Error: { error: string } Code 401, 500
DELETE /user
```

O site, uma SPA, interage com o servidor por meio de rotas, além da raiz. Todas as rotas e páginas fazem uso de cookies e JWT para autenticação.

A contagem de indicações é feita automaticamente pelo servidor, necessitando apenas o registro de um novo usuário com código de indicação (`refCode`) apropriado. A validação de campos é feita pelo próprio site, mas autenticação é resolvida pelo servidor (via cookies).

## Banco De Dados

O banco, em SQLite, segue o seguinte schema:

```prisma
model User {
  id       String @id @default(uuid())
  name     String @unique
  email    String @unique
  pwd      String // Hashed, salted
  refCount Int    @default(0)
  refCode  String @unique

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt()

  referrals Referral[]
}

model Referral {
  id              String  @id @default(uuid())
  fromUserId      String
  followedThrough Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt()

  from User @relation(fields: [fromUserId], references: [id], onDelete: Cascade)
}
```

Ele pode ser inspecionado pelo seguinte comando:

```bash
bunx run prisma studio
```

## Arquitetura

A arquitetura proposta proporciona fácil extensão, tendo possibilidades de escalamento, implementação de cachê, inclusão de metadados em indicações, rastreio de cliques não-convertidos, etc.

Para gerar builds de produção:

```bash
cd site
bun install
bun run build
# Arquivos estarão em ./site/dist
```

```bash
cd server
bun install
bun run build
# Arquivos estarão em ./server/build
```

Para deploys pequenos, recomendo uma VPS com nginx/apache. Para deploys maiores, utilizar Docker (Dockerfiles não inclusos).

## Testes

Não foram providenciados testes unitários ou de integração.

# Colaboração com IA

A LLM `DeepSeek` foi utilizada para gerar todos os arquivos de CSS do projeto, recebendo como entrada TSX, com classes pré-definidas. O CSS gerado funcionou sem necessidade de alterações. A escolha de tecnologias, estruturação do código e lógica de programação foram feitas a mão.
