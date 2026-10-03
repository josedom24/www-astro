---
title: "Ejercicio 1: Peticiones HTTP con curl"
---

`curl` es una herramienta de línea de comandos para hacer peticiones HTTP (y de muchos otros protocolos). Permite **ver y depurar** el tráfico HTTP sin un navegador.

Las opciones básicas que vamos a usar son:

| Opción | Para qué sirve |
|:--|:--|
| `curl <url>` | Petición **GET** |
| `curl -L <url>` | Sigue las **redirecciones** |
| `curl -I <url>` | Petición **HEAD** (sólo cabeceras) |
| `curl -X POST -d "campo=valor" <url>` | Petición **POST** con datos en el cuerpo |
| `curl -v <url>` | Modo *verbose*: muestra las cabeceras enviadas y recibidas |

Realiza los siguientes ejercicios:

1. Realiza una petición para ver las **cabeceras** de `https://dit.gonzalonazareno.org`. ¿Qué **código de estado** devuelve? ¿Qué significa? ¿En qué cabecera se encuentra la URL a la que hay que acceder para obtener el recurso?
2. Realiza una petición **GET** a `https://dit.gonzalonazareno.org`. ¿Qué tipo de **redirección** devuelve? Realiza una nueva petición que **siga** la redirección.
3. Con las **herramientas para desarrolladores** del navegador (en Firefox: *Herramientas para desarrolladores → Red*), inspecciona `https://dit.gonzalonazareno.org/gestiona/`. ¿Cuántas peticiones se han realizado para mostrar la página? Identifica las cabeceras más importantes.
4. Obtén el **cuerpo** de la respuesta de `https://dit.gonzalonazareno.org/gestiona/`.
5. Usando el método **GET**, manda tu nombre a la página `https://http.josedomingo.org/index2.php`.
6. Usando el método **POST** (que envía el contenido en el cuerpo), manda tu nombre a la misma página.

:::tip
Compara las dos últimas peticiones: el contenido viaja en lugares **distintos** y la página debería distinguirlas.
:::
