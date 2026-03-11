#!/usr/bin/env python3
"""
check-nav-links.py
Lee los nav.json y comprueba que los enlaces devuelven 200.

Uso:
  python3 scripts/check-nav-links.py \
    --nav apps/plataforma/src/data/nav \
    --base https://plataforma.josedomingo.org/pledin

  python3 scripts/check-nav-links.py \
    --nav apps/fp/src/data/nav \
    --base https://fp.josedomingo.org
"""
import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from urllib.parse import urlparse

opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler())
urllib.request.install_opener(opener)


def check_url(url: str) -> int | None:
    try:
        req = urllib.request.Request(
            url,
            method='HEAD',
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return None


def get_links(nav: list) -> list[str]:
    links = []
    for section in nav:
        url = section.get('url', '')
        if url and not url.startswith('http') and '#' not in url:
            links.append(url)
        for child in section.get('children', []):
            url = child.get('url', '')
            if url and not url.startswith('http') and '#' not in url:
                links.append(url)
    return links


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--nav', required=True, help='Directorio con los nav.json')
    parser.add_argument('--base', required=True, help='Base URL')
    parser.add_argument('--verbose', action='store_true', help='Mostrar todos los enlaces')
    args = parser.parse_args()

    parsed = urlparse(args.base)
    origin = f"{parsed.scheme}://{parsed.netloc}"

    errors = []
    total = 0

    for fname in sorted(os.listdir(args.nav)):
        if not fname.endswith('.json'):
            continue
        path = os.path.join(args.nav, fname)
        with open(path, 'r', encoding='utf-8') as f:
            nav = json.load(f)

        links = get_links(nav)
        course_errors = []

        for link in links:
            url = origin + link
            status = check_url(url)
            total += 1
            if args.verbose:
                print(f'  {status or "ERR"} → {url}')
            if status != 200:
                course_errors.append((link, status))

        if course_errors:
            print(f'\n❌ {fname}')
            for link, status in course_errors:
                print(f'   {status or "ERR"} → {link}')
            errors.extend(course_errors)
        else:
            print(f'✓ {fname} ({len(links)} enlaces ok)')

    print(f'\n── Total: {total} enlaces, {len(errors)} errores ──')
    if errors:
        sys.exit(1)


if __name__ == '__main__':
    main()