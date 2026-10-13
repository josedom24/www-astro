---
title: "Práctica: LXC - Docker"
---

En esta práctica vas a desplegar dos sitios web en tu VPS usando las dos formas de virtualización en contenedores que hemos estudiado: una web estática en un **contenedor de sistema LXC** y la aplicación MediaWiki en **contenedores de aplicación Docker**. En los dos casos usarás `nginx` instalado en el host como **proxy inverso** para acceder a los contenedores con HTTPS.

## Ejercicio 1: Servidor web en un contenedor LXC

1. Crea un contenedor LXC con Debian llamado `web`. Configura su arranque automático y limita su uso a 512 MB de memoria y a una sola CPU.
2. Instala un servidor web en el contenedor.
3. Crea en el host el directorio `/srv/www` con un fichero `index.html` donde aparezca tu nombre, y móntalo en el directorio `/var/www/html` del contenedor.
4. Configura el proxy inverso `nginx` del VPS para acceder al contenedor, usando su dirección IP en la red `lxcbr0`, con HTTPS y el nombre `www.tudominio.algo`.
5. Modifica el fichero `index.html` en el host y comprueba que el cambio se ve al momento en la web.

:::tip[¿Qué tienes que entregar?]
1. Salida de `lxc-ls -f`.
2. Configuración del contenedor donde se vean el arranque automático, los límites de memoria y CPU, y el montaje del directorio.
3. Configuración del proxy inverso para `www.tudominio.algo`.
4. `curl https://www.tudominio.algo` antes y después de modificar `index.html` en el host.
:::

## Ejercicio 2: MediaWiki con MariaDB en Docker

1. Crea una red definida por el usuario.
2. Crea un contenedor con MariaDB configurado para crear una base de datos y un usuario con contraseña. Usa un bind mount para persistir el directorio de datos de la base de datos.
3. Crea un contenedor con la versión **1.43** de MediaWiki conectado a la misma red. Guarda en un volumen Docker el directorio de imágenes (`/var/www/html/images`).
4. Realiza la instalación usando la base de datos anterior y pon tu nombre como título de la wiki. Al terminar, descarga el fichero `LocalSettings.php`, borra el contenedor de MediaWiki y vuelve a crearlo montando ese fichero con un bind mount en `/var/www/html/LocalSettings.php`.
5. Configura el proxy inverso `nginx` del VPS para acceder a la aplicación con HTTPS usando el nombre `wiki.tudominio.algo`. Escribe un artículo en la wiki y sube una imagen.
6. Borra los dos contenedores y vuelve a crearlos con los mismos puntos de montaje. Comprueba que el artículo y la imagen siguen existiendo.

:::tip[¿Qué tienes que entregar?]
1. Instrucciones para crear la red, el contenedor de MariaDB y el de MediaWiki (el definitivo, con `LocalSettings.php`).
2. Configuración del proxy inverso para `wiki.tudominio.algo`.
3. Captura de la wiki donde se vea tu nombre y el artículo escrito.
4. Captura que compruebe que, después de volver a crear los contenedores, se siguen viendo tu nombre, el artículo y la imagen.
:::

## Ejercicio 3: Docker Compose y actualización de la aplicación

1. Elimina los contenedores del ejercicio anterior. Define un fichero `docker-compose.yaml` que describa el mismo escenario: contenedor de MariaDB y contenedor de MediaWiki 1.43, con los mismos datos, imágenes y fichero `LocalSettings.php`.
2. Levanta el escenario y comprueba que la wiki sigue funcionando.
3. Actualiza la aplicación a la **última versión** de MediaWiki: cambia la imagen en el fichero `docker-compose.yaml`, vuelve a levantar el escenario y ejecuta dentro del contenedor el script de actualización de la base de datos. Comprueba que la aplicación sigue funcionando.

:::tip[¿Qué tienes que entregar?]
1. Contenido del fichero `docker-compose.yaml` con la última versión.
2. Salida de `docker compose ps`.
3. Instrucción usada para ejecutar el script de actualización.
4. Captura de la wiki donde se vean la nueva versión, tu nombre y el artículo que escribiste.
:::

## Ejercicio 4: LXC frente a Docker

Responde: **¿qué diferencias has encontrado entre desplegar la web en el contenedor LXC y la wiki con Docker?** Ten en cuenta cómo se instala el software, cómo se actualiza y dónde se guardan los datos en cada caso.
