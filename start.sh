#!/bin/bash
# ============================================================
#  Financy — script de inicialização e gerenciamento do projeto
#  Uso: ./start.sh [comando]
# ============================================================

set -euo pipefail

# ── Configuração ─────────────────────────────────────────────
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
E2E_DIR="e2e"
BACKEND_PORT=4000
FRONTEND_PORT=5173

# ── Cores ────────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Helpers de log ───────────────────────────────────────────
log()     { echo -e "${CYAN}▸${NC} $1"; }
success() { echo -e "${GREEN}✔${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✖${NC}  $1"; exit 1; }
step()    { echo -e "\n${BOLD}$1${NC}"; }
divider() { echo -e "${DIM}────────────────────────────────────────${NC}"; }

# ── Banner ───────────────────────────────────────────────────
banner() {
  echo -e "${GREEN}${BOLD}"
  echo "   _____ _                              "
  echo "  |  ___(_)_ __   __ _ _ __   ___ _   _ "
  echo "  | |_  | | '_ \ / _\` | '_ \ / __| | | |"
  echo "  |  _| | | | | | (_| | | | | (__| |_| |"
  echo "  |_|   |_|_| |_|\__,_|_| |_|\___|\__, |"
  echo "                                   |___/ "
  echo -e "${NC}"
}

# ── Utilitários ──────────────────────────────────────────────
port_in_use() {
  netstat -ano 2>/dev/null | grep -q ":$1 .*LISTEN" && return 0 || return 1
}

kill_port() {
  local port=$1
  local pid
  pid=$(netstat -ano 2>/dev/null | grep ":$port " | grep "LISTEN" | awk '{print $NF}' | head -1)
  if [ -n "$pid" ] && [ "$pid" != "0" ]; then
    kill -9 "$pid" 2>/dev/null \
      && success "Porta $port liberada (PID $pid)" \
      || warn "Não foi possível encerrar PID $pid"
  else
    echo -e "  ${DIM}Porta $port já está livre${NC}"
  fi
}

wait_for_port() {
  local port=$1
  local name=$2
  local retries=30
  printf "  Aguardando %-12s " "$name"
  while [ $retries -gt 0 ]; do
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
      echo -e " ${GREEN}pronto${NC}"
      return 0
    fi
    printf "."
    sleep 1
    retries=$((retries - 1))
  done
  echo ""
  warn "$name não respondeu em 30s na porta $port"
}

wait_for_graphql() {
  local retries=30
  printf "  Aguardando %-12s " "GraphQL"
  while [ $retries -gt 0 ]; do
    if curl -s -X POST "http://localhost:$BACKEND_PORT/graphql" \
        -H "Content-Type: application/json" \
        -d '{"query":"{__typename}"}' > /dev/null 2>&1; then
      echo -e " ${GREEN}pronto${NC}"
      return 0
    fi
    printf "."
    sleep 1
    retries=$((retries - 1))
  done
  echo ""
  warn "GraphQL não respondeu em 30s"
}

check_node() {
  command -v node > /dev/null 2>&1 || error "Node.js não encontrado. Instale em https://nodejs.org"
  command -v npm  > /dev/null 2>&1 || error "npm não encontrado."
}

# ── Comandos ─────────────────────────────────────────────────

cmd_setup() {
  banner
  step "🔧  Setup inicial do projeto"
  check_node

  # Backend
  divider
  log "Instalando dependências do backend..."
  (cd "$BACKEND_DIR" && npm install)

  if [ ! -f "$BACKEND_DIR/.env" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    # Gera JWT_SECRET aleatório
    local jwt_secret
    if command -v openssl > /dev/null 2>&1; then
      jwt_secret=$(openssl rand -hex 32)
    else
      jwt_secret=$(date +%s%N | sha256sum 2>/dev/null | head -c 64 || date +%s%N | md5sum | head -c 32)
    fi
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|" "$BACKEND_DIR/.env"
    success ".env do backend criado com JWT_SECRET gerado automaticamente"
  else
    success ".env do backend já existe"
  fi

  log "Rodando migrations do banco de dados..."
  (cd "$BACKEND_DIR" && npm run migrate)

  # Frontend
  divider
  log "Instalando dependências do frontend..."
  (cd "$FRONTEND_DIR" && npm install)

  if [ ! -f "$FRONTEND_DIR/.env" ]; then
    cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
    success ".env do frontend criado"
  else
    success ".env do frontend já existe"
  fi

  # E2E
  divider
  log "Instalando dependências do E2E..."
  (cd "$E2E_DIR" && npm install)
  log "Baixando browser Chromium para o Playwright..."
  (cd "$E2E_DIR" && npx playwright install chromium)

  divider
  success "Setup concluído! Rode ${BOLD}./start.sh dev${NC} para iniciar."
}

cmd_dev() {
  banner
  step "🚀  Iniciando servidores"
  check_node

  port_in_use $BACKEND_PORT  && error "Porta $BACKEND_PORT em uso. Rode ./start.sh stop primeiro."
  port_in_use $FRONTEND_PORT && error "Porta $FRONTEND_PORT em uso. Rode ./start.sh stop primeiro."

  [ ! -f "$BACKEND_DIR/.env" ]  && error "Backend sem .env. Rode ./start.sh setup primeiro."
  [ ! -f "$FRONTEND_DIR/.env" ] && error "Frontend sem .env. Rode ./start.sh setup primeiro."

  divider
  log "Iniciando backend (porta $BACKEND_PORT)..."
  (cd "$BACKEND_DIR" && npm run dev) &
  BACKEND_PID=$!

  log "Iniciando frontend (porta $FRONTEND_PORT)..."
  (cd "$FRONTEND_DIR" && npx vite --port $FRONTEND_PORT) &
  FRONTEND_PID=$!

  # Cleanup ao sair (Ctrl+C)
  trap 'echo ""; log "Encerrando servidores..."; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null; exit 0' SIGINT SIGTERM

  divider
  wait_for_graphql
  wait_for_port $FRONTEND_PORT "Frontend"

  divider
  success "Backend  → ${BOLD}http://localhost:$BACKEND_PORT/graphql${NC}"
  success "Frontend → ${BOLD}http://localhost:$FRONTEND_PORT${NC}"
  echo ""
  echo -e "  ${DIM}Pressione Ctrl+C para encerrar os servidores${NC}"
  divider

  wait
}

cmd_stop() {
  step "🛑  Encerrando servidores"
  kill_port $BACKEND_PORT
  kill_port $FRONTEND_PORT
  success "Concluído."
}

cmd_test() {
  banner
  step "🧪  Testes unitários"
  check_node
  local failed=0

  divider
  log "Backend (Jest — 6 suites)"
  (cd "$BACKEND_DIR" && npm test) || failed=1

  divider
  log "Frontend (Jest + RTL — 9 suites)"
  (cd "$FRONTEND_DIR" && npm test) || failed=1

  divider
  [ $failed -eq 0 ] \
    && success "Todos os testes unitários passaram!" \
    || error   "Alguns testes falharam."
}

cmd_e2e() {
  banner
  step "🎭  Testes E2E (Playwright)"
  check_node

  local started_backend=0
  local started_frontend=0

  divider
  if ! port_in_use $BACKEND_PORT; then
    log "Backend não está rodando — iniciando..."
    (cd "$BACKEND_DIR" && npm run dev) &
    BACKEND_PID=$!
    started_backend=1
    wait_for_graphql
  else
    success "Backend já rodando na porta $BACKEND_PORT"
  fi

  if ! port_in_use $FRONTEND_PORT; then
    log "Frontend não está rodando — iniciando..."
    (cd "$FRONTEND_DIR" && npx vite --port $FRONTEND_PORT) &
    FRONTEND_PID=$!
    started_frontend=1
    wait_for_port $FRONTEND_PORT "Frontend"
  else
    success "Frontend já rodando na porta $FRONTEND_PORT"
  fi

  divider
  log "Executando testes E2E..."
  (cd "$E2E_DIR" && npm test)
  local result=$?

  divider
  [ $started_backend  -eq 1 ] && kill "$BACKEND_PID"  2>/dev/null && log "Backend encerrado"
  [ $started_frontend -eq 1 ] && kill "$FRONTEND_PID" 2>/dev/null && log "Frontend encerrado"

  [ $result -eq 0 ] \
    && success "Todos os testes E2E passaram!" \
    || error   "Alguns testes E2E falharam."
}

cmd_help() {
  banner
  echo -e "${BOLD}Uso:${NC}  ./start.sh ${CYAN}[comando]${NC}"
  echo ""
  echo -e "${BOLD}Comandos:${NC}"
  echo -e "  ${CYAN}setup${NC}   Instala dependências, cria .env e roda migrations (primeira vez)"
  echo -e "  ${CYAN}dev${NC}     Inicia backend (:${BACKEND_PORT}) e frontend (:${FRONTEND_PORT}) em paralelo"
  echo -e "  ${CYAN}stop${NC}    Para todos os servidores rodando"
  echo -e "  ${CYAN}test${NC}    Roda testes unitários do backend e frontend"
  echo -e "  ${CYAN}e2e${NC}     Roda testes E2E (sobe servidores automaticamente se necessário)"
  echo -e "  ${CYAN}help${NC}    Exibe esta ajuda"
  echo ""
  echo -e "${BOLD}Exemplos:${NC}"
  echo -e "  ${DIM}./start.sh setup   # primeira vez no projeto${NC}"
  echo -e "  ${DIM}./start.sh dev     # desenvolvimento do dia a dia${NC}"
  echo -e "  ${DIM}./start.sh test    # rodar testes unitários${NC}"
  echo -e "  ${DIM}./start.sh e2e     # rodar testes end-to-end${NC}"
  echo -e "  ${DIM}./start.sh stop    # encerrar tudo${NC}"
  echo ""
}

# ── Roteamento de comandos ────────────────────────────────────
case "${1:-help}" in
  setup)          cmd_setup ;;
  dev|start)      cmd_dev   ;;
  stop|kill)      cmd_stop  ;;
  test|tests)     cmd_test  ;;
  e2e)            cmd_e2e   ;;
  help|--help|-h) cmd_help  ;;
  *) warn "Comando desconhecido: '$1'"; echo ""; cmd_help ;;
esac
