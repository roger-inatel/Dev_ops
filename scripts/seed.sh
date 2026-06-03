#!/usr/bin/env sh
# =============================================================================
# scripts/seed.sh - popula o banco com usuarios + 1 ONG + 2 pets de exemplo
# para o time poder logar e ver dados na hora.
#
# Pre-requisitos:
#   - Stack rodando: docker compose up -d
#   - Backend respondendo em http://localhost:3010 (ou na porta configurada)
#
# Uso:
#   sh scripts/seed.sh
#
# Para usar outra porta:
#   API_URL=http://localhost:3010 sh scripts/seed.sh
# =============================================================================

set -e

API="${API_URL:-http://localhost:3010}"

echo ">> seed.sh apontando para $API"

ok() { echo "[OK] $1" >&2; }
warn() { echo "[!!] $1" >&2; }

# ----- Funcoes auxiliares ---------------------------------------------------

create_user() {
  body="$1"
  curl -s -X POST "$API/users" \
    -H "Content-Type: application/json" \
    -d "$body" > /tmp/seed-create.json
  if grep -q '"id"' /tmp/seed-create.json 2>/dev/null; then
    ok "user criado: $(grep -oE '"email":"[^"]*"' /tmp/seed-create.json)"
  else
    warn "create_user (talvez email ja exista): $(cat /tmp/seed-create.json)"
  fi
}

login() {
  email="$1"; pwd="$2"
  curl -s -X POST "$API/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$pwd\"}" > /tmp/seed-login.json
  token=$(grep -oE '"access_token":"[^"]*"' /tmp/seed-login.json | cut -d'"' -f4)
  if [ -n "$token" ]; then
    ok "login: $email"
    echo "$token"
  else
    warn "login $email falhou: $(cat /tmp/seed-login.json)"
    echo ""
  fi
}

# ----- 1. Usuarios ----------------------------------------------------------

echo ""
echo ">> 1. Criando usuarios seed..."

create_user '{
  "fullName": "Admin AdotaPet",
  "email": "admin@adotapet.local",
  "password": "Admin@123",
  "role": "ADMIN"
}'

create_user '{
  "fullName": "ONG Patinhas Felizes",
  "email": "ong@adotapet.local",
  "password": "Ong@12345",
  "role": "ONG_ADMIN",
  "phone": "+55 35 99999-0001"
}'

create_user '{
  "fullName": "Lucas Adotante",
  "email": "lucas@adotapet.local",
  "password": "Lucas@123",
  "role": "ADOPTER",
  "phone": "+55 35 99999-0002"
}'

create_user '{
  "fullName": "Maria Adotante",
  "email": "maria@adotapet.local",
  "password": "Maria@123",
  "role": "ADOPTER",
  "phone": "+55 35 99999-0003"
}'

# ----- 2. Pets criados pela ONG ---------------------------------------------

echo ""
echo ">> 2. Login como ONG e cadastrando 3 pets..."

ONG_TOKEN=$(login "ong@adotapet.local" "Ong@12345")

if [ -n "$ONG_TOKEN" ]; then
  for pet in \
    '{"name":"Thor","species":"DOG","sex":"MALE","ageInMonths":24,"size":"MEDIUM","breed":"Labrador","description":"Cachorro brincalhao, vacinado e castrado","city":"Itajuba","state":"MG","vaccinated":true,"neutered":true}' \
    '{"name":"Mel","species":"CAT","sex":"FEMALE","ageInMonths":12,"size":"SMALL","description":"Gata super carinhosa, gosta de colo","city":"Itajuba","state":"MG","vaccinated":true}' \
    '{"name":"Bidu","species":"DOG","sex":"MALE","ageInMonths":6,"size":"SMALL","breed":"SRD","description":"Filhote dos pequenos, cheio de energia","city":"Pouso Alegre","state":"MG"}'
  do
    curl -s -X POST "$API/pets" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ONG_TOKEN" \
      -d "$pet" > /tmp/seed-pet.json
    if grep -q '"id"' /tmp/seed-pet.json 2>/dev/null; then
      name=$(grep -oE '"name":"[^"]*"' /tmp/seed-pet.json | head -1)
      ok "pet criado: $name"
    else
      warn "criar pet falhou: $(cat /tmp/seed-pet.json)"
    fi
  done
fi

# ----- 3. Resumo final ------------------------------------------------------

echo ""
echo "================================================================"
echo " SEED CONCLUIDO"
echo "================================================================"
echo " Credenciais (use no frontend $API/login ou Swagger):"
echo ""
echo "   ADMIN     -> admin@adotapet.local / Admin@123"
echo "   ONG_ADMIN -> ong@adotapet.local   / Ong@12345"
echo "   ADOPTER 1 -> lucas@adotapet.local / Lucas@123"
echo "   ADOPTER 2 -> maria@adotapet.local / Maria@123"
echo ""
echo " Pets: Thor (DOG), Mel (CAT), Bidu (DOG) - criados pela ONG"
echo "================================================================"
