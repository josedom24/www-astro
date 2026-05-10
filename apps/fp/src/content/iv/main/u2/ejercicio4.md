---
title: "Ejercicio 4: Ejemplos de despliegue en Docker"
---

En este ejercicio vas a desplegar aplicaciones multi-contenedor conectando servicios en la misma red, usando variables de entorno para la configuración y volúmenes para la persistencia. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Despliegue de Guestbook

La aplicación Guestbook está formada por dos servicios: la aplicación web (`iesgn/guestbook`, puerto 5000) y una base de datos Redis (`redis`, puerto 6379). Ambos contenedores deben estar en la misma red y comunicarse por nombre.

1. Crea una red de tipo bridge para la aplicación.
2. Crea el contenedor de Redis con el nombre `bd_redis`, conectado a esa red y con persistencia de datos en `/data`.
3. Despliega el contenedor de Guestbook conectado a la misma red, configura la variable de entorno que indica el nombre del servidor Redis y mapea el puerto 5000 al exterior. Comprueba que la aplicación funciona desde el navegador.
4. Borra el contenedor de Redis y vuelve a crearlo. ¿Se mantiene la información que habías introducido? ¿Por qué?

## Ejercicio 2: Despliegue de Temperaturas

La aplicación Temperaturas está formada por dos microservicios: `iesgn/temperaturas_frontend` (puerto 3000) y `iesgn/temperaturas_backend` (puerto 5000). El frontend consulta al backend por nombre usando la variable de entorno `TEMP_SERVER`.

1. Crea una red de tipo bridge para la aplicación.
2. Crea el contenedor de backend con el nombre `api-temp`, conectado a esa red. No es necesario mapear su puerto al exterior.
3. Despliega el contenedor de frontend conectado a la misma red, configura la variable de entorno `TEMP_SERVER` apuntando al nombre y puerto del backend, y mapea el puerto 3000 al exterior. Comprueba que la aplicación funciona desde el navegador.
4. Responde: ¿por qué no es necesario mapear el puerto del backend al exterior? ¿Qué tipo de aplicación es esta respecto al almacenamiento?

## Ejercicio 3: Despliegue de WordPress + MariaDB

1. Crea una red de tipo bridge para la aplicación.
2. Crea el contenedor de MariaDB conectado a esa red, con las variables de entorno necesarias para crear la base de datos y el usuario de WordPress, y con persistencia de datos.
3. Crea el contenedor de WordPress conectado a la misma red, con las variables de entorno que apuntan al contenedor de base de datos, con persistencia de datos, y mapeando el puerto 80 al exterior.
4. Accede desde el navegador y completa la instalación de WordPress.

## Ejercicio 4: Despliegue de Nextcloud + MariaDB

1. Crea una red de tipo bridge para la aplicación.
2. Crea el contenedor de MariaDB (`mariadb:10.5`) conectado a esa red, configurando las variables de entorno para crear una base de datos y un usuario para Nextcloud. Usa almacenamiento persistente.
3. Siguiendo la documentación de la imagen `nextcloud` en Docker Hub, crea el contenedor de Nextcloud conectado a la misma red, con las variables de entorno adecuadas para conectarse a la base de datos y con almacenamiento persistente.
4. Accede a la aplicación desde el navegador y comprueba que funciona correctamente.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: instrucciones usadas para crear los contenedores. Comprobación del acceso desde el navegador. Responde a la pregunta sobre la persistencia de los datos tras recrear el contenedor de Redis.
2. Del ejercicio 2: instrucciones usadas para crear los contenedores. Comprobación del acceso desde el navegador. Responde a las preguntas sobre el mapeo de puertos y el tipo de aplicación.
3. Del ejercicio 3: instrucciones usadas para crear la red y los dos contenedores. Captura del acceso a WordPress desde el navegador.
4. Del ejercicio 4: instrucciones usadas para crear la red y los dos contenedores. Captura del acceso a Nextcloud desde el navegador.
:::
