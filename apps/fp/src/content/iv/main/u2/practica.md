---
title: "Práctica: LXC - Docker"
---

En esta práctica vas a desplegar distintas aplicaciones web con Docker en tu VPS, usando `nginx` instalado en el host como **proxy inverso** para acceder a los contenedores con HTTPS. El objetivo es practicar el ciclo completo: despliegue, persistencia, actualización y gestión con Docker Compose.

## Ejercicio 1: MediaWiki con SQLite y proxy inverso

1. Crea un contenedor con la versión **1.43** de MediaWiki. Guarda en volúmenes Docker el directorio de imágenes (`/var/www/html/images`) y el directorio de la base de datos SQLite (`/var/www/data`).
2. Realiza la instalación eligiendo SQLite como base de datos. Pon tu nombre como título de la wiki.
3. Al terminar la instalación, descarga el fichero `LocalSettings.php`, elimina el contenedor y vuelve a crearlo montando ese fichero con un bind mount en `/var/www/html/LocalSettings.php`.
4. Configura el proxy inverso `nginx` del VPS para acceder a la aplicación con HTTPS usando el nombre `wiki.tudominio.algo`. Accede, configura la wiki y realiza alguna modificación donde aparezca tu nombre.
5. Actualiza la aplicación a la **última versión** de MediaWiki: borra el contenedor y crea uno nuevo con la imagen de la última versión usando los mismos puntos de montaje. Ejecuta dentro del contenedor el script de actualización de la base de datos. Comprueba que la aplicación sigue funcionando correctamente.

:::tip[¿Qué tienes que entregar?]
1. Instrucción para crear el contenedor de MediaWiki 1.43. Lista de contenedores en ejecución.
2. Captura accediendo a la aplicación donde se ve la versión instalada. Captura de la wiki configurada donde aparece tu nombre.
3. Lista de volúmenes donde se ve el volumen con los datos de la aplicación.
4. Instrucción para crear el contenedor con la última versión. Lista de contenedores en ejecución.
5. Captura que comprueba que la aplicación sigue funcionando y se sigue viendo tu nombre tras la actualización.
:::

## Ejercicio 2: MediaWiki con MariaDB

1. Elimina el contenedor del ejercicio anterior. Crea una red definida por el usuario.
2. Crea un contenedor con MariaDB configurado para crear una base de datos y un usuario con contraseña. Usa un bind mount para persistir el directorio de datos de la base de datos.
3. Crea un contenedor con la última versión de MediaWiki conectado a la misma red, configurado para usar la base de datos anterior. Usa un bind mount para el directorio de imágenes. Al terminar la instalación, monta también el fichero `LocalSettings.php` con un bind mount.
4. Escribe un artículo en la wiki y sube una imagen.
5. Borra los dos contenedores y vuelve a crearlos con los mismos puntos de montaje. Comprueba que el artículo y la imagen siguen existiendo.

:::tip[¿Qué tienes que entregar?]
1. Instrucciones para crear la red, el contenedor de MariaDB y el de MediaWiki.
2. Captura accediendo a la aplicación donde se ve la versión instalada. Captura de la wiki con tu nombre y el artículo escrito.
3. Instrucciones para borrar los contenedores y volver a crearlos.
4. Captura que comprueba que la aplicación sigue funcionando, se sigue viendo tu nombre y el artículo que escribiste.
:::

## Ejercicio 3: MediaWiki con Docker Compose

1. Elimina los contenedores del ejercicio anterior. Define un fichero `docker-compose.yaml` que describa el escenario completo: contenedor de MariaDB y contenedor de MediaWiki, con los bind mounts de datos, imágenes y el fichero `LocalSettings.php`.
2. Levanta el escenario con `docker compose` y comprueba con `docker compose` que los contenedores están en ejecución.
3. Accede a la aplicación y comprueba que sigue funcionando, se sigue viendo tu nombre y el artículo que escribiste.

:::tip[¿Qué tienes que entregar?]
1. Contenido del fichero `docker-compose.yaml`.
2. Instrucción e salida para iniciar el escenario.
3. Instrucción y salida para listar los contenedores en ejecución con `docker compose`.
4. Captura que comprueba que la aplicación sigue funcionando, se sigue viendo tu nombre y el artículo que escribiste.
:::
