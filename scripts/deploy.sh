#!/bin/bash
# Uso:
#   ./scripts/deploy.sh www
#   ./scripts/deploy.sh plataforma
#   ./scripts/deploy.sh fp
#   ./scripts/deploy.sh all

set -e

SSH_HOST="debian@endor.josedomingo.org"
# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

APP=${1}
MSG=${2}

[ -z "$APP" ] && { echo "Uso: $0 [www|plataforma|fp|all] \"mensaje\""; exit 1; }
[ -z "$MSG" ] && { echo "Uso: $0 $APP \"mensaje del commit\""; exit 1; }

# --- Commit y push ---
commit_and_push() {
  log "git add..."
  git add -A

  if git diff --cached --quiet; then
    warn "Sin cambios que commitear"
  else
    log "git commit: $MSG"
    git commit -m "$MSG"
    log "git push..."
    git push
  fi
}

deploy_app() {
  local app=$1

  case $app in
    www)        DIST_SRC="apps/www/dist/"
                #DIST_DST="/home/debian/www/blog_pledin/html/pledin/" ;;
                DIST_DST="/home/debian/prueba-astro/blog_pledin/html/pledin/" ;;
    plataforma) DIST_SRC="apps/plataforma/dist/"
                #DIST_DST="/home/debian/www/plataforma_pledin/html/pledin/" ;;
                DIST_DST="/home/debian/prueba-astro/plataforma_pledin/html/pledin/" ;;
    fp)         DIST_SRC="apps/fp/dist/"
                #DIST_DST="/home/debian/www/fp_pledin/html/" ;;
                DIST_DST="/home/debian/prueba-astro/fp_pledin/html/" ;;
    *) err "App desconocida: $app" ;;
  esac

  log "Desplegando $app..."

  # 1. Build local
  log "[$app] build..."
  npm run build:$app

  # 2. rsync al servidor
  log "[$app] sincronizando con endor..."
  rsync -az --delete $DIST_SRC ${SSH_HOST}:${DIST_DST}

  log "[$app] ✅ desplegado correctamente"
}



# --- Main ---
# Primero commit y push
commit_and_push


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


