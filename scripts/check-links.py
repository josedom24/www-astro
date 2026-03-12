import argparse
import os
import re
import urllib.request
import urllib.error

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cursos', required=True)
    parser.add_argument('--base', default='http://localhost:4321/pledin')
    args = parser.parse_args()

    errors = []
    ok = 0

    for course in sorted(os.listdir(args.cursos)):
        course_dir = os.path.join(args.cursos, course)
        index = os.path.join(course_dir, 'index.md')
        if not os.path.isfile(index):
            continue

        with open(index, 'r', encoding='utf-8') as f:
            content = f.read()

        links = re.findall(r'\(doc/([^)]+)\)', content)

        for link in links:
            url = f"{args.base}/cursos/{course}/doc/{link.strip('/')}"
            try:
                urllib.request.urlopen(url)
                ok += 1
            except urllib.error.HTTPError as e:
                errors.append(f"  [{course}] {e.code} → {url}")
            except urllib.error.URLError as e:
                errors.append(f"  [{course}] ERROR → {url} ({e.reason})")

    print(f"\n✓ {ok} enlaces OK")
    if errors:
        print(f"❌ {len(errors)} enlaces rotos:\n")
        for e in errors:
            print(e)

if __name__ == '__main__':
    main()
