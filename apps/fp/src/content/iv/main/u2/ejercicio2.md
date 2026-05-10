---
title: "Introducción a los contenedores Docker"
---

En este ejercicio vas a instalar Docker, trabajar con contenedores interactivos y en segundo plano, usar variables de entorno, gestionar imágenes y desplegar aplicaciones web. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Instalación y primeros pasos

1. Instala Docker en una máquina virtual y configúralo para que pueda usarlo un usuario sin privilegios.
2. Ejecuta un contenedor a partir de la imagen `hello-world`. Comprueba que la salida es la esperada.
3. Lista los contenedores en ejecución y después todos los contenedores, incluidos los parados. ¿Dónde está el contenedor `hello-world`? Bórralo.

## Ejercicio 2: Contenedores interactivos

1. Crea un contenedor interactivo desde la imagen `debian`. Instala el paquete `nano` dentro del contenedor. Sal del contenedor. ¿Sigue ejecutándose? ¿Por qué?
2. Vuelve a iniciar el contenedor y conéctate de nuevo a él de forma interactiva. ¿Sigue instalado `nano`?
3. Sal del contenedor y bórralo. Crea un nuevo contenedor interactivo desde la misma imagen `debian`. ¿Tiene `nano` instalado? ¿Por qué?

## Ejercicio 3: Contenedores en segundo plano

1. Crea un contenedor en segundo plano con la imagen `httpd:2.4` mapeando el puerto 8080 del host al puerto 80 del contenedor. Accede desde un navegador a la IP del servidor para comprobar que funciona.
2. Modifica el fichero `index.html` del servidor web dentro del contenedor. Comprueba desde el navegador que el contenido ha cambiado.
3. Consulta los logs del contenedor. Para el contenedor y bórralo.
4. Crea un contenedor en segundo plano con la imagen `mariadb` usando las variables de entorno necesarias para su configuración. Comprueba que el contenedor está en ejecución y conéctate al servidor de base de datos.
5. Crea un contenedor con la aplicación **Nextcloud** usando la documentación de Docker Hub. Utiliza una variable de entorno para personalizar el nombre de la base de datos SQLite que va a utilizar.

## Ejercicio 4: Imágenes y almacenamiento por capas

1. Crea un contenedor demonio con la imagen `php:8.3-apache`. Comprueba el tamaño que ocupa el contenedor en disco.
2. Crea un fichero `info.php` con el contenido `<?php echo phpinfo(); ?>` y cópialo al directorio `/var/www/html` del contenedor. Vuelve a comprobar el espacio ocupado por el contenedor. ¿Ha cambiado? ¿Por qué?
3. Accede al fichero `info.php` desde el navegador y comprueba que se sirve correctamente.
4. Intenta borrar la imagen `php:8.3-apache` mientras el contenedor existe. ¿Qué ocurre? ¿Por qué?

## Ejercicio 5: Despliegue de aplicaciones con distintas versiones

1. Despliega tres contenedores de la aplicación **MediaWiki** usando tres versiones distintas de la imagen, cada uno mapeado a un puerto diferente del host.
2. Accede desde el navegador a cada uno de los tres contenedores y comprueba que se trata de versiones distintas de la aplicación.
3. Fíjate en el proceso de descarga de las imágenes. ¿Qué ocurre con las capas al descargar la segunda y tercera versión? ¿Por qué se descarga menos datos?

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: salida que muestre el resultado de ejecutar `hello-world`. Salida de `docker ps -a` mostrando el contenedor parado antes de borrarlo.
2. Del ejercicio 2: responde a las preguntas sobre el estado del contenedor y la persistencia del paquete instalado. Comprobación de que el nuevo contenedor no tiene `nano`.
3. Del ejercicio 3: comprobación del acceso al servidor web antes y después de modificar `index.html`. Instrucciones usadas para crear el contenedor MariaDB y conectarse al servidor de base de datos. Instrucción usada para crear el contenedor Nextcloud.
4. Del ejercicio 4: tamaño del contenedor antes y después de copiar el fichero. Responde a las preguntas sobre el sistema de capas. Resultado al intentar borrar la imagen con un contenedor existente.
5. Del ejercicio 5: comprobación del acceso a cada versión de MediaWiki. Responde a la pregunta sobre las capas compartidas entre versiones.
:::
