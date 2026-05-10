---
title: "Escenarios multicontenedor con Docker Compose"
---

En este ejercicio vas a usar Docker Compose para definir y desplegar escenarios multicontenedor de forma declarativa. Trabajarás con ficheros `docker-compose.yaml` para gestionar aplicaciones formadas por varios servicios. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Primeros pasos con Docker Compose

Crea un fichero `docker-compose.yaml` para desplegar la aplicación **LetsChat**, una aplicación de chat que usa MongoDB como base de datos. El escenario debe definir los dos servicios, la política de reinicio automático, la dependencia entre contenedores y un volumen para persistir los datos de MongoDB.

1. Despliega el escenario en modo detach.
2. Comprueba que la aplicación es accesible desde el navegador y que funciona correctamente.
3. Visualiza los logs de los contenedores.
4. Para y elimina el escenario.

## Ejercicio 2: Despliegue de Guestbook con Docker Compose

Crea un fichero `docker-compose.yaml` para desplegar la aplicación **Guestbook** con Redis como base de datos. Ten en cuenta que:

- El contenedor de Redis debe llamarse `bd_redis`.
- Redis debe persistir los datos usando un volumen Docker.
- La aplicación debe ser accesible desde el exterior.

1. Levanta el escenario.
2. Comprueba que funciona correctamente desde el navegador.
3. Elimina el escenario y el volumen asociado.

## Ejercicio 3: Despliegue de Temperaturas con Docker Compose

Crea un fichero `docker-compose.yaml` para desplegar la aplicación **Temperaturas** con sus dos microservicios (frontend y backend). Ten en cuenta que:

- El contenedor de backend debe llamarse `api-temp`.
- El frontend debe conocer el nombre y puerto del backend mediante la variable de entorno correspondiente.
- Solo el frontend debe exponer un puerto al exterior.

1. Levanta el escenario.
2. Comprueba que funciona correctamente desde el navegador.
3. Elimina el escenario.

## Ejercicio 4: Despliegue de Nextcloud con Docker Compose

Crea un fichero `docker-compose.yaml` para desplegar **Nextcloud** con una base de datos MariaDB o PostgreSQL. Toma como referencia la estructura del despliegue de WordPress visto en clase. El escenario debe incluir las variables de entorno necesarias y persistencia de datos para ambos servicios.

1. Levanta el escenario con `docker compose`.
2. Lista los contenedores del escenario con `docker compose`.
3. Accede a la aplicación desde el navegador y comprueba que funciona.
4. Comprueba que se ha creado automáticamente una red de tipo bridge para el escenario y que el almacenamiento definido existe.
5. Borra el escenario completo con `docker compose`.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: contenido del fichero `docker-compose.yaml`. Comprobación del acceso a LetsChat desde el navegador. Salida de los logs.
2. Del ejercicio 2: contenido del fichero `docker-compose.yaml`. Comprobación del acceso a Guestbook desde el navegador.
3. Del ejercicio 3: contenido del fichero `docker-compose.yaml`. Comprobación del acceso a la aplicación Temperaturas desde el navegador.
4. Del ejercicio 4: contenido del fichero `docker-compose.yaml`. Comprobación del acceso a Nextcloud. Salida que muestra la red y el almacenamiento creados automáticamente.
:::
