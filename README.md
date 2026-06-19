# ✦ Lumina Joias

Sistema de Gerenciamento de Loja de Joias — aplicação web fullstack para controle de produtos, clientes e pedidos.

---

## Sobre o Projeto

O **Lumina Joias** é uma plataforma de gestão especializada para lojas de joias, desenvolvida como projeto acadêmico para a disciplina de Análise e Projeto de Aplicações Web. O sistema oferece uma interface elegante e intuitiva para o controle completo do negócio.

### Documentação do Projeto

Para mais detalhes sobre a modelagem, requisitos e arquitetura do sistema, acesse a [Documentação Técnica do Lumina Joias](https://drive.google.com/file/d/1NM1WMjrV38kQ5vShf_Hc0Z0qTOWOPOfg/view?usp=sharing).

### Funcionalidades

- **Autenticação** — Cadastro e login com JWT, perfis de Administrador e Vendedor
- **Produtos** — CRUD completo de joias com controle de estoque, materiais, pedras e preços
- **Clientes** — Cadastro com CPF, histórico de pedidos e busca por nome ou CPF
- **Pedidos** — Criação de pedidos com múltiplos itens, filtros por status e data
- **Dashboard** — Painel com KPIs de faturamento, estoque baixo e vendas recentes

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + Tailwind CSS v4 + TypeScript |
| Backend | NestJS (Node.js) + TypeScript |
| Banco de dados | PostgreSQL 16 |
| ORM | Prisma 7 |
| Autenticação | JWT + bcrypt |
| Documentação API | Swagger |
| Containerização | Docker + Docker Compose |

---

## Estrutura do Repositório

```
lumina-joias/
├── docker-compose.yml    # Orquestra todos os serviços
├── backend/              # API REST (NestJS)
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts       # Dados iniciais
│   └── src/
│       ├── auth/         # Login, registro e JWT Guard
│       ├── products/     # CRUD de produtos
│       ├── customers/    # CRUD de clientes
│       ├── orders/       # Gestão de pedidos
│       └── dashboard/    # Métricas e KPIs
└── frontend/             # Interface web (Next.js)
    ├── Dockerfile
    └── src/
        ├── app/          # Páginas (App Router)
        ├── components/   # Componentes reutilizáveis
        ├── contexts/     # AuthContext (JWT)
        └── services/     # Chamadas à API
```

---

## Rodando com Docker *(recomendado)*

A forma mais simples de rodar o projeto. Requer apenas o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado — sem necessidade de instalar Node.js, PostgreSQL ou configurar variáveis de ambiente.

```bash
docker compose up
```

O comando sobe os três serviços automaticamente:

| Ordem | Serviço | O que faz |
|-------|---------|-----------|
| 1º | `postgres` | Sobe o banco de dados PostgreSQL |
| 2º | `backend` | Aplica migrações → popula seed → inicia a API |
| 3º | `frontend` | Builda e serve a interface web |

### URLs após subir

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend / API | http://localhost:3000 |
| Swagger (docs) | http://localhost:3000/api |

### Usuários criados pelo seed

| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@luminajoias.com | admin123 | Administrador |
| vendedor@luminajoias.com | vendedor123 | Vendedor |

### Comandos úteis

```bash
# Rodar em segundo plano
docker compose up -d

# Ver logs
docker compose logs -f

# Parar os serviços
docker compose down

# Parar e apagar os dados do banco
docker compose down -v

# Rebuildar as imagens após mudanças no código
docker compose up --build
```

---

## Rodando Localmente *(sem Docker)*

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente

### Backend

```bash
# Entrar na pasta
cd backend

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL e JWT_SECRET

# Criar o banco no PostgreSQL
# CREATE DATABASE lumina_joias;

# Gerar o Prisma Client
npx prisma generate

# Aplicar migrações
npx prisma migrate deploy

# Popular o banco com dados iniciais
npx prisma db seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

API disponível em: `http://localhost:3000`  
Documentação Swagger: `http://localhost:3000/api`

### Frontend

```bash
# Entrar na pasta
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

Aplicação disponível em: `http://localhost:3001`

---

## Principais Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastrar usuário |
| POST | `/auth/login` | Autenticar e receber JWT |
| GET | `/products` | Listar produtos (com filtros) |
| POST | `/products` | Cadastrar produto |
| PATCH | `/products/:id` | Editar produto |
| DELETE | `/products/:id` | Soft delete do produto |
| GET | `/customers` | Listar clientes |
| POST | `/customers` | Cadastrar cliente |
| GET | `/orders` | Listar pedidos |
| POST | `/orders` | Criar pedido |
| PATCH | `/orders/:id/status` | Atualizar status do pedido |
| GET | `/dashboard` | Dados do painel |

---

## Contribuidores

| Nome | GitHub |
|------|--------|
| Gabriel Romero | [@G4brielRomero](https://github.com/G4brielRomero) |
| Willian Charantola da Costa | [@willian-charantola](https://github.com/willian-charantola) |
| João Pedro de Melo Hentz | — | [@joaohentz] (https://github.com/joaohentz)

---

## Licença

Projeto acadêmico — uso educacional.
