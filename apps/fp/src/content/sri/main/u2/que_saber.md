---
title: "Unidad 2: ¿Qué tengo que saber?"
description: "Lista de comprobación de lo que hay que saber y saber hacer en la unidad del protocolo HTTP y los sistemas de almacenamiento."
---

Usa esta lista para repasar la unidad. Ve marcando lo que ya dominas: se guarda en tu navegador, así que lo verás marcado cuando vuelvas desde el mismo equipo. Si no puedes marcar algún punto, vuelve a la presentación o al ejercicio correspondiente.

## El protocolo HTTP

- [ ] Sé explicar los cuatro niveles de TCP/IP (aplicación, transporte, red y enlace), qué resuelve cada uno y qué dirección usa (URL y `Host`, puerto, IP, MAC).
- [ ] Sé explicar el encapsulamiento y qué cabecera lee cada equipo (switch, router, servidor web): por qué el router no ve la URL ni el `Host`.
- [ ] Sé explicar qué es HTTP: un protocolo de la capa de aplicación, de petición y respuesta, y sin estado.
- [ ] Identifico en qué puertos trabajan HTTP y HTTPS, y qué transporte usa cada versión (TCP en HTTP/1.1 y HTTP/2, QUIC sobre UDP en HTTP/3).
- [ ] ¿Sé diferenciar HTTP/1.1, HTTP/2 y HTTP/3, y qué es lo que no cambia entre ellas (métodos, códigos de estado y cabeceras)?
- [ ] Sé explicar cómo se establece una conexión TCP (saludo en tres pasos) y por qué las conexiones persistentes (*keep-alive*) ahorran tiempo.

## La URL

- [ ] Identifico las partes de una URL: esquema, host, puerto, ruta, consulta y fragmento.
- [ ] Sé explicar qué parte de la URL va en la línea de petición, cuál en la cabecera `Host` y cuál no se envía al servidor.

## Los mensajes HTTP

- [ ] Identifico la estructura de una petición: línea inicial (método, recurso y versión), cabeceras, línea vacía y cuerpo.
- [ ] Identifico la estructura de una respuesta: línea de estado (versión, código y descripción), cabeceras, línea vacía y cuerpo.
- [ ] Sé leer una petición y su respuesta en la salida de `curl -v`: qué envía el cliente (`>`) y qué responde el servidor (`<`).

## Métodos

- [ ] Sé explicar para qué sirven GET, HEAD, POST, PUT y DELETE.
- [ ] ¿Sé diferenciar dónde viajan los datos con GET (en la URL) y con POST (en el cuerpo)?
- [ ] Sé explicar por qué no se envían contraseñas por GET (quedan en el historial y en el `access.log`) y por qué POST tampoco las protege sin HTTPS.
- [ ] Sé explicar qué significa que GET y HEAD son métodos seguros.

## Códigos de estado

- [ ] Identifico las cinco familias de códigos (1xx a 5xx) y qué indica cada una.
- [ ] Sé explicar los códigos que más se ven administrando un servidor: 200, 301, 302, 304, 401, 403, 404, 500, 502, 503 y 504.
- [ ] ¿Sé diferenciar 401 de 403, y 502 de 504?
- [ ] ¿Sé diferenciar una redirección permanente (301) de una temporal (302)?

## Cabeceras

- [ ] Identifico las cabeceras más habituales de la petición (`Host`, `User-Agent`, `Accept`, `Cookie`, `Authorization`) y de la respuesta (`Content-Type`, `Content-Length`, `Server`, `Set-Cookie`, `Location`, `Cache-Control`).
- [ ] Sé explicar por qué `Host` es obligatoria en HTTP/1.1 y qué tiene que ver con los virtual hosts.
- [ ] Sé explicar para qué sirve `Location` en una redirección.
- [ ] Sé explicar por qué en producción se suele ocultar la versión que aparece en `Server`.

## Cookies y sesiones

- [ ] Sé explicar para qué sirven las cookies y cómo funcionan: el servidor la crea con `Set-Cookie` y el navegador la devuelve con `Cookie`.
- [ ] Identifico para qué sirven los atributos de una cookie: `Max-Age`/`Expires`, `Path`/`Domain`, `HttpOnly` y `Secure`.
- [ ] Sé explicar cómo se mantiene una sesión en un protocolo sin estado: qué guarda el servidor y qué guarda el cliente.
- [ ] ¿Sé diferenciar una cookie de una sesión?

## Aplicaciones que usan HTTP

- [ ] Sé explicar qué hace un servidor web y qué diferencia hay entre una página estática y una dinámica.
- [ ] ¿Sé diferenciar un proxy de un proxy inverso: en nombre de quién actúa cada uno y para qué se usa?
- [ ] ¿Sé diferenciar DNAT de un proxy inverso: en qué nivel trabaja cada uno, qué mira para decidir y cuántas conexiones TCP hay?
- [ ] Sé explicar qué es un balanceador de carga y su relación con el proxy inverso.
- [ ] Identifico ejemplos de software de cada uno (Squid, Apache, Nginx, HAProxy…).

## Peticiones con curl

- [ ] Sé hacer con `curl` una petición GET, ver solo las cabeceras (`-I`), seguir una redirección (`-L`) y ver todo el intercambio (`-v`).
- [ ] Sé enviar datos a una página con GET (en la URL) y con POST (`-X POST -d`), y comprobar la diferencia.
- [ ] Sé ver con las herramientas para desarrolladores del navegador cuántas peticiones hace una página y sus cabeceras.

## Servidores web: conceptos comunes

- [ ] Sé explicar qué es un virtual host y cómo elige el servidor el sitio que responde: por la cabecera `Host`, y el sitio por defecto si no coincide con ninguno (por ejemplo, al entrar por la IP).
- [ ] Sé probar varios virtual hosts sin DNS: con el `/etc/hosts` del cliente o con `curl -H "Host: …"`.
- [ ] Sé explicar qué fichero busca el servidor para una URL a partir del directorio raíz, y qué responde en cada caso: el fichero (200), el índice, el listado o un 403 si no hay índice, un 301 si falta la barra de un directorio, y un 404 si no existe.
- [ ] Sé explicar por qué el servidor atiende las peticiones con `www-data` y qué permisos necesita (lectura en los ficheros y paso, `x`, en todos los directorios de la ruta).
- [ ] Sé explicar para qué sirve un alias.
- [ ] ¿Sé diferenciar una redirección (3xx con `Location`, la URL cambia) de una reescritura (interna, la URL no cambia)?
- [ ] Sé explicar cómo funciona la autenticación básica (401, `Authorization: Basic`) y por qué Base64 no protege la contraseña.
- [ ] Sé explicar qué criterios puede usar el control de acceso y qué código devuelve si deniega el acceso (403).
- [ ] Sé leer una línea del `access.log` (IP, usuario, fecha, línea de petición, código de estado…) y sé para qué sirve el `error.log`.

## Apache

- [ ] Sé explicar qué es un MPM y en qué se diferencian prefork, worker y event, y por qué al instalar `mod_php` Debian cambia a prefork.
- [ ] Identifico para qué sirve cada parte de `/etc/apache2/` (`ports.conf`, `sites-*`, `mods-*`, `conf-*`) y sé activar sitios y módulos (`a2ensite`, `a2enmod`).
- [ ] Sé comprobar la configuración antes de recargar (`apache2ctl configtest`, `-S`, `-M`) y la diferencia entre `reload` y `restart`.
- [ ] Sé crear un virtual host (`ServerName`, `ServerAlias`, `DocumentRoot`, logs propios) y explicar por qué responde `000-default` si el `Host` no coincide.
- [ ] Sé cambiar el puerto en el que escucha un sitio.
- [ ] Sé explicar para qué sirven `Options`, `AllowOverride` y `Require` en un `<Directory>`, y por qué un `DocumentRoot` o un alias fuera de `/var/www` da 403.
- [ ] Sé configurar un `Alias` y una redirección con `Redirect`, y sé explicar por qué `Redirect "/"` produce un bucle y se usa `RedirectMatch "^/$"`.
- [ ] Sé configurar la autenticación básica (`htpasswd`, `AuthType Basic`, `Require valid-user`) y el control de acceso con `Require ip`.
- [ ] ¿Sé diferenciar `<RequireAny>` de `<RequireAll>`?
- [ ] Sé explicar para qué sirve un `.htaccess` y por qué no funciona con `AllowOverride None`.
- [ ] Sé escribir una reescritura con `mod_rewrite` (`RewriteRule … [L]`) y convertirla en redirección con `[R=301]`.
- [ ] Sé ocultar la versión del servidor (`ServerTokens`, `ServerSignature`) y cambiar el formato del log (`LogFormat`).

## Nginx

- [ ] Sé explicar el modelo orientado a eventos de Nginx y en qué se diferencia de Apache con prefork.
- [ ] Identifico la estructura de `/etc/nginx/` y sé activar un sitio (enlace en `sites-enabled/`, `nginx -t`, `reload`).
- [ ] Sé crear un server block (`listen`, `server_name`, `root`, `index`) y explicar qué hace `try_files`.
- [ ] Sé explicar qué sitio responde si el `Host` no coincide con ningún `server_name` (`default_server`).
- [ ] Sé explicar cómo elige Nginx el bloque `location` (exacta, prefijo más largo, `^~` y expresiones regulares) y predecir cuál responde a una URL.
- [ ] ¿Sé diferenciar `root` (añade la URL completa) de `alias` (sustituye el prefijo)?
- [ ] Sé configurar la autenticación básica (`auth_basic`) y el control de acceso por IP (`allow`/`deny`, en orden), y combinarlos con `satisfy any`.
- [ ] Sé redirigir con `return` (toda la web o solo la raíz con `location = /`) y reescribir con `rewrite` (`last`, `permanent`).
- [ ] Sé explicar cómo ejecuta Nginx el PHP (PHP-FPM, FastCGI y el socket de `fastcgi_pass`).
- [ ] Sé usar snippets y cambiar el formato del log (`log_format`, `$http_<cabecera>`).

## Equivalencias y problemas frecuentes

- [ ] Sé traducir la configuración básica de Apache a Nginx y al revés (sitio, nombre, raíz, sitio por defecto, alias, listado, redirección, reescritura, acceso por IP, autenticación, PHP).
- [ ] Sé tener Apache y Nginx a la vez en puertos distintos y comprobar con `ss -tlnp` qué proceso escucha en cada uno.
- [ ] Sé investigar un 403, un 404, un 500 o un 502, por qué sale otro sitio o por qué no arranca el servidor (sintaxis, puerto ocupado), mirando el `error.log`.

<style>
  .task-list-item {
    list-style: none;
    position: relative;
    padding-left: 2rem;
    margin-left: -1.25rem;
  }
  .task-list-item input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0.2em;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    border: 2px solid var(--color-text-muted);
    border-radius: 0.3rem;
    background: var(--color-bg);
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }
  .task-list-item input[type="checkbox"]:hover {
    border-color: var(--color-accent);
  }
  .task-list-item input[type="checkbox"]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .task-list-item input[type="checkbox"]:checked {
    border-color: var(--color-accent);
    background: var(--color-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 85% no-repeat;
  }
  .task-list-item:has(input:checked) {
    color: var(--color-text-muted);
  }
</style>

<script>
  (() => {
    const clave = "fp-sri-u2-que-saber";
    let marcadas = [];
    try { marcadas = JSON.parse(localStorage.getItem(clave)) || []; } catch (e) {}
    const casillas = document.querySelectorAll(".task-list-item input[type=checkbox]");
    casillas.forEach((c, i) => {
      c.disabled = false;
      c.checked = marcadas.includes(i);
      c.addEventListener("change", () => {
        const lista = [];
        casillas.forEach((x, j) => x.checked && lista.push(j));
        try { localStorage.setItem(clave, JSON.stringify(lista)); } catch (e) {}
      });
    });
  })();
</script>
