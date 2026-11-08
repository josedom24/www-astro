---
title: "Práctica: LXC - Docker"
---

En esta práctica vas a desplegar en tu VPS dos CMS usando las dos formas de virtualización en contenedores que hemos estudiado:

* **MediaWiki**, desplegada completamente con **Docker**: la aplicación y su base de datos en contenedores de aplicación.
* **WordPress**, desplegado con **Docker**, pero con la base de datos en un **contenedor de sistema LXC**. Así verás que un contenedor Docker puede conectarse a una base de datos que no está en Docker.

En los dos casos usarás `nginx` instalado en el VPS como **proxy inverso** para acceder a las aplicaciones con HTTPS.

Las comprobaciones con `curl` y las salidas de los comandos se entregan como **texto**, no como capturas.

## Ejercicio 1: MediaWiki con Docker

1. Crea una red definida por el usuario.
2. Crea un contenedor con MariaDB configurado para crear una base de datos y un usuario con contraseña. Usa un bind mount para persistir el directorio de datos de la base de datos.
3. Crea un contenedor con la versión **1.43** de MediaWiki conectado a la misma red. Guarda en un volumen Docker el directorio de imágenes (`/var/www/html/images`).
4. Realiza la instalación usando la base de datos anterior y pon tu nombre como título de la wiki. Al terminar, descarga el fichero `LocalSettings.php`, borra el contenedor de MediaWiki y vuelve a crearlo montando ese fichero con un bind mount en `/var/www/html/LocalSettings.php`.
5. Configura el proxy inverso `nginx` del VPS para acceder a la aplicación con HTTPS usando el nombre `wiki.tudominio.algo`. Escribe un artículo en la wiki y sube una imagen.
6. Borra los dos contenedores y vuelve a crearlos con los mismos puntos de montaje. Comprueba que el artículo y la imagen siguen existiendo.
7. Elimina los contenedores y define un fichero `docker-compose.yaml` que describa el mismo escenario: MariaDB y MediaWiki 1.43, con los mismos datos, imágenes y fichero `LocalSettings.php`. Levanta el escenario y comprueba que la wiki sigue funcionando.
8. Actualiza la aplicación a la **última versión** de MediaWiki: cambia la imagen en el fichero `docker-compose.yaml`, vuelve a levantar el escenario y ejecuta dentro del contenedor el script de actualización de la base de datos. Comprueba que la aplicación sigue funcionando.

:::tip[¿Qué tienes que entregar?]
1. Instrucciones para crear la red, el contenedor de MariaDB y el de MediaWiki (el definitivo, con `LocalSettings.php`).
2. Configuración del proxy inverso para `wiki.tudominio.algo` (y, cuando hagas el ejercicio 2, para `blog.tudominio.algo`).
3. Captura de la wiki, después de volver a crear los contenedores, donde se vean tu nombre, el artículo y la imagen.
4. Contenido del fichero `docker-compose.yaml` con la última versión, salida de `docker compose ps`, instrucción usada para ejecutar el script de actualización y captura de la página `Especial:Versión` de la wiki.
:::

## Ejercicio 2: WordPress con Docker y la base de datos en LXC

1. Crea un contenedor LXC con Debian llamado `bd`. Configura su arranque automático, limita su uso a 512 MB de memoria y a una sola CPU, y asígnale una **dirección IP fija** en la red `lxcbr0`.
2. Instala MariaDB en el contenedor `bd` y configúralo para que acepte conexiones desde la red. Crea una base de datos y un usuario con contraseña para WordPress.
3. Define un fichero `docker-compose.yaml` con un **único servicio**: WordPress, conectado a la base de datos del contenedor `bd`. Guarda en un volumen Docker el directorio `wp-content` e indica una política de reinicio para que el contenedor arranque solo al iniciar el VPS.
4. Configura el proxy inverso `nginx` del VPS para acceder a la aplicación con HTTPS usando el nombre `blog.tudominio.algo`. Realiza la instalación poniendo tu nombre como título del sitio y escribe una entrada con una imagen.
5. En el contenedor `bd`, comprueba que se han creado las tablas de WordPress y mira desde qué dirección llegan las conexiones a MariaDB (por ejemplo, con `SHOW PROCESSLIST;` o con `ss -tn`).
6. Reinicia el VPS y comprueba que los dos sitios, la wiki y el blog, vuelven a funcionar sin que tengas que hacer nada.

:::caution[Docker y el cortafuegos]
Docker modifica las reglas del cortafuegos del host. Si después de instalar Docker el contenedor LXC se queda sin salida a internet, busca cómo permitir el tráfico de la red `lxcbr0` en la cadena `DOCKER-USER`.
:::

:::tip[¿Qué tienes que entregar?]
5. Configuración del contenedor `bd` donde se vean el arranque automático, los límites de memoria y CPU y la IP fija, y salida de `lxc-ls -f`.
6. Cómo has configurado MariaDB para que escuche en la red y la instrucción con la que has creado el usuario de WordPress.
7. Contenido del fichero `docker-compose.yaml` de WordPress.
8. Captura del blog con tu nombre y la entrada, y salida de las tablas de la base de datos y de las conexiones que llegan a MariaDB en el contenedor `bd`.
9. Después de reiniciar el VPS: salida de `uptime`, `lxc-ls -f`, `docker ps` y `curl -I` a `https://wiki.tudominio.algo` y a `https://blog.tudominio.algo`.
:::

## Ejercicio 3: Preguntas

:::tip[¿Qué tienes que entregar?]
10. Responde a las siguientes preguntas:
    * ¿Por qué hay que montar el fichero `LocalSettings.php` en el contenedor de MediaWiki? ¿Qué pasaría si no lo hicieras y borraras el contenedor?
    * ¿Por qué hay que ejecutar el script de actualización después de cambiar la imagen de MediaWiki? ¿Qué se actualiza al cambiar la imagen y qué se actualiza con el script?
    * ¿Desde qué dirección IP ve MariaDB las conexiones de WordPress? ¿Por qué no es la IP del contenedor de WordPress?
    * ¿Por qué el contenedor `bd` necesita una IP fija y el contenedor de MariaDB del ejercicio 1 no?
    * ¿Qué diferencias has encontrado entre tener la base de datos en un contenedor de sistema (LXC) y en un contenedor de aplicación (Docker)? Ten en cuenta cómo se instala, cómo se actualiza y dónde se guardan los datos. ¿Qué cambiaría si MariaDB estuviera instalado directamente en el VPS?
:::

## Vídeo de demostración

:::tip[¿Qué tienes que entregar?]
11. Enlace a un vídeo (entre 3 y 6 minutos, con tu voz explicando lo que haces) donde se vea:
    1. Las dos aplicaciones funcionando con HTTPS desde el navegador.
    2. Cómo borras y vuelves a crear los contenedores de MediaWiki y se conservan el artículo y la imagen.
    3. La wiki funcionando con la nueva versión.
    4. Cómo escribes una entrada nueva en WordPress y la buscas en la base de datos del contenedor `bd`.
    5. El reinicio del VPS y cómo, después, las dos aplicaciones vuelven a funcionar sin hacer nada.
:::
