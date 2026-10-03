---
title: "Tarea 2.2: Proxy inverso y balanceador de carga"
---

En esta tarea vas a configurar un **proxy inverso** que da acceso a dos sitios web internos y un **balanceador de carga** que reparte las peticiones entre dos servidores web. Elige el servidor con el que vas a hacer el proxy inverso: **apache2** o **nginx**.

:::caution[Elige servidor]
En la **práctica de la unidad** tendrás que usar como proxy inverso **el otro**: si haces esta tarea con apache2, en la práctica usarás nginx, y al revés.
:::

## Parte 1: Proxy inverso

Vamos a usar el **escenario2** del repositorio [ejercicios_sri](https://github.com/josedom24/ejercicios_sri) para montar el siguiente escenario:

![img](img/proxyinverso.png)

* Una máquina `proxy` que está conectada al exterior por una red NAT y a una red interna muy aislada (dirección `10.0.0.1`).
* Una máquina `backend` que tendrá un servidor web interno, conectada a la red interna muy aislada (dirección `10.0.0.2`). También está conectada a la red NAT, pero sólo para poder configurarla con la receta ansible.

Tenemos a nuestra disposición un playbook de ansible que va a instalar un servidor web apache2 en la máquina `backend` y puede crear una lista de virtual hosts. Para configurarlos tienes que modificar la lista de diccionarios llamada `virtualhosts` que encuentras en el fichero `groups_vars/all`. Configura esa variable para crear dos virtual hosts:

* Uno en el fichero `vhost1.conf` que se acceda con el nombre `interno.example1.org`, cuyo DocumentRoot sea `/var/www/example1`.
* Otro en el fichero `vhost2.conf` que se acceda con el nombre `interno.example2.org`, cuyo DocumentRoot sea `/var/www/example2`.

Además tienes que indicar en el inventario la dirección IP del servidor `backend` en la red NAT, por donde vamos a realizar la configuración. Crea el escenario y ejecuta el playbook.

1. Instala el servidor elegido en la máquina `proxy` y configúralo para acceder a las páginas del `backend`: a la primera con el nombre `www.app1.org` y a la segunda con el nombre `www.app2.org`. Recuerda que debes añadir en la resolución estática del `proxy` los nombres con los que se accede internamente a las páginas web.
2. **La cabecera `Host`**. Modifica la configuración para que el proxy envíe al `backend` el nombre que ha pedido el cliente (`ProxyPreserveHost On` en apache2, `proxy_set_header Host $host` en nginx). ¿Qué página se muestra ahora al acceder a `www.app1.org` y a `www.app2.org`? Comprueba en los logs del `backend` qué virtual host atiende la petición y explica lo que ocurre. Después, vuelve a dejar la configuración que funciona.
3. **Redirecciones**. En el `backend`, configura el virtual host `interno.example1.org` para que al acceder a `/directorio` se produzca una redirección a `/nuevodirectorio`. Accede a `http://www.app1.org/directorio` a través del proxy:
    * Con **apache2**, compara lo que ocurre con la directiva `ProxyPassReverse` y sin ella.
    * Con **nginx**, compara lo que ocurre con `proxy_redirect off;` y con el comportamiento por defecto.

## Parte 2: Balanceador de carga

Vamos a usar los ficheros del **escenario3** del repositorio [ejercicios_sri](https://github.com/josedom24/ejercicios_sri) para crear un escenario para trabajar con el balanceador de carga. Para ello crea el escenario y posteriormente pasa el playbook de ansible.

En este escenario los servidores web ejecutan php, y se ha copiado en el DocumentRoot un fichero `app.php` que utilizaremos posteriormente.

![img](img/lb.png)

4. Instala en el servidor `balanceador` **haproxy** y configúralo para balancear la carga entre los dos servidores web `apache1` y `apache2`. Configura la resolución estática para acceder al balanceador con el nombre `www.example.org`. Activa la **página de estadísticas** en `http://www.example.org/ha_stats`, con autenticación y con la opción `stats admin`, que permite deshabilitar y habilitar los servidores desde la propia página.
5. **La IP del cliente**. Comprueba en los logs de `apache1` o `apache2` qué dirección IP aparece como cliente. ¿Por qué? Configura haproxy para que envíe la IP real del cliente en la cabecera `X-Forwarded-For` (`option forwardfor`) y cambia el formato de log de los servidores web para que se registre esa IP.
6. **Rendimiento**. La utilidad [ab](http://httpd.apache.org/docs/2.4/programs/ab.html) (Apache Benchmark), del paquete `apache2-utils`, sirve para hacer pruebas de carga a un servidor web. Por ejemplo:

    ```
    ab -n 1000 -c 100 http://www.example.org/app.php
    ```

    El comando simula 100 usuarios al mismo tiempo haciendo 1000 peticiones al fichero `app.php`, que ejecuta un proceso muy costoso (el cálculo del número pi). De la salida nos interesa el parámetro `Requests per second:`, el número de peticiones servidas por segundo.

    Deshabilita un nodo desde la página de estadísticas y haz la prueba. Habilita los dos nodos y vuelve a hacerla. ¿Han subido las peticiones por segundo? ¿Por qué?
7. **Afinidad de sesión**. Crea en los dos servidores web el fichero `sesion.php`:

    ```php
    <?php
    session_start();
    $_SESSION['visitas'] = ($_SESSION['visitas'] ?? 0) + 1;
    echo "<h1>Servidor: " . gethostname() . "</h1>";
    echo "<p>Visitas en esta sesión: " . $_SESSION['visitas'] . "</p>";
    ?>
    ```

    Accede varias veces a `http://www.example.org/sesion.php` desde el navegador. ¿Qué ocurre con el contador de visitas? ¿Por qué? Configura haproxy para que un mismo cliente vaya siempre al mismo servidor usando una cookie (`cookie SERVERID insert`) y comprueba que el contador ya funciona.

:::tip[¿Qué tienes que entregar?]
**Parte 1**

1. El servidor que has elegido para el proxy inverso.
2. La configuración del proxy inverso y comprobación del acceso a `www.app1.org` y `www.app2.org`.
3. Lo que ocurre al enviar al `backend` el nombre que ha pedido el cliente: la página que se muestra, la línea del log del `backend` y tu explicación.
4. La configuración de la redirección en el `backend`. Peticiones HEAD con `curl` a `http://www.app1.org/directorio` en los dos casos. ¿Qué cabecera has comprobado? Explica la diferencia.

**Parte 2**

5. La configuración de haproxy y comprobación de que el balanceo funciona.
6. Captura de la página de estadísticas.
7. Una línea del log de un servidor web antes y después de configurar la IP real del cliente, la configuración que has cambiado y la explicación.
8. La salida de `ab` con un nodo y con dos, y tu explicación.
9. Lo que ocurre con el contador antes y después de configurar la afinidad, la configuración de haproxy y la explicación.
:::
