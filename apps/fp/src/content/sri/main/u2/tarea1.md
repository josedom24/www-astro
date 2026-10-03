---
title: "Tarea 2.1: Servidores web Apache y Nginx"
---

En esta tarea vas a configurar un servidor web con varios sitios y distintas formas de controlar el acceso. Elige el servidor web con el que la vas a hacer: **apache2** o **nginx**.

:::caution[Elige servidor]
En la **práctica de la unidad** tendrás que usar como servidor web **el otro**: si haces esta tarea con apache2, en la práctica usarás nginx, y al revés.
:::

Utilizando el **escenario 1** del repositorio [ejercicios_sri](https://github.com/josedom24/ejercicios_sri) vas a crear un escenario donde existe una máquina **servidorweb** y un **cliente**. Los dos están conectados a una red NAT, por lo que tienen internet. Simulamos que el cliente accede al servidor web por una red muy aislada (`servidorweb` 10.0.0.1, y `cliente` 10.0.0.2). Modifica los ficheros de configuración de cloud-init para ajustar tu configuración.

Una vez creado el escenario:

1. Instala el servidor web en `servidorweb`.
2. **Virtual hosts**. Crea dos virtual hosts en la misma dirección IP:
    * `www.sitio1.org`, con el contenido en `/var/www/sitio1`.
    * `www.sitio2.org`, con el contenido en `/var/www/sitio2`.

    Cada uno tendrá una página principal distinta y sus propios ficheros de log. Configura la resolución estática en el `cliente` y en el anfitrión.

    ¿Qué página se muestra si accedes al servidor por su dirección IP o con un nombre que no está configurado? ¿Por qué? Configura el servidor para que, en ese caso, se muestre una página que indique que el sitio no existe.

    El resto de ejercicios se hacen en el virtual host `www.sitio1.org`.
3. **Alias**. Al acceder a `www.sitio1.org/documentos` se mostrará el listado de los ficheros que hay en `/home/usuario/doc`, que está fuera del `DocumentRoot`. Ten en cuenta los permisos que necesita el usuario con el que se ejecuta el servidor web.
4. **Control de acceso**. A la URL `www.sitio1.org/intranet` sólo se debe tener acceso desde el cliente de la red interna, y no desde el anfitrión por la red pública. A la URL `www.sitio1.org/internet`, sin embargo, sólo se debe tener acceso desde el anfitrión por la red pública, y no desde la red interna.
5. **Control de acceso y autenticación**. El acceso a la URL `www.sitio1.org/secreto` se hace de forma directa desde la red interna; desde la red pública se pide autenticación básica.
6. **Reescritura de URL**. Al acceder a `www.sitio1.org/blog/bienvenida` se mostrará el fichero `/articulos/bienvenida.html` (y lo mismo con cualquier otro nombre), **sin que cambie la URL** que ve el usuario: no es una redirección.
    * Con **apache2**: hazlo con el módulo **rewrite** en un fichero `.htaccess` (recuerda que tienes que activar el módulo y permitir el uso del fichero).
    * Con **nginx**: hazlo con la directiva `rewrite` en la configuración del virtual host.

:::tip[¿Qué tienes que entregar?]
1. El servidor web que has elegido.
2. La configuración de los virtual hosts, incluida la que muestra la página de sitio no existente.
3. Comprobación con `curl` de que cada nombre muestra su página, y de lo que se muestra al acceder por la IP o con un nombre no configurado. Explica por qué.
4. Acceso a `www.sitio1.org/documentos` mostrando el listado (pon algunos ficheros para que se vea la lista).
5. Pruebas de acceso a `www.sitio1.org/intranet` y `www.sitio1.org/internet` desde el anfitrión y desde el cliente interno.
6. Pruebas de acceso a `www.sitio1.org/secreto` desde el anfitrión y desde el cliente interno.
7. Con apache2, el contenido del fichero `.htaccess` y lo que has tenido que cambiar para que se use; con nginx, la configuración de la reescritura. Comprobación de que al acceder a `www.sitio1.org/blog/bienvenida` se muestra el artículo y no se produce una redirección.
:::
