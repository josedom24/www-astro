---
date: 2026-03-08
title: 'Migración de Pledin a Astro'
slug: 2026/03/migracion-pledin-astro
tags:
  - Astro
  - Jekyll
  - Migración
  - Web
excerpt: 'Después de muchos años usando Jekyll como generador de sitios estáticos, he decidido migrar Pledin a Astro. En este artículo explico qué es Astro, por qué lo he elegido y todos los pasos que he seguido para realizar la migración.'
---

Después de muchos años usando **Jekyll** como generador de sitios estáticos para este blog, he decidido migrar a **Astro**. En este artículo explico qué es Astro, por qué lo he elegido y todos los pasos que he seguido para realizar la migración.

<!--more-->

## ¿Qué es Astro?

[Astro](https://astro.build) es un framework moderno para construir sitios web estáticos y dinámicos. A diferencia de otros frameworks como Next.js o Nuxt, Astro está diseñado desde cero para generar HTML estático de la forma más eficiente posible.

Sus principales características son:

- **Islands Architecture**: solo envía JavaScript al navegador cuando es estrictamente necesario. El resto es HTML puro.
- **Framework-agnostic**: puedes usar componentes de React, Vue, Svelte o simplemente componentes `.astro` propios.
- **Content Collections**: sistema tipado para gestionar contenido en Markdown o MDX con validación de esquemas mediante Zod.
- **Integrations**: sistema de plugins oficial para añadir funcionalidades como sitemap, RSS, MDX, etc.
- **Rendimiento**: genera sitios extremadamente rápidos gracias a la eliminación de JavaScript innecesario.

## ¿Por qué migrar de Jekyll a Astro?

Jekyll ha sido una herramienta excelente durante años, pero tiene algunas limitaciones que con el tiempo se hacen evidentes:

- Requiere Ruby y sus dependencias, lo que puede ser un problema en entornos modernos.
- El sistema de plantillas Liquid, aunque funcional, es limitado comparado con componentes modernos.
- La velocidad de build con muchos posts puede ser lenta.
- La integración con herramientas modernas de frontend es complicada.

Astro en cambio ofrece una experiencia de desarrollo moderna, usa JavaScript/TypeScript, y tiene un ecosistema muy activo.

## Arquitectura del nuevo sitio

El sitio `www.josedomingo.org` tiene tres secciones principales:

- **Blog**: ~300 artículos técnicos sobre Linux, Docker, Kubernetes, redes, etc.
- **Microblog**: entradas cortas al estilo de notas rápidas.
- **About**: página personal con información sobre el autor.

Todo se sirve bajo la ruta base `/pledin/`, lo que hay que tener en cuenta en toda la configuración.

La estructura de ficheros del proyecto queda así:

```
src/
├── content/
│   ├── blog/          ← posts del blog en Markdown
│   └── microblog/     ← posts del microblog en Markdown
├── data/
│   └── comments/      ← comentarios antiguos en JSON
├── layouts/
│   ├── BaseLayout.astro   ← cabecera, pie, búsqueda, tema
│   └── BlogLayout.astro   ← rejilla sidebar + contenido + TOC
├── components/
│   ├── BlogSidebar.astro
│   ├── Comments.astro
│   └── Giscus.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── blog/index.astro
│   ├── feed/feed.xml.ts
│   ├── tags/[tag]/index.astro
│   ├── microblog/
│   └── [year]/[month]/[slug]/index.astro
└── utils/
    ├── date.ts
    └── excerpt.ts
```

## Configuración básica

El fichero `astro.config.mjs` define la configuración principal:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.josedomingo.org',
  base: '/pledin',
  integrations: [mdx(), sitemap()],
});
```

Las **Content Collections** se definen en `content.config.ts` con esquemas Zod para validar el frontmatter de cada post:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    slug: z.string().optional(),
  }),
});
```

## Script de migración de posts

Los posts de Jekyll tienen algunas particularidades que hay que transformar:

- El campo `permalink` pasa a ser `slug`.
- Las imágenes referenciaban rutas de WordPress (`wp-content/uploads`) que hay que actualizar.
- La sintaxis `{: .align-center }` de Kramdown no existe en Astro.
- Los bloques `{% raw %}` y `{% endraw %}` de Liquid se eliminan.
- Las imágenes con atributos Jekyll se convierten a HTML.
- Los botones con clase `.btn` se convierten a etiquetas `<a>` HTML.

El script Python de migración procesa todos estos casos automáticamente y avisa de los que no puede resolver.

## URLs y rutas

Una de las partes más delicadas de la migración es mantener las URLs existentes para no romper los enlaces entrantes. Los posts del blog siguen el patrón `/pledin/YYYY/MM/slug/`, que se construye a partir del campo `slug` del frontmatter.

Para el microblog, las URLs se generan a partir del nombre del fichero con el patrón `YYYY-MM-DD-slug.md`.

## Características implementadas

### Búsqueda con Pagefind

Para la búsqueda se usa [Pagefind](https://pagefind.app), una librería que genera un índice estático durante el build. Se integra en el script de build:

```json
"build": "astro build && npx pagefind --site dist"
```

El modal de búsqueda se activa con el icono de lupa en la cabecera.

### TOC automático

Los posts del blog muestran una tabla de contenidos en la columna derecha generada automáticamente a partir de los encabezados `h2` y `h3` del artículo.

### RSS

El feed RSS está disponible en `/pledin/feed/feed.xml` e incluye el contenido completo de los posts con las imágenes referenciando las URLs absolutas.

### Sitemap

El sitemap se genera automáticamente con `@astrojs/sitemap` en cada build.

### Modo oscuro

El tema oscuro se activa con el botón sol/luna de la cabecera y se guarda en `localStorage` para persistir entre visitas.

### Favicon y metadatos

El favicon y los metadatos SEO se definen en `BaseLayout.astro` y se personalizan por página.

## Migración de comentarios

El sitio usaba [Staticman](https://staticman.net) para los comentarios, que se almacenaban como ficheros YAML en el repositorio bajo `_data/comments/`. 

Para la migración he optado por un enfoque híbrido:

1. **Comentarios antiguos**: se han migrado a ficheros JSON en `src/data/comments/` y se muestran estáticamente en cada post usando `import.meta.glob`.
2. **Comentarios nuevos**: se usa [Giscus](https://giscus.app), que almacena los comentarios en GitHub Discussions. Los usuarios necesitan una cuenta de GitHub para comentar, lo que para un blog técnico como este es perfectamente asumible.

Los comentarios antiguos muestran los avatares de Gravatar cuando están disponibles, usando el hash MD5 del email que Staticman ya almacenaba.

## Páginas especiales

### Página 404

Se ha creado una página `src/pages/404.astro` con un diseño limpio que ofrece enlaces para volver al inicio y al blog.

### Página About

La página about incluye una tarjeta de perfil con avatar, nombre, ubicación y enlaces, seguida de una presentación y los comentarios migrados de Staticman.

## Conclusión

La migración ha sido un proceso laborioso pero satisfactorio. El resultado es un sitio más rápido, más moderno y más fácil de mantener. Astro ha demostrado ser una herramienta muy flexible que permite adaptarse a las necesidades específicas de cada proyecto.

El código fuente del sitio está disponible en [GitHub](https://github.com/josedom24/www-astro).