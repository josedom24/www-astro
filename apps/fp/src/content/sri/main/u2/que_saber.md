---
title: "Unidad 2: ¿Qué tengo que saber?"
description: "Lista de comprobación de lo que hay que saber y saber hacer en la unidad del protocolo HTTP y los sistemas de almacenamiento."
---

Usa esta lista para repasar la unidad. Ve marcando lo que ya dominas: se guarda en tu navegador, así que lo verás marcado cuando vuelvas desde el mismo equipo. Si no puedes marcar algún punto, vuelve a la presentación o al ejercicio correspondiente.

## El protocolo HTTP

- [ ] Sé explicar qué es HTTP: un protocolo de la capa de aplicación, de petición y respuesta, y sin estado.
- [ ] Identifico en qué puertos trabajan HTTP y HTTPS, y qué transporte usa cada versión (TCP en HTTP/1.1 y HTTP/2, QUIC sobre UDP en HTTP/3).
- [ ] ¿Sé diferenciar HTTP/1.1, HTTP/2 y HTTP/3, y qué es lo que no cambia entre ellas (métodos, códigos de estado y cabeceras)?
- [ ] Sé explicar qué son las conexiones persistentes (*keep-alive*).

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
- [ ] Sé explicar qué es un balanceador de carga y su relación con el proxy inverso.
- [ ] Identifico ejemplos de software de cada uno (Squid, Apache, Nginx, HAProxy…).

## Peticiones con curl

- [ ] Sé hacer con `curl` una petición GET, ver solo las cabeceras (`-I`), seguir una redirección (`-L`) y ver todo el intercambio (`-v`).
- [ ] Sé enviar datos a una página con GET (en la URL) y con POST (`-X POST -d`), y comprobar la diferencia.
- [ ] Sé ver con las herramientas para desarrolladores del navegador cuántas peticiones hace una página y sus cabeceras.

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
