---
title: "Práctica: Protocolo DNS"
---

Esta práctica se hace sobre el **escenario de OpenStack** que montaste en la práctica de Infraestructura Virtual: las máquinas `router`, `dns`, `web` y `bd` (los nombres definitivos los elegimos en clase). Necesitas ese escenario funcionando.

El DNS que vas a montar aquí es el **tuyo**: un servidor bind9 con el que gestionas tu propio dominio. **No tiene ninguna relación con el DNS de OpenStack (Designate)** que has visto en el ejercicio 6 de la unidad de OpenStack: no uses el mismo nombre de dominio.

## Instalación del servidor DNS

Vamos a instalar un servidor DNS en **`dns`** que nos permita gestionar la resolución directa e inversa de nuestros nombres. Cada alumno va a poseer un servidor DNS con autoridad sobre un subdominio de nuestro dominio principal `gonzalonazareno.org`, que se llamará `tu_nombre.gonzalonazareno.org`. **`tu_nombre` no puede coincidir con tu usuario de OpenStack**, porque OpenStack ya usa ese nombre para su propio DNS.

Hay que tener en cuenta los siguientes aspectos:

1. El servidor DNS se va a configurar de la siguiente manera:
    * El servidor DNS se llama `dns.tu_nombre.gonzalonazareno.org` y va a ser el servidor con autoridad para la zona `tu_nombre.gonzalonazareno.org`.
    * El servidor debe resolver el nombre de todas las máquinas del escenario.
    * Vamos a usar vistas en bind9, para que el nombre de `router` se corresponda con una IP distinta según desde dónde se realice la consulta. Vamos a crear dos vistas: una **interna**, para cuando se hacen consultas desde las máquinas de nuestro escenario, y otra **externa**, para cuando se hagan consultas desde el exterior. En este ejercicio **crea solo la vista interna** (piensa qué redes forman el escenario).
    * Vamos a crear las zonas de resolución inversas correspondientes al direccionamiento de las redes privadas (`192.168.0.0/24` y `172.16.0.0/16`).
2. Configura como servidor DNS de nuestras máquinas a **`dns`**. Las instancias no usan DHCP: su DNS lo configuró cloud-init de forma estática, y el cambio tiene que ser **permanente**. Cada máquina lo hace de una forma distinta, e investigarlo es parte de la práctica:
    * En `router` (Debian) tenemos instalado `systemd-resolved`. Investiga cómo cambiar el servidor DNS cuando tenemos este sistema de resolución funcionando.
    * En `bd` (Ubuntu) el DNS está en la configuración de netplan.
    * En `web` (Rocky Linux) la red la gestiona NetworkManager.
    * La propia `dns` debe usar también su servidor.

    Mientras no configures el servidor como forwarder (lo harás más adelante), las máquinas no resolverán nombres de Internet: si necesitas instalar o actualizar paquetes, hazlo antes de cambiar el DNS.
3. Para que podamos usar los nombres cortos (por ejemplo, para hacer `ssh bd`) es necesario que el parámetro `search` del fichero `/etc/resolv.conf` esté configurado con nuestro nombre de dominio. Investiga cómo hacer el cambio del parámetro `search` en las cuatro máquinas.

La dirección `192.168.0.4` de `Red_DMZ` está reservada para el servidor de correo del módulo de SRI: no la uses.

:::tip[Entrega]
1. Entrega la configuración DNS de cada máquina: donde se compruebe que el servidor que están utilizando es **`dns`** y que tienes configurado de manera adecuada el parámetro `search`.
2. Entrega la definición de las vistas y de las zonas.
3. Entrega el resultado de las siguientes consultas desde **`web`**:
    * El servidor DNS con autoridad sobre la zona del dominio `tu_nombre.gonzalonazareno.org`.
    * La dirección IP de `router`, `dns`, `web` y `bd`.
    * Una resolución inversa de IP fija en cada una de las redes.
4. Desde `router` entrega la salida de `ping web` y `ssh bd` para comprobar que funcionan los nombres cortos en la resolución.
:::

## Delegación de la zona

1. Será necesario realizar consultas desde el exterior (ya que vamos a hacer una delegación del subdominio). Por lo tanto tienes que realizar las siguientes tareas:
    * Determina la regla DNAT en `router` para que podamos hacer consultas DNS desde el exterior (el puerto 53, UDP y TCP, hacia `dns`). Si el cortafuegos de `router` filtra el reenvío, permite ese tráfico.
    * **Abre el puerto 53 (UDP y TCP) en el grupo de seguridad `sg_dns`**: el DNAT por sí solo no basta, porque el cortafuegos de OpenStack de `dns` bloquea todo lo que no esté permitido.
    * Prueba a hacer una consulta desde tu anfitrión usando la IP flotante de `router`.
    * Crea la vista **externa** para cuando se realizan consultas desde el exterior.
2. Indica al profesor el nombre de tu dominio para que pueda realizar la delegación en el servidor DNS principal `dns.gonzalonazareno.org`. Ahora prueba, desde tu anfitrión, a resolver tus nombres pero preguntando al DNS de nuestra red (`172.22.0.1`).
3. Queremos que el servidor DNS que has configurado también pueda resolver los nombres de los DNS de los compañeros. Para ello lo vamos a configurar como **servidor DNS forward/caché**, de tal manera que las consultas las realizará sobre nuestro servidor `172.22.0.1`. Para configurar el servidor como forwarder hay que modificar el parámetro en el fichero `named.conf.options`.

    ```
    forwarders {
	    172.22.0.1;
	};
    ```

:::tip[Entrega]
1. Entrega la definición de la nueva vista.
2. Entrega la regla de DNAT de `router` y la regla del grupo de seguridad `sg_dns`.
3. Entrega el resultado de las siguientes consultas desde la máquina anfitriona, preguntando a nuestro servidor DNS `172.22.0.1`:
    * El servidor DNS con autoridad sobre la zona del dominio `tu_nombre.gonzalonazareno.org`.
    * La dirección IP de `router`.
:::

## Servidor web

El servidor web `httpd` ya lo instalaste en **`web`** en la práctica de Infraestructura Virtual. Configura el DNS de forma correcta para que se pueda acceder a la página web (`www.tu_nombre.gonzalonazareno.org`) desde las máquinas del escenario y desde el exterior. Piensa a qué dirección tiene que apuntar `www` en cada vista, y qué hace falta en `router` para que desde el exterior se llegue hasta `web`.

:::tip[Entrega]
1. Entrega el resultado de la consulta a `www.tu_nombre.gonzalonazareno.org` desde el exterior preguntando a nuestro servidor DNS `172.22.0.1`.
2. Entrega el resultado de la consulta a `www.tu_nombre.gonzalonazareno.org` desde una máquina interna.
3. Realiza una consulta a tu DNS preguntando por el nombre de un DNS de un compañero, para comprobar si se está comportando como DNS forward/caché.
4. Entrega una captura de pantalla accediendo a `www.tu_nombre.gonzalonazareno.org` donde se vea la página web desde el exterior y desde el interior.
:::
