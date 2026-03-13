#!/bin/bash
# Uso: ./h1_to_title.sh <directorio>

DIR="${1:-.}"

find "$DIR" -name "*.md" | while read -r file; do
  # Buscar el primer H1 del fichero
  h1=$(grep -m1 '^# ' "$file" | sed 's/^# //')
  
  if [ -z "$h1" ]; then
    continue
  fi

  if grep -q '^---' "$file"; then
    # Tiene frontmatter
    if grep -q '^title:' "$file"; then
      # Ya tiene title: reemplazarlo
      sed -i "s/^title:.*/title: \"$h1\"/" "$file"
    else
      # No tiene title: añadirlo tras el primer ---
      sed -i "0,/^---/!{0,/^---/s/^---/---\ntitle: \"$h1\"/}" "$file"
    fi
  else
    # No tiene frontmatter: añadirlo al principio
    sed -i "1s/^/---\ntitle: \"$h1\"\n---\n/" "$file"
  fi

  # Eliminar la línea del H1 del cuerpo
  sed -i '0,/^# /{/^# /d}' "$file"

  echo "✅ $file → $h1"
done
