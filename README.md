# www-astro

Monorepo con los sitios web de [José Domingo Muñoz](https://www.josedomingo.org), migrados de Jekyll a Astro.

## Estructura

```
pledin-monorepo/
├── apps/
│   ├── www/          # Blog personal → www.josedomingo.org
│   ├── plataforma/   # Catálogo de cursos → plataforma.josedomingo.org
│   └── fp/           # Módulos FP → fp.josedomingo.org
└── packages/
    └── ui/           # Componentes y layouts compartidos (@pledin/ui)
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Arrancar cada sitio
npm run dev:www
npm run dev:plataforma
npm run dev:fp
```

## Build

```bash
npm run build:www
npm run build:plataforma
npm run build:all
```

## Búsqueda con Pagefind

El buscador usa [Pagefind](https://pagefind.app), que genera el índice tras el build. Para que funcione en producción hay que ejecutar el indexado después de construir el sitio:

```bash
# Build + indexado de www
npm run build:www
npx pagefind --site dist/www

# Build + indexado de plataforma
npm run build:plataforma
npx pagefind --site dist/plataforma
```

El índice se genera en `dist/<sitio>/pagefind/`. En desarrollo el buscador no funciona porque no hay índice — es normal.

## Tecnologías

- [Astro 5](https://astro.build)
- [npm Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
- Markdown + MDX para el contenido
- [Pagefind](https://pagefind.app) para la búsqueda
