---
title: "Ejercicio 3: Almacenamiento y redes en Docker"
---

En este ejercicio vas a persistir datos de contenedores usando volúmenes Docker y bind mounts, y a gestionar redes definidas por el usuario para aislar contenedores y obtener resolución DNS entre ellos. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Volúmenes Docker

1. Crea un volumen Docker llamado `miweb`.
2. Crea un contenedor desde la imagen `php:7.4-apache` montando el volumen en el directorio `/var/www/html`.
3. Copia un fichero `index.html` con tu nombre al directorio `/var/www/html` del contenedor usando `docker cp`. Accede desde el navegador y comprueba que se muestra correctamente.
4. Borra el contenedor. Crea un nuevo contenedor montando el mismo volumen en el mismo directorio. ¿Sigue existiendo el fichero `index.html`? ¿Por qué?

## Ejercicio 2: Bind mount

1. Crea un directorio en el host y añade dentro un fichero `index.html` con tu nombre.
2. Crea un contenedor desde la imagen `php:7.4-apache` montando ese directorio en `/var/www/html` mediante bind mount. Accede desde el navegador y comprueba que se muestra el fichero.
3. Modifica el fichero `index.html` en el host y recarga la página del navegador. ¿Ha cambiado el contenido servido? ¿Por qué?
4. Borra el contenedor. Crea uno nuevo montando el mismo directorio. ¿Se sigue viendo el mismo contenido?

## Ejercicio 3: Diferencia entre volúmenes y bind mounts

Responde: ¿qué diferencia hay entre un volumen Docker y un bind mount? ¿En qué situaciones usarías cada uno?

## Ejercicio 4: Redes definidas por el usuario

1. Lista las redes Docker disponibles en tu sistema. Identifica los tres tipos predefinidos (`bridge`, `host`, `none`) y explica brevemente para qué sirve cada uno.
2. Crea una red de tipo bridge definida por el usuario llamada `red1`.
3. Crea un contenedor con la imagen `httpd:2.4` conectado a `red1`, mapeando el puerto 8080 del host.
4. Crea un segundo contenedor interactivo desde la imagen `debian` conectado también a `red1`. Desde este contenedor, comprueba que puedes resolver el nombre del primer contenedor por DNS. ¿Qué dirección IP devuelve?
5. Responde: ¿por qué en la red bridge por defecto no hay resolución DNS por nombre de contenedor, pero sí en las redes definidas por el usuario?

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: instrucciones usadas para crear el volumen y el contenedor. Comprobación del acceso desde el navegador. Responde a la pregunta sobre la persistencia del fichero tras borrar y recrear el contenedor.
2. Del ejercicio 2: instrucción usada para crear el contenedor con bind mount. Comprobación del acceso y del cambio en tiempo real al modificar el fichero en el host. Responde a la pregunta sobre la persistencia.
3. Del ejercicio 3: responde a las preguntas sobre diferencias y casos de uso.
4. Del ejercicio 4: salida de `docker network list`. Instrucción usada para crear `red1`. Comprobación de la resolución DNS entre contenedores. Responde a la pregunta sobre las diferencias de DNS entre la red por defecto y las redes de usuario.
:::
