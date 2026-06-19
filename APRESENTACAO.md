# ✦ Lumina Joias — Roteiro de Apresentação

Disciplina: Análise e Projeto de Aplicações Web
Prof. Dr. Vitor Mesaque A. Lima

---

## Divisão por Apresentador

| # | Apresentador | Tema |
|---|---|---|
| 1 | Gabriel Romero | Visão geral, arquitetura e backend |
| 2 | Willian Charantola da Costa | Frontend e demonstração do sistema |
| 3 | João Pedro de Melo Hentz | Modelo de dados, validações e encerramento |

---

---

# Apresentador 1 — Gabriel Romero

---

## Bloco 1 — Abertura e Visão Geral *(~3 min)*

> **Texto sugerido:**
>
> "Bom dia, professor. Meu nome é Gabriel Romero, e junto com Willian Charantola e João Pedro Hentz, desenvolvemos o **Lumina Joias** — um sistema web de gerenciamento para lojas de joias.
>
> A ideia do projeto surgiu de uma necessidade real do setor: lojas de joias costumam depender de planilhas ou sistemas genéricos que não atendem às particularidades do negócio. Não existe um lugar centralizado para controlar materiais preciosos, variações de produto como tipo de pedra e metal, nem para gerenciar pedidos personalizados com rastreamento de status.
>
> O Lumina Joias resolve isso com uma plataforma especializada, que oferece controle completo de produtos, clientes e pedidos, além de um painel de métricas para o gestor da loja.
>
> O sistema é voltado para três perfis: proprietários e gestores, que precisam de uma visão geral do negócio; vendedores e atendentes, que criam e acompanham pedidos no dia a dia; e futuramente clientes, que poderão consultar o histórico de compras."

---

## Bloco 2 — Requisitos Funcionais *(~4 min)*

> **Texto sugerido:**
>
> "O sistema foi construído com base em 24 requisitos funcionais, organizados em cinco módulos principais.
>
> O primeiro é a **Autenticação**: o sistema permite cadastro e login com e-mail e senha, logout seguro com invalidação do token, e proteção de todas as rotas para usuários autenticados. Também implementamos dois perfis de acesso — Administrador e Vendedor.
>
> O segundo módulo é a **Gestão de Produtos**. Aqui é possível cadastrar joias com todos os atributos relevantes para o setor: nome, descrição, material — como Ouro 18k ou Prata 925 —, tipo de pedra, peso em gramas, preço e quantidade em estoque. O sistema também suporta soft delete, ou seja, o produto é desativado sem ser apagado do banco, preservando o histórico de pedidos.
>
> O terceiro módulo é a **Gestão de Clientes**: cadastro com CPF validado, busca por nome ou CPF, edição de dados e visualização do histórico de pedidos de cada cliente.
>
> O quarto módulo é a **Gestão de Pedidos**: criação de pedidos associados a um cliente com múltiplos produtos, controle de status — Pendente, Confirmado, Entregue ou Cancelado — e visualização completa dos detalhes.
>
> Por fim, o **Dashboard**: um painel com os principais indicadores do negócio, como total de pedidos, faturamento e alertas de estoque baixo."

---

## Bloco 3 — Arquitetura e Stack Tecnológica *(~4 min)*

> **Texto sugerido:**
>
> "Vou apresentar agora as escolhas técnicas que fizemos e por quê.
>
> A aplicação é dividida em duas partes independentes: o **backend**, que é uma API REST, e o **frontend**, que é a interface web.
>
> Para o backend, escolhemos o **NestJS** — um framework Node.js com TypeScript nativo que nos dá uma estrutura modular muito organizada, separando claramente as responsabilidades em Controllers, Services e Guards. Para o banco de dados, usamos **PostgreSQL**, e o acesso é feito pelo **Prisma ORM**, que nos deu migrations automáticas e tipagem segura em todos os acessos ao banco. A autenticação é feita via **JWT com bcrypt**, o padrão de mercado para APIs REST stateless.
>
> Para o frontend, escolhemos o **Next.js 16** com o App Router, que nos permite usar Server e Client Components de forma eficiente. A estilização é feita com **Tailwind CSS v4**.
>
> A estrutura do repositório segue essa divisão: a pasta `backend` contém os módulos da API organizados por domínio — auth, products, customers, orders e dashboard —, além do schema do Prisma. A pasta `frontend` contém as páginas, componentes, contextos de estado e os serviços de chamada à API."

---

## Bloco 4 — Backend — API REST *(~4 min)*

> **Texto sugerido:**
>
> "Vou mostrar agora o backend em funcionamento. *(Abrir o Swagger em `http://localhost:3000/api`)*
>
> Aqui temos a documentação interativa da API gerada pelo Swagger, com todos os endpoints disponíveis organizados por módulo.
>
> O fluxo começa pela autenticação. Quando um usuário se cadastra via `POST /auth/register`, o sistema valida os dados, aplica o hash bcrypt na senha e salva no banco. Ao fazer login via `POST /auth/login`, o sistema valida as credenciais e retorna um token JWT.
>
> Esse token precisa ser enviado no cabeçalho de todas as requisições protegidas. Isso é garantido pelo **JwtAuthGuard**, que intercepta cada requisição e valida o token antes de deixar chegar ao controller.
>
> *(Demonstrar uma requisição sem token e mostrar o erro 401)*
>
> *(Adicionar o token e fazer uma requisição para `GET /products`)*
>
> Aqui podemos ver que, com o token válido, os produtos são retornados normalmente. Essa proteção está aplicada em todos os módulos — produtos, clientes, pedidos e dashboard.
>
> Com isso, encerro minha parte. Passo a palavra para o Willian, que vai mostrar o frontend e a demonstração completa do sistema."

---
---

# Apresentador 2 — Willian Charantola da Costa

---

## Bloco 5 — Frontend — Estrutura e Autenticação *(~3 min)*

> **Texto sugerido:**
>
> "Obrigado, Gabriel. Meu nome é Willian Charantola, e vou apresentar o frontend do Lumina Joias.
>
> O frontend foi desenvolvido com Next.js 16 utilizando o App Router, o que nos permite organizar as páginas em grupos de rotas. Temos o grupo de autenticação, com as páginas de login e cadastro, e o grupo do dashboard, que contém todas as páginas protegidas do sistema.
>
> A autenticação no frontend é gerenciada por um **AuthContext**: quando o usuário faz login, o token JWT é armazenado no localStorage e o estado do usuário é mantido em contexto global. Toda página do dashboard verifica esse estado — se o usuário não estiver autenticado, é redirecionado automaticamente para o login.
>
> Os serviços de comunicação com a API ficam centralizados na pasta `services`, onde cada módulo tem seu próprio arquivo. O token JWT é anexado automaticamente em todas as requisições por um interceptor do Axios.
>
> Vou mostrar agora o sistema em funcionamento. *(Abrir o navegador em `http://localhost:3001`)*
>
> O sistema redireciona automaticamente para o login. Vou fazer o cadastro de um novo usuário para demonstrar esse fluxo. *(Navegar para `/register`, preencher o formulário e cadastrar)* Percebam que o formulário valida os campos em tempo real — e-mail com formato correto, senha com mínimo de 8 caracteres. Agora vou fazer o login com o usuário administrador. *(Fazer login com `admin@luminajoias.com` / `admin123`)*"

---

## Bloco 6 — Demonstração — Dashboard *(~3 min)*

> **Texto sugerido:**
>
> "Após o login, somos direcionados ao **Dashboard**. Aqui o gestor tem uma visão imediata do negócio.
>
> Os quatro cards no topo mostram os principais indicadores: o total de pedidos realizados, o faturamento acumulado em reais, a quantidade de produtos com estoque crítico — abaixo de 5 unidades — e o total de clientes cadastrados.
>
> Logo abaixo temos duas seções: à esquerda, as **Vendas Recentes**, com os últimos pedidos, mostrando o cliente, o valor total e o status colorido de cada um. À direita, os **Produtos com Estoque Baixo**, para que o gestor saiba rapidamente quais itens precisam de reposição.
>
> Todos esses dados vêm do endpoint `GET /dashboard`, que o Gabriel mostrou anteriormente. O dashboard é atualizado a cada vez que a página é carregada."

---

## Bloco 7 — Demonstração — Produtos *(~4 min)*

> **Texto sugerido:**
>
> "Vou navegar agora para o módulo de **Produtos**. *(Clicar em Produtos na sidebar)*
>
> Aqui temos a listagem completa de todas as joias cadastradas. Podemos filtrar por nome — *(digitar algo no campo de busca)* — ou por material — *(selecionar um material no dropdown)*. Os resultados são filtrados automaticamente.
>
> Reparem nas badges de estoque: em verde quando o estoque está adequado, em amarelo para estoque baixo e em vermelho quando está zerado ou crítico. Isso facilita a identificação visual rápida.
>
> Vou cadastrar um novo produto para demonstrar o formulário. *(Clicar em 'Novo Produto')* O formulário tem todos os campos relevantes para uma joia: nome, descrição, material, tipo de pedra, peso em gramas, preço e quantidade em estoque. O sistema valida cada campo antes de enviar — por exemplo, o peso e o preço precisam ser maiores que zero. *(Preencher e salvar)*
>
> O produto aparece imediatamente na listagem. Também posso editar qualquer informação clicando no botão de edição — *(demonstrar edição)* — ou remover o produto, que faz um soft delete, mantendo o histórico intacto."

---

## Bloco 8 — Demonstração — Clientes e Pedidos *(~5 min)*

> **Texto sugerido:**
>
> "Agora vou mostrar o módulo de **Clientes**. *(Clicar em Clientes na sidebar)*
>
> Temos a listagem de todos os clientes com busca por nome ou CPF. O CPF é exibido já formatado. Vou abrir os detalhes de um cliente. *(Clicar em visualizar)*
>
> Aqui vemos todas as informações do cliente e, mais abaixo, o histórico completo de pedidos feitos por ele — com data, valor e status de cada um. Isso é muito útil para o vendedor entender o perfil de compra do cliente.
>
> Agora vou para o módulo de **Pedidos**. *(Clicar em Pedidos na sidebar)*
>
> Podemos filtrar os pedidos por status — Pendente, Confirmado, Entregue ou Cancelado — e também por data. Vou criar um novo pedido para mostrar esse fluxo. *(Clicar em 'Novo Pedido')*
>
> O formulário funciona em etapas: primeiro selecionamos o cliente — com uma busca interativa —, depois adicionamos os produtos desejados informando a quantidade. Reparem que o valor total é calculado automaticamente conforme adicionamos itens. Por fim, podemos incluir uma observação, como um pedido de embrulho ou gravação personalizada. *(Criar o pedido)*
>
> O pedido foi criado com status Pendente. *(Abrir os detalhes do pedido)* Aqui vemos todos os itens, os preços individuais e o total. Posso atualizar o status diretamente nessa tela — por exemplo, alterar para Confirmado. *(Atualizar o status)*
>
> Passo a palavra para o João Pedro, que vai apresentar o modelo de dados e as validações do sistema."

---
---

# Apresentador 3 — João Pedro de Melo Hentz

---

## Bloco 9 — Modelo de Dados *(~4 min)*

> **Texto sugerido:**
>
> "Obrigado, Willian. Meu nome é João Pedro, e vou apresentar o modelo de dados que sustenta o sistema.
>
> O banco de dados possui cinco entidades principais. A entidade **users** armazena os usuários do sistema — vendedores e administradores — com a senha salva apenas como hash bcrypt, nunca em texto puro.
>
> A entidade **products** representa as joias do catálogo, com todos os atributos específicos do setor: material, pedra, peso e preço. Uma decisão importante aqui foi o campo `deleted_at`: em vez de apagar o produto do banco, registramos a data de exclusão. Isso é chamado de soft delete, e garante que os pedidos antigos continuem fazendo referência ao produto sem quebrar a integridade dos dados.
>
> A entidade **customers** armazena os clientes com CPF único. O CPF é salvo sem formatação — apenas os 11 dígitos — e a formatação visual é aplicada pelo frontend.
>
> A entidade **orders** registra os pedidos, vinculando um cliente, um usuário responsável pela venda e um status. E aqui temos uma decisão importante de modelagem: existe uma entidade separada, **order_items**, que representa cada produto dentro de um pedido. Ela armazena o `unit_price` — o preço do produto no momento da venda. Isso é fundamental porque, se o preço do produto for alterado no futuro, o valor do pedido histórico permanece correto.
>
> Os relacionamentos são: um usuário pode ter muitos pedidos, um cliente pode ter muitos pedidos, e um pedido pode ter muitos itens."

---

## Bloco 10 — Validações do Sistema *(~3 min)*

> **Texto sugerido:**
>
> "O sistema aplica validações em duas camadas — no frontend e no backend — para garantir a integridade dos dados independentemente de como a API for acessada.
>
> No **backend**, usamos a biblioteca `class-validator` nos DTOs de cada módulo. Por exemplo, o e-mail precisa ter formato válido, a senha precisa ter no mínimo 8 caracteres, o preço e o peso precisam ser valores positivos, e o estoque não pode ser negativo. Se alguma regra for violada, a API retorna um erro 400 com a descrição do problema.
>
> No **frontend**, as mesmas regras são verificadas antes de enviar a requisição, com feedback visual inline em cada campo. Uma validação especial que implementamos foi a do **CPF**: além de verificar se tem 11 dígitos, o sistema executa o algoritmo de dígitos verificadores para confirmar que o CPF é matematicamente válido — não apenas se tem o tamanho correto.
>
> *(Demonstrar uma mensagem de erro de validação no formulário, como um CPF inválido ou senha curta)*
>
> Isso evita dados inconsistentes tanto na experiência do usuário quanto na camada de persistência."

---

## Bloco 11 — Seed e Dados de Exemplo *(~2 min)*

> **Texto sugerido:**
>
> "Para facilitar a demonstração e os testes do sistema, criamos um **seed** — um script que popula o banco de dados automaticamente com dados iniciais.
>
> O seed é executado com o comando `npx prisma db seed` e cria dois usuários prontos para login — um administrador e um vendedor —, oito produtos com diferentes materiais e pedras, cinco clientes de estados variados e cinco pedidos com status diferentes, para que o dashboard já apareça preenchido.
>
> Uma característica importante é que o seed usa `upsert` em vez de `insert`: ele verifica se o registro já existe antes de criar. Isso significa que pode ser executado múltiplas vezes sem risco de duplicar dados — é o que chamamos de operação idempotente."

---

## Bloco 12 — Encerramento *(~2 min)*

> **Texto sugerido:**
>
> "Para encerrar, vou fazer um resumo rápido do que foi entregue.
>
> Implementamos todos os requisitos de alta prioridade definidos na documentação: autenticação completa com JWT, CRUD de produtos com soft delete e controle de estoque, CRUD de clientes com validação de CPF, gestão de pedidos com múltiplos itens e controle de status, e o dashboard com os principais indicadores do negócio.
>
> Como pontos de evolução futura, identificamos três funcionalidades que não foram implementadas nesta versão: o upload real de imagens para os produtos, o gráfico de vendas por período no dashboard, e o deploy em produção nas plataformas Vercel e Railway.
>
> O projeto está versionado no GitHub com organização por branches de feature, seguindo o fluxo Git Flow com integração via pull requests.
>
> Agradecemos a oportunidade de apresentar o Lumina Joias e ficamos à disposição para responder às perguntas do professor."

---

## Resumo de Tempo

| Apresentador | Blocos | Tempo estimado |
|---|---|---|
| Gabriel Romero | 1, 2, 3, 4 | ~15 min |
| Willian Charantola da Costa | 5, 6, 7, 8 | ~15 min |
| João Pedro de Melo Hentz | 9, 10, 11, 12 | ~11 min |
| **Total** | | **~41 min** |

---

## Checklist pré-apresentação

- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:3001`
- [ ] Banco populado com `npx prisma db seed`
- [ ] Swagger acessível em `http://localhost:3000/api`
- [ ] Login testado com `admin@luminajoias.com` / `admin123`
- [ ] Navegador com zoom ajustado para a sala
