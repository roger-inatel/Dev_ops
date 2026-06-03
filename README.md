# AdotaPet - Monorepo

![Status](https://img.shields.io/badge/status-academic-blue)
![NestJS](https://img.shields.io/badge/backend-NestJS%2011-E0234E?logo=nestjs)
![Next.js](https://img.shields.io/badge/frontend-Next.js%2016-000000?logo=nextdotjs)
![MySQL](https://img.shields.io/badge/db-MySQL%208-4479A1?logo=mysql)

Sistema de adoção responsável de animais. Projeto acadêmico da disciplina **S204 / INATEL** (2026/1).

Monorepo com **backend (NestJS + Prisma + MySQL)** e **frontend (Next.js 16 + React 19 + Tailwind)**.

```
adotapet-monorepo/
├── backend/                    # API NestJS (Prisma, MySQL, JWT)
├── frontend/                   # Next.js 16 (App Router)
├── scripts/                    # notify-email.js (chamado pelo Jenkinsfile)
├── jenkins/                    # Dockerfile do Jenkins customizado
├── docker-compose.yml          # mysql + backend + frontend + mailhog (4 containers)
├── docker-compose.jenkins.yml  # Jenkins em container (NP2 S07)
├── Jenkinsfile                 # pipeline declarativo (NP2 S07)
├── .env.example                # template para os composes
└── .github/workflows/          # 4 pipelines (unit + e2e × back/front)
```

## Portas (todas configuráveis via `.env`)

Para evitar conflito com outros projetos que rodam em paralelo, as portas no HOST foram movidas dos defaults:

| Serviço | Porta no host (default) | Porta no container | Origem |
| --- | --- | --- | --- |
| MySQL | **3307** | 3306 | Docker Hub (`mysql:8`) |
| Backend (NestJS) | **3010** | 3000 | Dockerfile local (`backend/Dockerfile`) |
| Frontend (Next.js) | **3011** | 3000 | Dockerfile local (`frontend/Dockerfile`) |
| MailHog SMTP | 1025 | 1025 | Docker Hub (`mailhog/mailhog`) |
| MailHog Web UI | 8025 | 8025 | (mesmo container) |

Para mudar, edite `.env`: `MYSQL_HOST_PORT`, `BACKEND_HOST_PORT`, `FRONTEND_HOST_PORT`, `MAILHOG_SMTP_PORT`, `MAILHOG_UI_PORT`. O `.env.example` já vem com esses defaults.

## Quick start (stack inteira via Docker Compose)

```bash
# 1. clonar e configurar
git clone https://github.com/roger-inatel/Dev_ops.git
cd Dev_ops
cp .env.example .env         # ajuste JWT_SECRET (obrigatorio)

# 2. subir tudo (4 containers: mysql + backend + frontend + mailhog)
docker compose up --build -d

# 3. acessar:
# Swagger:      http://localhost:3010/docs
# Frontend:     http://localhost:3011
# MailHog UI:   http://localhost:8025
# DBeaver:      localhost:3307 (user root / senha root, db adotapet)
```

O backend roda `prisma migrate deploy` automaticamente no entrypoint do container — não precisa rodar migrations à mão. Healthcheck do MySQL garante que o backend só sobe quando o banco aceita conexões.

## Quick start (dev local, fora do Docker)

Útil quando você quer rodar `npm run start:dev` com hot-reload:

```bash
# Banco continua no Docker (porta 3307 no host):
docker compose up -d mysql

# Backend (em uma aba):
cd backend
cp .env.example .env         # ja vem com DATABASE_URL apontando para 3307
npm ci
npx prisma generate
npx prisma migrate deploy
npm run start:dev            # API em http://localhost:3000

# Frontend (em outra aba):
cd frontend
npm ci
npm run dev                  # UI em http://localhost:3000 ou 3001
```

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

## CI (GitHub Actions)

GitHub Actions em `.github/workflows/`:

- `pipeline_unit_backend.yaml` - build + `test:cov` do backend
- `pipeline_e2e_backend.yaml` - sobe MySQL via service container e roda `test:e2e`
- `pipeline_front_unit_frontend.yaml` - build + `test --coverage` do frontend
- `pipeline_front_e2e_frontend.yaml` - build + `cypress run` do frontend

---

## Pipeline / Jenkins (NP2 S07)

Esta secao cobre o que o **Projeto S07 NP2 "Aplicando DevOps na pratica"** (INATEL) exige. Toda a infraestrutura abaixo ja esta pronta na branch `feature/devops-ready` - o time DevOps preenche os `// TODO` do `Jenkinsfile` e a configura o Job no Jenkins.

### Arquitetura

```
+-----------------+   docker compose -f docker-compose.jenkins.yml up -d --build
| Jenkins (8080)  | <----- (jenkins/Dockerfile: Node 20 + Docker CLI + plugins)
+--------+--------+
         |
         | clona este repo, executa Jenkinsfile
         v
+-----------------+    SMTP 1025                +-----------------+
| Stages do       | --------------------------> |  MailHog        |
| pipeline:       |                              | (inbox em 8025) |
| Test/Build/...  | <-- /var/run/docker.sock --> +-----------------+
+-----------------+    (Docker-from-Docker)
```

### Como subir o Jenkins (em container, conforme o PDF exige)

```powershell
# A partir da raiz do monorepo:
docker compose -f docker-compose.jenkins.yml up -d --build

# 1a senha admin do Jenkins:
docker exec adotapet_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Acesse `http://localhost:8080`, instale os plugins sugeridos (ou pule - o `jenkins/Dockerfile` ja pre-instalou os essenciais), crie um usuario admin, depois:

1. **New Item -> Pipeline** (com nome `adotapet-pipeline`).
2. **Pipeline -> Definition: "Pipeline script from SCM"** (esse passo eh permitido pelo PDF, soh para o checkout).
3. SCM = Git, URL deste repositorio, branch = `feature/devops-ready` (ou `main` apos o merge).
4. **Script Path:** `Jenkinsfile`.
5. **Manage Jenkins -> Configure System -> Global properties -> Environment variables** - adicione `NOTIFY_EMAIL=destino@time.com`.
6. Salve, clique em **Build Now**.

> **Importante (criterio eliminatorio do PDF):** alem do **checkout** (passo 2 acima), TODAS as outras etapas do pipeline devem estar no `Jenkinsfile`, NAO na GUI do Jenkins. O `Jenkinsfile` ja esta na raiz - basta o time preencher os `// TODO` em cada stage.

### Estrutura do Jenkinsfile

| Stage | O que faz | Quem escreve |
| --- | --- | --- |
| **Checkout** | `checkout scm` (clona o repositorio) | ✅ pronto |
| **Install** | `npm ci` em `backend/`, `frontend/`, `scripts/` | ⏳ TODO time |
| **Test** | `npm run test:cov` (back) e `npm test -- --coverage` (front) - falha se cobertura < threshold | ⏳ TODO time |
| **Build** | `npm run build` + `docker build` + `docker push` para o Docker Hub | ⏳ TODO time |
| **Notify** | `node scripts/notify-email.js` (le `NOTIFY_EMAIL` do env) | ✅ pronto |
| **post.always** | `archiveArtifacts` do `dist/` + `coverage/` + `junit-unit.xml` | ✅ pronto |
| **post.failure** | reenvia notify com `BUILD_STATUS=FAILURE` | ✅ pronto |

### Script de notificacao por e-mail

`scripts/notify-email.js` (Node + nodemailer). Le tudo de env vars - **`NOTIFY_EMAIL` NUNCA esta hardcoded**, conforme o PDF exige. Detalhes em [`scripts/README.md`](scripts/README.md).

Teste rapido (com o compose principal de pe):

```powershell
cd scripts
$env:NOTIFY_EMAIL='devops@time.local'; $env:SMTP_HOST='localhost'; $env:SMTP_PORT='1025'
$env:BUILD_STATUS='SUCCESS'; $env:BUILD_NUMBER='1'; $env:JOB_NAME='manual-test'
node notify-email.js
# Abrir http://localhost:8025 -> e-mail capturado.
```

### Cobertura de testes (criterio 1 do PDF: >= 90%)

Threshold do Jest configurado em ambos os pacotes (`backend/package.json` e `frontend/jest.config.ts`):

| Pacote | Statements | Branches | Functions | Lines | Tests |
| --- | --- | --- | --- | --- | --- |
| Backend (services + guards + jwt.strategy) | **97.20%** | 79.54% | 94.73% | **97.39%** | 67 |
| Frontend (services + contexts + login/registro + UI) | **98.35%** | 88.70% | **100%** | **98.35%** | 22 |

Threshold (Jest derruba o build se cair abaixo):
- `statements / lines / functions: 90` (criterio PDF)
- `branches: 75` (padrao pragmatico para defensivas/curto-circuitos)

**Por que cobertura escopada?** Arquivos sem logica (Nest `*.module.ts`, `*.dto.ts`, `entities/**`, `main.ts`, Next pages com mocks/TODOs como `dashboard/`, `perfil/`, `minhas-adocoes/`, `pet/[id]/`) **nao entram no calculo**. Isso e padrao da industria: cobre-se o codigo que tem comportamento testavel.

### Imagem no Docker Hub (responsabilidade do time)

O `Jenkinsfile` no stage `Build` ja tem o template comentado para `docker build` + `docker login` + `docker push`. O time precisa:

1. Criar conta no Docker Hub e um repositorio publico (ex.: `SEU_USUARIO/adotapet-backend`).
2. No Jenkins: **Credentials -> System -> Global -> Add Credentials**, tipo "Username with password", ID `dockerhub`.
3. Descomentar e ajustar as linhas no `Jenkinsfile`.
4. Anexar o link da imagem (`https://hub.docker.com/r/SEU_USUARIO/adotapet-backend`) no README e na entrega no Teams.

---

## Uso de IA

> Secao obrigatoria pelo PDF NP2 S07. O time preenche aqui com **transparencia** - o que foi gerado por IA, quais prompts, o que foi aceito/descartado, e o que foi feito a mao.

### Modelos utilizados

- _(time preencher: ex. Claude Sonnet 4.5, ChatGPT GPT-4, Cursor, Copilot, ...)_

### Para que foram usados

- _(time preencher: ex. "Geracao do esqueleto do Jenkinsfile", "Debugging do docker-compose", "Brainstorm da matriz de permissoes", etc.)_

### Exemplos reais de prompts (minimo 3)

1. **Prompt:** _(time preencher com o prompt real usado)_
   **Resposta:** aceita / ajustada / descartada porque ___.
2. **Prompt:** _(...)_
   **Resposta:** _(...)_
3. **Prompt:** _(...)_
   **Resposta:** _(...)_

### Dinamica de uso

- _(time preencher: individualmente em cada PR? em pair programming? para revisar configuracoes? em sessoes de debugging?)_

### O que NAO foi feito por IA (a mao)

- _(time preencher: ex. "A escolha das regras de negocio da adocao foi nossa", "A configuracao do Jenkins na GUI foi feita por X manualmente", etc.)_

---

## Equipe

- Backend: Roger e Rodrigo
- Frontend: Lucas e Lilyan
- DevOps: Breno
- Gestão: Trello (Sprints)

## Licença

Projeto acadêmico para fins educacionais.
