# AdotaPet - Monorepo

![Status](https://img.shields.io/badge/status-academic-blue)
![NestJS](https://img.shields.io/badge/backend-NestJS%2011-E0234E?logo=nestjs)
![Next.js](https://img.shields.io/badge/frontend-Next.js%2016-000000?logo=nextdotjs)
![MySQL](https://img.shields.io/badge/db-MySQL%208-4479A1?logo=mysql)

Sistema de adoção responsável de animais. Projeto acadêmico da disciplina **S204 / INATEL** (2026/1).

Monorepo com **backend (NestJS + Prisma + MySQL)** e **frontend (Next.js 16 + React 19 + Tailwind)**.

```
adotapet-monorepo/
├── backend/             # API NestJS (Prisma, MySQL, JWT)
├── frontend/            # Next.js 16 (App Router)
├── docker-compose.yml   # mysql + backend + frontend
├── .env.example         # template para o compose
└── .github/workflows/   # 4 pipelines (unit + e2e × back/front)
```

## Quick start (modo dev local, sem Docker para front/back)

Pré-requisitos: Node 20+, npm, Docker.

```bash
# 1. clonar
git clone https://github.com/S204-Inatel-2026-1/adotapet-monorepo.git
cd adotapet-monorepo

# 2. configurar env do monorepo (compose) e do backend (dev local)
cp .env.example .env
cp backend/.env.example backend/.env

# 3. subir so o MySQL via compose
docker compose up -d mysql

# 4. backend (em uma aba)
cd backend
npm ci
npx prisma generate
npx prisma migrate dev
npm run start:dev          # API em http://localhost:3000 (Swagger: /docs)

# 5. frontend (em outra aba)
cd ../frontend
npm ci
npm run dev                # UI em http://localhost:3001 (o backend ja ocupou 3000)
```

## Quick start (stack inteira via Docker Compose)

```bash
cp .env.example .env       # ajuste JWT_SECRET (obrigatorio)
docker compose up --build
```

| Servico | Porta no host |
| --- | --- |
| MySQL | `3306` |
| Backend (NestJS) | `3000` |
| Frontend (Next.js) | `3001` |

> O healthcheck do MySQL garante que o backend só sobe depois que o banco aceita conexões. O backend roda `prisma migrate deploy` no entrypoint (ver `backend/Dockerfile`).

## Documentação importante

- **API + Swagger**: [backend/GUIA_SWAGGER_FRONTEND.md](backend/GUIA_SWAGGER_FRONTEND.md) - passo a passo para autenticar e testar rotas.
- **Arquitetura interna do backend**: [backend/GUIA_INTERNO_BACKEND.md](backend/GUIA_INTERNO_BACKEND.md) - tratamento de erros, RBAC, ownership.
- **Matriz de permissões**: [backend/docs/matriz-permissoes.md](backend/docs/matriz-permissoes.md) - acesso por rota/papel.
- **Fluxo de adoção**: [backend/docs/fluxo-adocao.md](backend/docs/fluxo-adocao.md) - estados, transições, regras.
- **Histórias de usuário**: [backend/docs/historias-de-usuario.md](backend/docs/historias-de-usuario.md).

## Regras de negócio (resumo)

- **Papéis**: `ADOPTER`, `VOLUNTEER`, `ONG_ADMIN`, `ADMIN`.
- **Pets**: criados por usuários autenticados; só o cadastrante (ownership) pode editar/excluir/enviar foto.
- **Adoções**: ADOPTER pede; ONG/dono aprova ou rejeita. Aprovação coloca o pet em `PENDING_ADOPTION` via `prisma.$transaction`.
- **Termo de responsabilidade**: assinado pelo ADOPTER, registra `adopterIp` e `userAgent` para trilha de auditoria. Após assinatura, pet vira `ADOPTED`.

## CI

GitHub Actions em `.github/workflows/`:

- `pipeline_unit_backend.yaml` - build + `test:cov` do backend
- `pipeline_e2e_backend.yaml` - sobe MySQL via service container e roda `test:e2e`
- `pipeline_front_unit_frontend.yaml` - build + `test --coverage` do frontend
- `pipeline_front_e2e_frontend.yaml` - build + `cypress run` do frontend

## Equipe

- Backend: Roger e Rodrigo
- Frontend: Lucas e Lilyan
- DevOps: Breno
- Gestão: Trello (Sprints)

## Licença

Projeto acadêmico para fins educacionais.
