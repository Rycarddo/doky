# Doky

Sistema web para gestão e administração de processos documentais de uma seção administrativa. O projeto centraliza o controle de processos OCNO e OCOM, workflows de tarefas, modelos de documentos, contatos operacionais e gerenciamento de usuários — tudo em tempo real.

---

## Motivação

Existem centenas de processos e cada um tem uma sequência **específica** de tarefas a executar. Isso eleva muito a curva de aprendizado de novos usuários e gera insegurança nas tomadas de decisão.

Com os **Trackers** e **Modelos**, o sistema guia o usuário passo a passo: ao abrir um processo, ele vê exatamente o que precisa fazer e pode consultar modelos de documentos para redigir com mais confiança e padronização.

---

## Funcionalidades

- **Controle OCNO** — cadastro, edição, prioridade, prazo, histórico e vinculação a Trackers
- **Controle OCOM** — gestão de processos com categoria, situação, empresa, prazo, histórico de andamento e log de alterações em tempo real
- **Trackers** — templates de fluxo de tarefas reutilizáveis, vinculáveis a processos OCNO e OCOM
- **Modelos** — documentos-padrão vinculáveis a tarefas de Trackers
- **To-do** — lista de tarefas avulsas com prioridade, prazo e responsável
- **Contatos** — contatos operacionais por localidade, contatos administrativos e OCOM
- **Administração** — painel com dashboard de métricas, gerenciamento de usuários, controle de sessões e histórico de acesso
- **Controle de acesso** — papéis ADMIN e OPERATOR com lista de aprovados (whitelist por e-mail)
- **Tempo real** — atualizações via Server-Sent Events (SSE) propagadas para todos os clientes
- **Tema escuro/claro** — alternância de tema com persistência

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Radix UI + shadcn/ui + Tailwind CSS 4 |
| Banco de dados | PostgreSQL 16 |
| ORM | Prisma 7 |
| Autenticação | better-auth 1.5 (Google OAuth 2.0) |
| Tabelas | TanStack React Table 8 |
| Notificações | Sonner |
| Ícones | Lucide React |
| Tema | next-themes |
| Linguagem | TypeScript 5 |
| Runtime mínimo | Node.js 22.12 |

---

## Pré-requisitos

- **Node.js** >= 22.12
- **PostgreSQL** 16+ (ou Docker)
- Credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/)

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/doky

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# better-auth
BETTER_AUTH_SECRET=uma_string_aleatoria_segura
BETTER_AUTH_URL=http://localhost:3000

# Opcional — para ambientes Docker (URL interna para requisições SSR)
BETTER_AUTH_INTERNAL_URL=http://host.docker.internal:3000
```

> **BETTER_AUTH_URL** deve ser a URL pública usada nos callbacks OAuth. Em produção, use o domínio real.

---

## Instalação e Execução

### Desenvolvimento

```bash
# 1. Instalar dependências
npm install

# 2. Subir o PostgreSQL (caso use Docker)
docker-compose up -d

# 3. Sincronizar schema com o banco e popular dados iniciais
npx prisma db push
npx prisma db seed

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

### Produção

```bash
# Build
npm run build

# Iniciar (inclui db push + seed + next start)
npm start
```

---

## Estrutura do Projeto

```
doky/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── admin/              # Painel administrativo
│   │   ├── tracker/            # Gestão de Trackers
│   │   ├── modelos/            # Modelos de documentos
│   │   ├── contatos/           # Contatos operacionais
│   │   ├── contatos-ocom/      # Contatos OCOM
│   │   ├── controleOcom/       # Controle de processos OCOM
│   │   ├── todo/               # Lista de tarefas
│   │   ├── auth/               # Callback de autenticação
│   │   ├── login/              # Página de login
│   │   └── api/                # Rotas de API
│   │       ├── auth/           # Endpoints better-auth
│   │       ├── processes/      # API OCNO
│   │       ├── ocom/           # API OCOM
│   │       ├── trackers/       # API Trackers
│   │       ├── models/         # API Modelos
│   │       ├── tasks/          # API Tarefas
│   │       ├── contacts/       # API Contatos
│   │       ├── admin/          # API Admin
│   │       └── sse/            # Server-Sent Events
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── OcomDialog.tsx      # Dialog principal OCOM
│   │   ├── Edit.tsx            # Edição de processos OCNO
│   │   ├── TrackerDialog.tsx   # Visualização de Trackers
│   │   └── ...
│   ├── context/
│   │   └── app-context.tsx     # Estado global da aplicação
│   ├── lib/
│   │   ├── auth.ts             # Configuração de autenticação
│   │   ├── auth-guard.ts       # Proteção de rotas por papel
│   │   ├── auth-client.ts      # Cliente de autenticação (browser)
│   │   ├── prisma.ts           # Cliente Prisma singleton
│   │   ├── db-helpers.ts       # Helpers de banco de dados
│   │   ├── sse.ts              # Broadcast de eventos SSE
│   │   └── types.ts            # Tipos TypeScript
│   ├── actions/                # Server Actions
│   └── hooks/                  # Custom hooks
├── prisma/
│   ├── schema.prisma           # Schema do banco de dados
│   ├── seed.ts                 # Seed inicial
│   └── migrations/             # Histórico de migrações
├── docker-compose.yml          # PostgreSQL via Docker
├── next.config.ts              # Configuração Next.js
└── tsconfig.json               # Configuração TypeScript
```

---

## Banco de Dados

O schema Prisma define os seguintes modelos principais:

| Modelo | Descrição |
|---|---|
| `User` | Usuários do sistema (ADMIN / OPERATOR) |
| `ApprovedUser` | Whitelist de e-mails autorizados |
| `Session` / `Account` | Sessões e contas OAuth |
| `Process` | Processos OCNO com histórico e tarefas |
| `OcomProcess` | Processos OCOM com histórico, tarefas e log de alterações |
| `OcomHistory` | Entradas de histórico OCOM com estado do documento |
| `OcomChangeLog` | Auditoria de campo a campo para processos OCOM |
| `Tracker` | Templates de fluxo de tarefas |
| `TrackerTask` | Tarefas individuais de um Tracker |
| `DocumentTemplate` | Modelos de documentos vinculáveis a tarefas |
| `Task` | Tarefas avulsas (to-do) |
| `Contact` | Contatos por localidade (código ICAO) |
| `AdmAdContact` | Contatos administrativos por grupo |
| `OcomOperationalContact` | Contatos operacionais OCOM |

---

## Autenticação e Autorização

- Login exclusivo via **Google OAuth 2.0** com better-auth
- Apenas e-mails presentes na tabela `ApprovedUser` conseguem acessar o sistema
- O **primeiro usuário** a se registrar é automaticamente promovido a **ADMIN**
- Dois papéis disponíveis: `ADMIN` e `OPERATOR`
- Admins têm acesso ao painel `/admin` para gerenciar usuários e revogar sessões

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (inclui `prisma generate`) |
| `npm start` | Produção (`db push` + `seed` + `next start`) |
| `npm run lint` | Verificação de lint com ESLint |
| `npx prisma db push` | Sincroniza schema com o banco |
| `npx prisma db seed` | Popula dados iniciais |
| `npx prisma studio` | Interface visual do banco de dados |

---

## Docker

O `docker-compose.yml` sobe uma instância do PostgreSQL 16:

```bash
docker-compose up -d
```

```yaml
# Configurações padrão
Banco:    doky
Usuário:  postgres
Senha:    1234
Porta:    5432
```

> Em produção, substitua as credenciais e use variáveis de ambiente seguras.
