---
date: 2026-03-18
title: 'Migración de Pledin a Astro'
slug: 2026/03/migracion-pledin-astro
tags:
  - Astro
  - Jekyll
  - Pledin
---

![pledin](/pledin/assets/2026/03/astro.svg)

Desde septiembre de 2018, mi página **Pledin - Plataforma Educativa Informática** ha sido una web estática generado por Jekyll, si quieres más información de como fue construida te invito a leer el artículo: [Bienvenidos a PLEDIN 3.0](https://www.josedomingo.org/pledin/2018/09/bienvenidos-a-pledin30/). Después de estos años usando **Jekyll** como generador de sitios estáticos para este blog, he decidido migrar a **Astro**. En este artículo explico qué es Astro, por qué lo he elegido y el proceso que he llevado a cabo para esta migración.

## ¿Qué es Astro?

[Astro](https://astro.build) es un framework moderno para construir sitios web, especialmente pensado para sitios donde el contenido es lo más importante: blogs, documentación, portfolios...

La filosofía de Astro es sencilla: generar páginas HTML simples y rápidas, enviando al navegador solo lo imprescindible. Mientras otros frameworks cargan grandes cantidades de JavaScript aunque no haga falta, Astro hace justo lo contrario.

Algunas de sus características más interesantes:

* **Flexible**: puedes usar componentes de React, Vue, Svelte... o simplemente los componentes propios de Astro, que tienen una sintaxis muy parecida al HTML de toda la vida.
* **Gestión de contenido integrada**: permite organizar los ficheros Markdown de forma estructurada, con validación automática de los metadatos de cada página.
* **Extensible**: dispone de un sistema de plugins oficial para añadir funcionalidades como generación de sitemap, feed RSS, soporte para MDX, etc.
* **Rendimiento**: genera sitios extremadamente rápidos gracias a la eliminación de JavaScript innecesario.

<!--more-->
## ¿Por qué migrar de Jekyll a Astro?

Jekyll ha sido una herramienta excelente durante años, pero tiene algunas limitaciones que con el tiempo se hacen evidentes:

* Requiere Ruby y sus dependencias, lo que puede ser un problema en entornos modernos.
* El sistema de plantillas Liquid, aunque funcional, es limitado comparado con componentes modernos.
* La velocidad de build con muchos posts es lenta.
* La integración con herramientas modernas de frontend es complicada.


Antes de pasarme a Astro, mi web funcionaba con Jekyll y la plantilla **Minimal Mistakes**, una de las más populares del ecosistema Jekyll. Con el tiempo empezaron a aparecer warnings en cada build, una señal de que mantener el sitio en pie iba a exigir cada vez más esfuerzo.

Los warnings eran de dos tipos. Por un lado, una **deprecación en Ruby**: alguna dependencia del proyecto usaba una API interna que ya había cambiado en versiones modernas. No rompía nada de momento, pero indicaba que el stack no estaba actualizado, y que una actualización de Ruby podía acabar rompiendo el build.

Por otro lado, una larga lista de warnings relacionados con **Sass** y la evolución de Dart Sass hacia versiones más estrictas:

* **Deprecación de `@import`**: la plantilla cargaba sus estilos mediante reglas `@import` encadenadas. Esta forma de importar archivos Sass desaparecerá en Dart Sass 3.0.0.
* **Deprecación del operador `/` para divisiones**: varias partes del código usaban `/` directamente para hacer operaciones matemáticas en Sass, algo eliminado en favor de `math.div()` o `calc()`.
* **Deprecación de funciones globales de color**: la plantilla usaba funciones como `mix()`, `red()`, `green()` o `blue()` en su forma global, que también están marcadas para desaparecer en Dart Sass 3.0.0.
* **Deprecación de `mixed-decls`**: Sass va a cambiar cómo maneja propiedades CSS mezcladas con reglas anidadas, algo que afecta a varios archivos internos de la plantilla.

Frente a esto, Astro ofrece una experiencia de desarrollo moderna basada en JavaScript y TypeScript, con un ecosistema muy activo y una filosofía que encaja perfectamente con lo que necesitaba: generar HTML estático de forma eficiente, sin cargar JavaScript innecesario al navegador.

## El proceso de migración

Hay que hablar de que empecé probando distintas plantillas de astro como **Starlight**. Sin embargo, después de varios intentos de hacerlo encajar en lo que necesitaba (www es un blog, y ese tema está pensado para la documentación), volví a comenzar de nuevo sin utilizar ninguna plantilla, fui construyendo desde 0, los distintos elementos de la página:

* **Componentes**: cabecera, pie de página, tarjetas de post, sistema de navegación...
* **Layouts**: un layout base y layouts específicos para la portada, los posts y las páginas estáticas.
* **Páginas**: índice, página de post individual, sección de etiquetas...
* **Estilos**: sistema de variables CSS, tipografía, modo oscuro...

Durante todo este proceso usé la IA, principalmente Claude, como asistente. El flujo habitual era: yo definía qué quería construir, Claude proponía una implementación, y yo la revisaba, ajustaba y la integraba en el proyecto. Útil especialmente para no atascarse en detalles de sintaxis de Astro o en patrones que aún no conocía bien.

## Estructura del proyecto

El sitio se ha organizado como un **monorepo** con tres aplicaciones independientes:

- **www** → Blog personal ([www.josedomingo.org](https://www.josedomingo.org))
- **plataforma** → Catálogo de cursos ([plataforma.josedomingo.org](https://plataforma.josedomingo.org))
- **fp** → Módulos de Formación Profesional ([fp.josedomingo.org](https://fp.josedomingo.org))
```
www-astro/
├── apps/
│   ├── www/          # Blog personal
│   ├── plataforma/   # Catálogo de cursos
│   └── fp/           # Módulos FP
└── packages/
    └── ui/           # Componentes y layouts compartidos
```
Puedes ver el código completo en el [repositorio de GitHub](https://github.com/josedom24/www-astro).

Durante el desarrollo de la migración se han tenido que ir solucionando distintos problemas que enumeramos a continuación:

### Componentes y layouts compartidos

Una de las ventajas de usar Astro es poder reutilizar código entre las tres aplicaciones. Para ello se ha creado el paquete `@pledin/ui` que contiene dos tipos de elementos:

* **Layouts**: son las plantillas que definen la estructura general de cada tipo de página. Por ejemplo, `BaseLayout` define la cabecera, el menú de navegación y el pie de página común a todo el sitio. `BlogLayout` añade además una barra lateral con el índice del blog, y `DocLayout` está pensado para las páginas de documentación de los módulos FP, con navegación lateral y tabla de contenidos.
* **Componentes**: son piezas reutilizables más pequeñas que se insertan dentro de los layouts o las páginas. Por ejemplo, `PostCard` muestra la vista previa de un post del blog, `TagList` muestra las etiquetas de un artículo, o `PostNav` muestra los enlaces al post anterior y siguiente.

### Manteniendo las URLs

Uno de los requisitos más importantes era no romper las URLs existentes, ya que llevan años indexadas y referenciadas. En la gran mayoría de los casos las URLs se han mantenido exactamente igual. Para los pocos casos donde no fue posible, se añadieron redirecciones en el fichero `.htaccess` del servidor Apache.

### Limpieza de directivas Liquid y Kramdown en los archivos Markdown

Otro de los trabajos previos a la migración fue revisar los archivos Markdown para eliminar directivas que son específicas de Jekyll y que Astro no entiende, por ejemplo, **`{: .center}`**.

Esta es una sintaxis propia de **Kramdown**, el procesador de Markdown que usa Jekyll. Permite aplicar atributos HTML directamente sobre un elemento, en este caso una clase CSS.

En Astro el procesador de Markdown es diferente (Remark), y esta sintaxis simplemente no existe. Había que eliminarla o sustituirla por la alternativa correspondiente.

En resumen, parte del trabajo de migración no fue solo mover archivos, sino limpiar los Markdown de todas estas dependencias con el ecosistema Jekyll, que en muchos casos estaban repartidas por decenas de archivos.

### Conversión automática de bloques notice

En Jekyll, los bloques de aviso se construían con una combinación de etiquetas Liquid y HTML:

```liquid
{% capture notice-text %}
## Título del aviso
Contenido del aviso.
{% endcapture %}
<div class="notice--info">{{ notice-text | markdownify }}</div>
```

En Astro, la forma equivalente es usando directivas de Remark, mucho más limpias:

```markdown
:::tip[Título del aviso]
Contenido del aviso.
:::
```
Como este patrón se repetía en decenas de archivos, escribimos un script Python que recorría todos los Markdown del proyecto, detectaba estos bloques y los convertía automáticamente, traduciendo además las clases CSS de Minimal Mistakes (`notice--info`, `notice--warning`, `notice--danger`...) a sus tipos de directiva correspondientes en Remark. Con un solo comando, todos los archivos quedaban migrados sin intervención manual.

### El frontmatter de los ficheros Markdown

Una de las buenas noticias de la migración es que el contenido apenas ha necesitado cambios. La mayoría de los ficheros Markdown se han podido reutilizar tal cual, con dos pequeños ajustes en el blog:

* Se ha añadido el campo `date` de forma explícita.
* El campo `permalink` se ha renombrado a `slug`.

En las otras dos aplicaciones (plataforma y fp) no ha sido necesario tocar ningún fichero de contenido.

### Comentarios

En la versión anterior del sitio los comentarios funcionaban con [Staticman](https://www.josedomingo.org/pledin/2021/05/comentarios-pledin-staticman/), una herramienta que permite añadir comentarios a sitios estáticos guardándolos directamente en el repositorio Git como ficheros YAML o JSON. Era una solución elegante para un sitio sin backend, pero requería mantener un servidor propio con la aplicación Staticman funcionando.

Al migrar a Astro, todos los comentarios existentes se han conservado convirtiéndolos a ficheros JSON, uno por post. Cada fichero contiene un array con los comentarios del post, incluyendo nombre, fecha, mensaje y opcionalmente la URL y el email del autor.

Para mostrarlos se ha creado un componente `Comments.astro` que recibe esos comentarios como prop y los renderiza. El mensaje se procesa con `marked` para interpretar el Markdown que algunos comentarios podían contener. Para el avatar, si el comentario incluye email se usa [Gravatar](https://gravatar.com) para obtener la imagen del usuario; si no, se muestra la inicial del nombre sobre un fondo de color.

Para los comentarios nuevos se ha adoptado [Giscus](https://giscus.app), una solución que almacena los comentarios en las **Discussions de GitHub**. Cada post del blog tiene su propia discusión asociada en el repositorio, y Giscus se encarga de cargarla y mostrarla mediante un widget embebido.

Las ventajas respecto a Staticman son claras: no requiere ningún servidor propio, se autentica con GitHub, y el mantenimiento es prácticamente nulo. El único requisito es que el repositorio sea público y tenga las Discussions activadas.

En la página de cada post aparecen primero los comentarios históricos migrados desde Staticman y a continuación el widget de Giscus para nuevos comentarios, de forma que el histórico queda preservado y la sección sigue siendo funcional.

### Búsqueda con Pagefind

Una de las funcionalidades que quería mantener en la migración era el buscador. En Jekyll lo tenía resuelto con un plugin, pero en Astro necesitaba una solución que funcionara con sitios estáticos, sin ningún servidor backend.

La solución elegida fue [Pagefind](https://pagefind.app), una librería de búsqueda estática que funciona de la siguiente manera: tras el build de Astro, se ejecuta Pagefind sobre el directorio `dist/` generado, indexa todo el contenido HTML y genera un índice de búsqueda en formato binario optimizado. Ese índice se sirve junto con el resto de ficheros estáticos, y la búsqueda se realiza completamente en el navegador sin ninguna petición a un servidor.

La integración en el proceso de build es muy sencilla. En el `package.json` de cada aplicación, el script de build encadena Astro y Pagefind:

```bash
astro build && npx pagefind --site dist
```

Para mostrar el buscador en la interfaz se usa el componente oficial `PagefindUI`, que se integra directamente en el layout base. En desarrollo el buscador no funciona porque el índice no existe hasta que se hace un build — es el único inconveniente, pero es perfectamente asumible.

El resultado es un buscador rápido, sin dependencias externas, que funciona igual en los tres sitios del monorepo: `www`, `plataforma` y `fp`.

### Revistas Libres de Software Libre

Aprovechando la migración, se ha rescatado y renovado una sección que llevaba años bastante abandonada: la colección de **Revistas Libres de Software Libre**.

Esta sección recoge revistas digitales gratuitas sobre Software Libre, Linux, educación y tecnología. Muchas de ellas ya no están activas, pero forman parte de la historia del movimiento del software libre hispanohablante: publicaciones como TuxInfo, ATIX, Papirux o Begins que nacieron de comunidades locales de Argentina, Bolivia, Chile, Colombia, Cuba o México, y que durante años fueron una referencia para sus lectores.

La lista se ha reorganizado en dos secciones: **revistas activas**, con su último número publicado actualizado, y un **archivo histórico** con las que ya no publican, indicando el número de ejemplares y los años en que estuvieron en activo.

La implementación técnica es sencilla: toda la información está centralizada en un fichero `revistas.json` que la página de Astro lee directamente y renderiza en forma de tarjetas. Cada tarjeta incluye la portada de la revista, una descripción, el último número disponible y enlaces para acceder a la colección y a la página web original. Añadir o actualizar una revista es tan simple como editar ese fichero JSON.

Los PDFs de todas las revistas están alojados en un servidor Nextcloud propio, garantizando que los enlaces no dejen de funcionar aunque las páginas originales desaparezcan — algo que ya ha ocurrido con varias de ellas.

## Desarrollo y despliegue

### Servidor de desarrollo

Durante el desarrollo, Astro incluye un servidor web local que recarga automáticamente el navegador cada vez que se modifica un fichero. Para arrancar cada aplicación:
```bash
npm run dev:www
npm run dev:plataforma
npm run dev:fp
```

### Proceso de build y despliegue

Cuando el sitio está listo para publicar, Astro genera todos los ficheros HTML estáticos mediante el proceso de build:
```bash
npm run build:www
npm run build:plataforma
npm run build:fp
```

Para automatizar el despliegue se ha creado un script que realiza tres acciones en orden: hace un commit con los cambios, los sube a GitHub, construye la aplicación en local y finalmente sincroniza los ficheros generados con el servidor mediante `rsync`.


### Migración a Astro 6

Poco después de terminar la migración de Jekyll a Astro 5, se publicó **Astro 6**. El proceso de actualización fue sencillo, aunque requirió resolver algunos detalles.

Astro 6 requiere Node.js 22.12.0 o superior. Para actualizar en Debian:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

[Zod](https://zod.dev) es una librería de validación de esquemas para TypeScript. En Astro se usa para definir y validar la estructura del frontmatter de los ficheros Markdown: qué campos son obligatorios, qué tipo tiene cada uno, cuáles son opcionales... `z` es el objeto principal de Zod a partir del cual se construyen todos los esquemas: `z.string()`, `z.boolean()`, `z.array()`...

En Astro 6, `z` ya no se importa desde `astro:content` sino desde `astro/zod`. El cambio afecta a los ficheros `content.config.ts` de las tres aplicaciones:

```diff
- import { defineCollection, z } from 'astro:content';
+ import { defineCollection } from 'astro:content';
+ import { z } from 'astro/zod';
```

Los schemas en sí no necesitaron ningún cambio, ya que son simples (`z.string()`, `z.boolean()`, `z.array()`...) y son totalmente compatibles con Zod 4.

Astro dispone de un comando oficial que detecta y actualiza automáticamente todas las integraciones:

```bash
cd apps/www && npx @astrojs/upgrade
cd ../plataforma && npx @astrojs/upgrade
cd ../fp && npx @astrojs/upgrade
```

También hay que actualizar la versión de Astro declarada en `packages/ui/package.json`, que al ser un monorepo actúa como versión de referencia para todo el workspace. Tras hacer el cambio, hay que limpiar e instalar de nuevo las dependencias:

```bash
rm -rf node_modules
npm install
npx astro --version
```

## Conclusiones

La migración de Jekyll a Astro ha sido un proceso largo pero satisfactorio. El resultado es un sitio más moderno, más rápido y mucho más fácil de mantener y extender.

Desde el punto de vista técnico, los cambios más significativos han sido:

* **Velocidad de build**: el tiempo de construcción se ha reducido drásticamente. Lo que antes tardaba varios minutos en Jekyll ahora se resuelve en segundos en local.
* **Mantenibilidad**: prescindir de Ruby y sus dependencias y trabajar con un stack basado en JavaScript/TypeScript, simplifica enormemente el mantenimiento.
* **Reutilización de código**: la organización en monorepo con un paquete `@pledin/ui` compartido entre las tres aplicaciones evita duplicar componentes y estilos, y garantiza una experiencia coherente en los tres sitios.
* **Buscador integrado**: gracias a [Pagefind](https://pagefind.app), los tres sitios disponen ahora de un buscador estático que funciona sin ningún servidor backend, generado automáticamente tras cada build.

Desde el punto de vista del proceso, la experiencia de usar IA como asistente durante el desarrollo ha sido muy positiva. No como sustituto del criterio propio, sino como herramienta para avanzar más rápido en los detalles de implementación, resolver dudas de sintaxis y explorar alternativas sin tener que detenerse a buscar en la documentación en cada paso.

El código fuente del proyecto está disponible en [GitHub](https://github.com/josedom24/www-astro) por si puede ser de utilidad para alguien que esté pensando en hacer una migración similar.

## Galería Pledin 3.0

Dejo por aquí algunas capturas de pantalla de las páginas web antes de la migración.

![pledin](/pledin/assets/2026/03/www.png)
![pledin](/pledin/assets/2026/03/blog.png)
![pledin](/pledin/assets/2026/03/microblog.png)
![pledin](/pledin/assets/2026/03/revistas.png)
![pledin](/pledin/assets/2026/03/plataforma.png)
![pledin](/pledin/assets/2026/03/fp.png)
