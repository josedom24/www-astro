#!/bin/bash
DIR="${1:-.}"
find "$DIR" -name "*.md" | while read -r file; do
  h1=$(grep -m1 '^# ' "$file" | sed 's/^# //')

  if [ -z "$h1" ]; then
    continue
  fi

  h1_escaped=$(printf '%s' "$h1" | sed 's/[\/&]/\\&/g')

  # Comprobar frontmatter solo en la primera línea
  first_line=$(head -n1 "$file")

  if [ "$first_line" = "---" ]; then
    # Tiene frontmatter
    if grep -q '^title:' "$file"; then
      sed -i "s/^title:.*/title: \"$h1_escaped\"/" "$file"
    else
      sed -i "0,/^---/s/^---/---\ntitle: \"$h1_escaped\"/" "$file"
    fi
  else
    # No tiene frontmatter: añadirlo al principio
    sed -i "1s/^/---\ntitle: \"$h1_escaped\"\n---\n/" "$file"
  fi

  # Eliminar la línea del H1 del cuerpo
  sed -i '/^# [^#]/d' "$file"

  echo "✅ $file → $h1"
done
