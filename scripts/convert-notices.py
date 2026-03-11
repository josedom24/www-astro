#!/usr/bin/env python3
"""
convert-notices.py
Convierte bloques Jekyll notice a directivas remark.

Uso:
  python3 scripts/convert-notices.py apps/fp/src/content/
"""
import re
import sys
import os

# Mapeo de clases notice a tipos de directiva
NOTICE_MAP = {
    'notice--info':    'tip',
    'notice--warning': 'caution',
    'notice--danger':  'danger',
    'notice':          'note',
}

PATTERN = re.compile(
    r'\{%\s*capture\s+notice-text\s*%\}(.*?)\{%\s*endcapture\s*%\}\s*'
    r'<div class="([^"]+)">\s*\{\{\s*notice-text\s*\|\s*markdownify\s*\}\}\s*</div>',
    re.DOTALL
)

def convert_file(path: str) -> bool:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace(m):
        body = m.group(1).strip()
        css_class = m.group(2).strip()
        directive_type = NOTICE_MAP.get(css_class, 'note')
        # Detectar si hay un h2 al principio para usarlo como título
        title_match = re.match(r'^##\s+(.+)$', body, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
            body = body[title_match.end():].strip()
            return f':::{directive_type}[{title}]\n{body}\n:::'
        else:
            return f':::{directive_type}\n{body}\n:::'

    new_content, count = PATTERN.subn(replace, content)

    if count > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'  {count} bloque(s) → {path}')
        return True
    return False


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/convert-notices.py <directorio>")
        sys.exit(1)

    root = sys.argv[1]
    total = 0
    for dirpath, _, filenames in os.walk(root):
        for fname in filenames:
            if fname.endswith('.md'):
                if convert_file(os.path.join(dirpath, fname)):
                    total += 1

    print(f'\n✓ {total} fichero(s) modificados')


if __name__ == '__main__':
    main()
