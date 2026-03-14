#!/bin/bash
# Uso:
#   ./scripts/deploy.sh www
#   ./scripts/deploy.sh plataforma
#   ./scripts/deploy.sh fp
#   ./scripts/deploy.sh all

set -e

SSH_HOST="endor.josedomingo.org"
REPO_PATH="/home/jose/github/www-astro"
CONTAINER="www-astro-builder"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

deploy_app() {
  local app=$1

  # Rutas destino en endor
  case $app in
    www)        DIST_DST="/dist/www" ;;
    plataforma) DIST_DST="/dist/plataforma" ;;
    fp)         DIST_DST="/dist/fp" ;;
    *) err "App desconocida: $app" ;;
  esac

  log "Desplegando $app..."

  # 1. Git pull en endor
  log "[$app] git pull..."
  ssh $SSH_HOST "cd $REPO_PATH && git pull"

  # 2. Build dentro del contenedor
  log "[$app] npm install..."
  ssh $SSH_HOST "docker exec $CONTAINER sh -c 'cd /app && npm install --silent'"

  log "[$app] build..."
  ssh $SSH_HOST "docker exec $CONTAINER sh -c 'cd /app && npm run build:$app'"

  # 3. Copiar dist al directorio de Apache (montado como volumen)
  log "[$app] copiando a Apache..."
  ssh $SSH_HOST "docker exec $CONTAINER sh -c 'rm -rf ${DIST_DST}/* && cp -r /app/apps/$app/dist/. ${DIST_DST}/'"

  log "[$app] ✅ desplegado correctamente"
}

# --- Main ---
APP=${1:-all}

case $APP in
  www|plataforma|fp)
    deploy_app $APP
    ;;
  all)
    deploy_app www
    deploy_app plataforma
    deploy_app fp
    log "✅ todas las apps desplegadas"
    ;;
  *)
    echo "Uso: $0 [www|plataforma|fp|all]"
    exit 1
    ;;
esac
