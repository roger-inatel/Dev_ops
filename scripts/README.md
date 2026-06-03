# scripts/

Scripts auxiliares usados pelo pipeline Jenkins do Projeto S07 NP2.

## `notify-email.js`

Envia um e-mail de resumo da execucao do pipeline. Atende ao requisito 3.1 do PDF:

> "Um script (na linguagem da escolha do grupo) deve ser chamado para enviar um e-mail
> com as informacoes da execucao do pipeline. O endereco de e-mail nao pode estar
> fixado (hardcoded) - deve ser uma variavel de ambiente."

### Setup

```bash
cd scripts
npm install
```

### Como rodar manualmente (smoke test)

Com o `docker-compose.yml` principal de pe (servico `mailhog` ativo na 1025/8025):

```bash
# Linux/macOS:
NOTIFY_EMAIL=devops@time.local SMTP_HOST=localhost SMTP_PORT=1025 \
BUILD_STATUS=SUCCESS BUILD_NUMBER=42 JOB_NAME=adotapet-pipeline \
node notify-email.js

# Windows PowerShell:
$env:NOTIFY_EMAIL='devops@time.local'; $env:SMTP_HOST='localhost'; $env:SMTP_PORT='1025'
$env:BUILD_STATUS='SUCCESS'; $env:BUILD_NUMBER='42'; $env:JOB_NAME='adotapet-pipeline'
node notify-email.js
```

Depois abra `http://localhost:8025` (Web UI do MailHog) - o e-mail deve aparecer no inbox.

### Variaveis de ambiente

| Var | Obrigatoria? | Default | Descricao |
| --- | --- | --- | --- |
| `NOTIFY_EMAIL` | sim | — | Destinatario(s), separados por virgula |
| `SMTP_HOST` | nao | `mailhog` | Hostname do servidor SMTP |
| `SMTP_PORT` | nao | `1025` | Porta SMTP |
| `SMTP_USER` | nao | — | Usuario SMTP (se aplicavel) |
| `SMTP_PASS` | nao | — | Senha SMTP (se aplicavel) |
| `SMTP_SECURE` | nao | `false` | `true` para TLS |
| `SMTP_FROM` | nao | `jenkins@adotapet.local` | Remetente |
| `BUILD_STATUS` | nao | `UNKNOWN` | Resultado do build (SUCCESS/FAILURE/...) |
| `BUILD_NUMBER`, `BUILD_URL`, `JOB_NAME`, `GIT_BRANCH`, `GIT_COMMIT` | nao | — | Contexto (Jenkins injeta) |

### Codigos de saida

- `0` - e-mail enviado.
- `1` - faltou `NOTIFY_EMAIL`.
- `2` - falha SMTP.
