---
title: "Tarea 2.1: Servidores web Apache y Nginx"
---

En esta tarea vas a configurar un servidor web con dos sitios y distintas formas de controlar el acceso. La vamos a realizar usando el servidor web **apache2**.

Utilizando el **escenario 1** del repositorio [ejercicios_sri](https://github.com/josedom24/ejercicios_sri) vas a crear un escenario donde existe una máquina **servidorweb** y un **cliente**. Los dos están conectados a una red NAT, por lo que tienen internet. Simulamos que el cliente accede al servidor web por una red muy aislada (`servidorweb` 10.0.0.1, y `cliente` 10.0.0.2). Antes de crearlo, pon tu clave pública en los ficheros `cloud-init/user-data-*.yaml`, sustituyendo la línea de ejemplo de `ssh-authorized-keys`.

Instala el servidor web en `servidorweb` y realiza los siguientes ejercicios:

1. **Virtual hosts**. Crea dos virtual hosts en la misma dirección IP: `www.sitio1.org` (contenido en `/var/www/sitio1`) y `www.sitio2.org` (contenido en `/var/www/sitio2`), cada uno con una página principal distinta. Configura la resolución estática en el `cliente` y en el anfitrión. Haz que, al acceder al servidor por su dirección IP, responda `www.sitio2.org`. El resto de ejercicios se hacen en `www.sitio1.org`.
2. **Control de acceso**. A la URL `www.sitio1.org/intranet` sólo se puede acceder desde la red interna (el `cliente`), no desde el anfitrión.
3. **Control de acceso y autenticación**. A la URL `www.sitio1.org/secreto` se accede directamente desde la red interna; desde el anfitrión se pide autenticación básica.
4. **Reescritura de URL**. Al acceder a `www.sitio1.org/blog/bienvenida` se muestra el fichero `/articulos/bienvenida.html` (y lo mismo con cualquier otro nombre), **sin que cambie la URL**: no es una redirección.
    * Con **apache2**: con el módulo **rewrite** en un fichero `.htaccess` (recuerda activar el módulo y permitir el uso del fichero).
    * Con **nginx**: con la directiva `rewrite` en la configuración del virtual host.

:::tip[¿Qué tienes que entregar?]
Las comprobaciones con `curl` se entregan como texto, con el comando y su salida.

1. La configuración del virtual host `www.sitio1.org` (el otro es igual). `curl` a `www.sitio1.org` y a `www.sitio2.org`. **¿Qué sitio responde cuando accedes por la IP y por qué?** Haz que, al acceder por la IP, responda `www.sitio2.org`: explica qué has cambiado y compruébalo con `curl` a la IP.
2. La configuración de `/intranet`. `curl -I` desde el `cliente` (200) y desde el anfitrión (403).
3. La configuración de `/secreto`. `curl -I` desde el `cliente` (200), desde el anfitrión (401) y desde el anfitrión con usuario y contraseña (`-u`, 200).
4. La regla de reescritura (con apache2, también lo que has cambiado para que se use el `.htaccess`). `curl -I` a `www.sitio1.org/blog/bienvenida` que muestre un 200 sin cabecera `Location`. **¿Qué diferencia hay entre una redirección y una reescritura?**
:::
