#!/bin/bash
# Crea una plantilla para un post o minipost del blog

# --- Colores ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════╗${NC}"
echo -e "${CYAN}║    Nuevo post para Pledin        ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════╝${NC}"
echo ""

# --- Destino ---
echo -e "${YELLOW}Destino:${NC}"
echo "  1) Blog"
echo "  2) Microblog"
read -rp "Elige [1/2]: " destino
echo ""

# --- Título ---
read -rp "Título: " titulo
echo ""

# --- Fecha ---
hoy=$(date +%Y-%m-%d)
read -rp "Fecha [$hoy]: " fecha
fecha=${fecha:-$hoy}
year=$(echo "$fecha" | cut -d- -f1)
month=$(echo "$fecha" | cut -d- -f2)

# --- Etiquetas ---
read -rp "Etiquetas (separadas por comas): " tags_raw
echo ""

# --- Generar slug a partir del título ---
slug=$(echo "$titulo" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[áàäâ]/a/g; s/[éèëê]/e/g; s/[íìïî]/i/g; s/[óòöô]/o/g; s/[úùüû]/u/g; s/ñ/n/g; s/ç/c/g' \
  | sed 's/[^a-z0-9 ]//g' \
  | sed 's/ \+/-/g' \
  | sed 's/^-\+\|-\+$//g')

filename="${fecha}-${slug}.md"

# --- Procesar etiquetas ---
tags_yaml=""
if [ -n "$tags_raw" ]; then
  IFS=',' read -ra tag_array <<< "$tags_raw"
  for tag in "${tag_array[@]}"; do
    tag=$(echo "$tag" | sed 's/^ *//; s/ *$//')
    tags_yaml="${tags_yaml}  - \"${tag}\"\n"
  done
fi

tags_block=$(echo -e "$tags_yaml")

# --- Generar fichero ---
if [ "$destino" = "2" ]; then
  # Microblog — sin slug ni imagen
  printf '%s\n' \
    "---" \
    "title: \"${titulo}\"" \
    "date: ${fecha}" \
    "tags:" \
    "${tags_block}" \
    "---" \
    "" \
    "Escribe aquí el contenido del minipost..." \
    > "$filename"
else
  # Blog — con slug e imagen
  printf '%s\n' \
    "---" \
    "title: \"${titulo}\"" \
    "date: ${fecha}" \
    "slug: \"blog/${year}/${month}/${slug}\"" \
    "tags:" \
    "${tags_block}" \
    "---" \
    "" \
    "![${titulo}](/pledin/assets/${year}/${month}/example.jpg)" \
    "" \
    "Escribe aquí la introducción del post..." \
    "" \
    "<!--more-->" \
    "" \
    "Continúa aquí con el resto del contenido..." \
    > "$filename"
fi

echo -e "${GREEN}✅ Fichero creado: ${filename}${NC}"
