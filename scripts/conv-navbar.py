#!/usr/bin/env python3
"""
convert-nav.py
Convierte el _data/navigation.yaml de plataforma_pledin a:
  - apps/plataforma/src/data/nav/<curso>.json  (sidebar de cada curso)

Uso:
  python3 scripts/convert-nav.py \
    --input /ruta/a/navigation.yaml \
    --output apps/plataforma/src/data

  python3 scripts/convert-nav.py \
    --input /ruta/a/navigation.yaml \
    --output apps/fp/src/data \
    --no-prefix
"""
import argparse
import json
import os
import re
import sys

try:
    import yaml
except ImportError:
    print("Instala pyyaml: pip install pyyaml")
    sys.exit(1)


def clean_url(url: str, add_prefix: bool = True) -> str:
    """Normaliza URLs de Jekyll a URLs limpias de Astro."""
    if not url:
        return url
    url = re.sub(r'/index\.html$', '/', url)
    url = re.sub(r'\.html$', '/', url)
    url = re.sub(r'(?<!:)//+', '/', url)
    if add_prefix and url.startswith('/') and not url.startswith('/pledin/'):
        url = '/pledin' + url
    return url


def process_nav_items(items: list, add_prefix: bool = True) -> list:
    """Convierte la lista de secciones del nav a estructura JSON limpia."""
    result = []
    for item in items:
        if not item:
            continue
        section = {}
        title = item.get('title', '')
        if title is None:
            title = ''
        section['title'] = title

        url = item.get('url', '')
        if url:
            section['url'] = clean_url(str(url).strip(), add_prefix)

        children = item.get('children', [])
        if children:
            section['children'] = []
            for child in children:
                if not child:
                    continue
                child_title = child.get('title', '')
                child_url = child.get('url', '')
                entry = {'title': str(child_title) if child_title else ''}
                if child_url:
                    entry['url'] = clean_url(str(child_url).strip(), add_prefix)
                section['children'].append(entry)

        result.append(section)
    return result


def main():
    parser = argparse.ArgumentParser(description='Convierte navigation.yaml a JSON para Astro')
    parser.add_argument('--input', required=True, help='Ruta al navigation.yaml de Jekyll')
    parser.add_argument('--output', required=True, help='Directorio de salida')
    parser.add_argument('--no-prefix', action='store_true', help='No añadir prefijo /pledin/')
    args = parser.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if not data:
        print("ERROR: navigation.yaml vacío o inválido")
        sys.exit(1)

    RESERVED = {'main', 'cursos'}

    nav_dir = os.path.join(args.output, 'nav')
    os.makedirs(nav_dir, exist_ok=True)

    add_prefix = not args.no_prefix
    course_keys = [k for k in data.keys() if k not in RESERVED]
    for key in course_keys:
        items = data[key]
        if not items:
            continue
        nav = process_nav_items(items, add_prefix)
        out_path = os.path.join(nav_dir, f'{key}.json')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(nav, f, ensure_ascii=False, indent=2)
        print(f"  → {out_path}")

    print(f"\n✓ Generados {len(course_keys)} navs")
    print(f"  Procesados: {', '.join(course_keys)}")


if __name__ == '__main__':
    main()