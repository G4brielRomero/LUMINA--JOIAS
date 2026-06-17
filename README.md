# ✦ Lumina Joias

Sistema de Gerenciamento de Loja de Joias — aplicação web fullstack para controle de produtos, clientes e pedidos.

---

## Sobre o Projeto

O **Lumina Joias** é uma plataforma de gestão especializada para lojas de joias, desenvolvida como projeto acadêmico para a disciplina de Análise e Projeto de Aplicações Web. O sistema oferece uma interface elegante e intuitiva para o controle completo do negócio.

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
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT + bcrypt |
| Documentação API | Swagger |

---

## Estrutura do Repositório

```
lumina-joias/
├── backend/          # API REST (NestJS)
│   ├── src/
│   │   ├── auth/         # Login, registro e JWT Guard
│   │   ├── products/     # CRUD de produtos
│   │   ├── customers/    # CRUD de clientes
│   │   ├── orders/       # Gestão de pedidos
│   │   └── dashboard/    # Métricas e KPIs
│   └── prisma/           # Schema e migrations
└── frontend/         # Interface web (Next.js)
    └── src/
        ├── app/          # Páginas (App Router)
        ├── components/   # Componentes reutilizáveis
        ├── contexts/     # AuthContext (JWT)
        └── services/     # Chamadas à API
```

---

## Como Rodar Localmente

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

# Criar o banco de dados (no PostgreSQL)
# CREATE DATABASE lumina_joias;

# Aplicar migrações
npx prisma migrate deploy

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

Aplicação disponível em: `http://localhost:3000` (ou outra porta disponível)

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
| João Pedro de Melo Hentz | — |

---

## Licença

Projeto acadêmico — uso educacional.
