---
title: "Tarea 2.2: Contenedores Docker"
---

En esta tarea vas a trabajar con contenedores Docker: ejecutarlos, gestionar sus imágenes, persistir sus datos, conectarlos en redes y desplegar aplicaciones multicontenedor, primero con `docker` y después con Docker Compose. Todas las operaciones se realizan desde la línea de comandos.

Cada apartado corresponde a una parte de la unidad: puedes hacerlo y entregarlo en cuanto la hayamos visto en clase.

## 1. Primeros pasos con Docker

1. Instala Docker (paquetes `docker.io` y `docker-compose`) en una máquina virtual y configúralo para que pueda usarlo un usuario sin privilegios.
2. Crea un contenedor interactivo desde la imagen `debian` e instala el paquete `nano`. Sal del contenedor y crea un contenedor nuevo desde la misma imagen.
3. Crea un contenedor en segundo plano con la imagen `httpd:2.4`, mapeando el puerto 8080 del host al puerto 80 del contenedor. Comprueba el tamaño que ocupa el contenedor. Copia al contenedor un fichero `index.html` con tu nombre y vuelve a comprobar su tamaño.
4. Crea un contenedor en segundo plano con la imagen `mariadb`, usando las variables de entorno necesarias para su configuración. Conéctate al servidor de base de datos.

## 2. Almacenamiento y redes

1. Crea un volumen Docker llamado `miweb` y un contenedor desde la imagen `php:8.3-apache` que lo monte en `/var/www/html`. Copia al contenedor un fichero `index.html` con tu nombre. Borra el contenedor y crea uno nuevo montando el mismo volumen.
2. Crea un directorio en el host con un fichero `index.html` con tu nombre. Crea un contenedor desde la imagen `php:8.3-apache` que monte ese directorio en `/var/www/html` mediante bind mount. Modifica el fichero `index.html` en el host.
3. Crea una red definida por el usuario llamada `red1`. Crea un contenedor con la imagen `httpd:2.4` conectado a ella y un contenedor interactivo desde la imagen `debian` conectado también a `red1`. Desde este último, resuelve el nombre del primer contenedor.

## 3. Aplicaciones multicontenedor

1. **Guestbook**: la aplicación está formada por la aplicación web (`iesgn/guestbook`, puerto 5000) y una base de datos Redis (`redis`, puerto 6379). Crea una red para la aplicación. Crea el contenedor de Redis con el nombre `bd_redis`, conectado a esa red y con un volumen para sus datos en `/data`. Crea el contenedor de Guestbook conectado a la misma red, con la variable de entorno que indica el nombre del servidor Redis y mapeando su puerto al exterior. Escribe algún mensaje. Después, borra el contenedor de Redis y créalo de nuevo.
2. **Temperaturas**: la aplicación está formada por dos microservicios, `iesgn/temperaturas_frontend` (puerto 3000) y `iesgn/temperaturas_backend` (puerto 5000). Crea una red para la aplicación. Crea el contenedor de backend con el nombre `api-temp`, conectado a esa red y sin mapear su puerto al exterior. Crea el contenedor de frontend conectado a la misma red, con la variable de entorno `TEMP_SERVER` apuntando al nombre y puerto del backend, y mapeando su puerto al exterior.

## 4. Docker Compose

1. Elimina los contenedores del apartado anterior. Crea un fichero `docker-compose.yaml` para desplegar **Guestbook**: el contenedor de Redis debe llamarse `bd_redis` y guardar sus datos en un volumen Docker. Levanta el escenario y comprueba que funciona.
2. Crea un fichero `docker-compose.yaml` para desplegar **Temperaturas**: el contenedor de backend debe llamarse `api-temp` y solo el frontend debe exponer un puerto al exterior. Levanta el escenario y comprueba que funciona.

:::tip[¿Qué tienes que entregar?]
Las comprobaciones con `curl` se entregan como texto, con el comando y su salida.

1. Primeros pasos con Docker:
    * Comprobación de que el nuevo contenedor `debian` no tiene `nano`. **¿Por qué?**
    * Tamaño del contenedor `httpd:2.4` antes y después de copiar el fichero (`docker ps -s`) y `curl` a la página. **¿Por qué crece el contenedor y no la imagen?**
    * Instrucción usada para crear el contenedor `mariadb` y conexión al servidor de base de datos.
2. Almacenamiento y redes:
    * Instrucciones usadas para crear el volumen y el contenedor, y `curl` a la página después de volver a crear el contenedor.
    * Instrucción usada para crear el contenedor con bind mount, y `curl` antes y después de modificar el fichero en el host.
    * Resolución del nombre del contenedor `httpd:2.4` desde el contenedor `debian`. **¿Por qué no funcionaría en la red `bridge` por defecto?**
3. Aplicaciones multicontenedor:
    * Instrucciones usadas para crear la red y los contenedores de Guestbook. Captura del navegador con algún mensaje escrito.
    * Captura del navegador después de volver a crear el contenedor de Redis. **¿Por qué se conservan los mensajes?**
    * Instrucciones usadas para crear la red y los contenedores de Temperaturas. Captura del navegador. **¿Por qué no es necesario mapear el puerto del backend?**
4. Docker Compose:
    * Fichero `docker-compose.yaml` de Guestbook, salida de `docker compose ps` y captura del navegador.
    * Salida de `docker network ls` y `docker volume ls` donde se vean la red y el volumen que ha creado Docker Compose.
    * Fichero `docker-compose.yaml` de Temperaturas.
:::
