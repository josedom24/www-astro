---
title: "Aprende Incus con openLAB: instancias e imágenes"
date: 2026-11-11
slug: "blog/2026/11/aprende-incus-con-openlab-1-instancias-e-imagenes"
tags:
  - "Incus"
  - "Virtualización"
  - "openLAB"
---

![Aprende Incus con openLAB: instancias e imágenes](/pledin/assets/2026/11/aprende-incus-1.svg)

[openLAB](https://git.josedomingo.org/josedom24/openlab) crea escenarios de prácticas a partir de un fichero YAML: contenedores y máquinas virtuales conectados por redes, con los usuarios, la red y los paquetes ya configurados. Para hacerlo no virtualiza por su cuenta, sino que se apoya en **[Incus](https://linuxcontainers.org/incus/)**. Por eso openLAB también es una buena excusa para aprender Incus: escribimos un escenario, lo creamos con una orden y después miramos con las herramientas de Incus qué ha pasado por dentro.

Esta es la primera entrada de una serie de cuatro sobre Incus y openLAB.

## ¿Qué es Incus?

Incus es un gestor de **contenedores de sistema** y **máquinas virtuales** de software libre. Es la continuación comunitaria de LXD y lo mantiene el proyecto [Linux Containers](https://linuxcontainers.org/), el mismo que desarrolla LXC.

- Un **contenedor de sistema** es un Linux completo, con su systemd, sus servicios, sus usuarios y su red, que comparte el núcleo con el anfitrión. No es un contenedor de aplicación como los de Docker, que normalmente ejecutan un solo proceso, sino una máquina entera: entramos en él, instalamos paquetes y configuramos servicios. Como no arranca un núcleo propio, se pone en marcha en segundos y apenas gasta recursos.
- Una **máquina virtual**, gestionada con QEMU y KVM, tiene su propio núcleo. Es más pesada, pero puede hacer cosas que un contenedor no puede.

Incus maneja los dos tipos de la misma forma, con las mismas órdenes, y por eso los llama a ambos **instancias**. En esta entrada trabajaremos con contenedores; las diferencias con las máquinas virtuales las veremos en la siguiente.

Incus funciona con un **demonio** (`incusd`), que es el que crea y gestiona todo, y un **cliente** (`incus`), la orden con la que le hablamos. El cliente se comunica con el demonio a través de una API REST, así que el mismo cliente puede gestionar también un Incus remoto. Podemos ver las versiones de los dos:

```
$ incus version
Client version: 6.0.4
Server version: 6.0.4
```

<!--more-->

## Lo que ha hecho `openlab install`

Partimos de un equipo con Debian en el que acabamos de instalar openLAB siguiendo [sus instrucciones](https://git.josedomingo.org/josedom24/openlab#instalación), es decir, después de ejecutar `openlab install` y de volver a entrar en la sesión. Iremos haciendo el ejercicio paso a paso y viendo la salida de cada orden.

Veamos primero qué ha hecho `openlab install` desde el punto de vista de Incus:

1. **Ha instalado el paquete `incus`** de la distribución.
2. **Ha añadido nuestro usuario al grupo `incus-admin`**. Los miembros de ese grupo pueden hablar con el demonio sin `sudo`; por eso hay que cerrar la sesión y volver a entrar después de instalar.

   ```
   $ id -nG
   usuario cdrom floppy sudo audio dip video plugdev netdev incus-admin
   ```

3. **Ha inicializado Incus** con `incus admin init --minimal`. Esta orden crea lo mínimo para empezar a trabajar: un pool de almacenamiento, una red y un perfil.

El **pool de almacenamiento** `default` es donde se guardan las instancias y las imágenes. Usa el driver `dir`: cada instancia es un directorio dentro de `/var/lib/incus`.

```
$ incus storage list
+---------+--------+-------------+---------+---------+
|  NAME   | DRIVER | DESCRIPTION | USED BY |  STATE  |
+---------+--------+-------------+---------+---------+
| default | dir    |             | 1       | CREATED |
+---------+--------+-------------+---------+---------+
```

La **red** `incusbr0` es un puente en el anfitrión con DHCP, DNS y salida a internet por NAT. Es la que openLAB llama *red exterior*. Las redes con `MANAGED` a `NO` son las interfaces del propio anfitrión, que Incus muestra pero no gestiona:

```
$ incus network list
+----------+----------+---------+-----------------+---------------------------+-------------+---------+---------+
|   NAME   |   TYPE   | MANAGED |      IPV4       |           IPV6            | DESCRIPTION | USED BY |  STATE  |
+----------+----------+---------+-----------------+---------------------------+-------------+---------+---------+
| enp5s0   | physical | NO      |                 |                           |             | 0       |         |
+----------+----------+---------+-----------------+---------------------------+-------------+---------+---------+
| incusbr0 | bridge   | YES     | 10.125.174.1/24 | fd42:21de:d612:ecd2::1/64 |             | 1       | CREATED |
+----------+----------+---------+-----------------+---------------------------+-------------+---------+---------+
| lo       | loopback | NO      |                 |                           |             | 0       |         |
+----------+----------+---------+-----------------+---------------------------+-------------+---------+---------+
```

El rango (`10.125.174.0/24` en este caso) lo elige Incus al azar al inicializarse, así que en tu equipo será otro.

Por último, el **perfil** `default`:

```
$ incus profile show default
config: {}
description: Default Incus profile
devices:
  eth0:
    name: eth0
    network: incusbr0
    type: nic
  root:
    path: /
    pool: default
    type: disk
name: default
used_by: []
project: default
```

Un **perfil** es un conjunto de configuración y de **dispositivos** que se aplica a las instancias. Este tiene dos dispositivos: una tarjeta de red `eth0` conectada a `incusbr0` y un disco raíz `root` en el pool `default`. Cuando creamos una instancia sin decir nada más, recibe el perfil `default` y, con él, red y disco.

> La inicialización también se puede hacer de forma interactiva con `incus admin init`, respondiendo a sus preguntas, o a partir de un fichero YAML (un *preseed*) con `incus admin init --preseed < fichero.yaml`. Para ver en ese formato la configuración actual: `incus admin init --dump`.

## Nuestro primer escenario

Empezamos por el ejemplo más sencillo de openLAB, `ejemplos/una-maquina`:

```yaml
descripcion: Una instancia Debian.

instancias:
  debian:
    imagen: debian/13
    tipo: c.small
```

Una sola instancia con Debian 13, del tipo `c.small`. Como no dice nada de redes, se conecta a la red exterior.

Los **tipos** de openLAB funcionan como los **sabores** (*flavors*) de OpenStack: en lugar de indicar en cada instancia si es un contenedor o una máquina virtual, cuántas CPU, cuánta memoria y cuánto disco tiene, se elige un tipo de una lista ya definida. Los tipos disponibles se ven con `openlab types`:

```
$ openlab types
Tipos de instancia (tipo: en cada instancia del escenario.yaml)
  ✔ contenedor   contenedor       sin límites   (el de las que no dicen nada)
  ✔ c.small      contenedor       1 CPU · 512MiB
  ✔ c.medium     contenedor       2 CPU · 1GiB
  ✔ c.large      contenedor       4 CPU · 2GiB
  ✔ vm           máquina virtual  1 CPU · 1GiB · 10GiB
  ✔ vm.small     máquina virtual  1 CPU · 1GiB · 10GiB
  ✔ vm.medium    máquina virtual  2 CPU · 2GiB · 20GiB
  ✔ vm.large     máquina virtual  4 CPU · 4GiB · 40GiB
  ✔ vm.desktop   máquina virtual  2 CPU · 4GiB · 20GiB
  ✔ vm.windows   máquina virtual  2 CPU · 4GiB · 40GiB
    Cambiar de tipo sin cambiar de clase se aplica con openlab up (un contenedor, en caliente; una VM,
    reiniciándola); el disco de una VM es el de cuando se creó. Pasar de contenedor a VM, o al revés, rehace la instancia.
```

Los que empiezan por `c.` son contenedores y los que empiezan por `vm`, máquinas virtuales. `c.small` es, por tanto, un contenedor con 1 CPU y 512 MiB de memoria. Incus no conoce estos tipos: es openLAB quien traduce cada uno a opciones de la instancia, como veremos enseguida.

Los ejemplos están en el repositorio y no se instalan con `openlab install`, así que, si no lo has clonado ya, hazlo antes de entrar en su directorio:

```
$ git clone https://git.josedomingo.org/josedom24/openlab.git
```

La creamos:

```
$ cd openlab/ejemplos/una-maquina
$ openlab up
Escenario una-maquina
    Una instancia Debian.

Comprobaciones
  ✔ Los nombres de las instancias están libres.
  ✔ Las redes no se solapan con las que ya hay.
  ✔ Las imágenes existen.

Redes
  ✔ No tiene redes propias: usa la red exterior.

Instancias
  ✔ debian lista (15 s).

Listo
  ✔ debian       eth0 10.125.174.10                       openlab shell debian
    Usuario: usuario, contraseña usuario.
```

La primera vez tarda algo más si la imagen no está ya en la caché de Incus. Normalmente ya lo estará: `openlab install` descarga esta misma imagen para su prueba; solo si se instaló con `--no-test` habrá que descargarla ahora.

## ¿Qué órdenes de Incus ha ejecutado `openlab up`?

La orden de Incus para crear una instancia y arrancarla es `incus launch`:

```
incus launch <imagen> <nombre>
```

Probemos con un ejemplo sencillo: una instancia llamada `prueba` creada a partir de la imagen de Debian 13.

```
$ incus launch images:debian/13 prueba
Launching prueba

$ incus list prueba
+--------+---------+-----------------------+------------------------------------------------+-----------+-----------+
|  NAME  |  STATE  |         IPV4          |                      IPV6                      |   TYPE    | SNAPSHOTS |
+--------+---------+-----------------------+------------------------------------------------+-----------+-----------+
| prueba | RUNNING | 10.125.174.168 (eth0) | fd42:21de:d612:ecd2:1266:6aff:fe0a:19d6 (eth0) | CONTAINER | 0         |
+--------+---------+-----------------------+------------------------------------------------+-----------+-----------+
```

En unos segundos tenemos un contenedor Debian en marcha, con una IP de `incusbr0`. Podemos ejecutar órdenes dentro con `incus exec` y, cuando ya no nos sirva, borrarlo (`--force` lo para antes si está en marcha):

```
$ incus exec prueba -- hostname
prueba

$ incus delete --force prueba
```

Esta instancia, sin embargo, es tal cual viene en la imagen: no tiene nuestro usuario, ni el servidor SSH, ni ninguna configuración de red propia. openLAB lo hace un poco más complicado porque sus instancias tienen que quedar **configuradas** según el `escenario.yaml`, y para eso usa **cloud-init**.

Una imagen es genérica: no sabe cómo se llama la instancia, qué usuarios debe tener, qué paquetes hay que instalar ni cómo se configura su red. [cloud-init](https://cloud-init.io/) es un programa que viene instalado en la imagen y que se ejecuta en el **primer arranque**: lee una configuración que le da la plataforma de virtualización y la aplica.

**cloud-init no forma parte de Incus.** Es un proyecto independiente (lo empezó Canonical), que se ejecuta **dentro** de la instancia, y es el estándar para configurar máquinas en la nube: lo usan OpenStack, AWS, Azure, Proxmox… Cada plataforma le hace llegar la configuración a su manera, y lo único que hace Incus es entregársela a sus instancias. Por eso un mismo fichero de cloud-init sirve, casi sin cambios, en cualquiera de ellas. Esa configuración tiene dos partes:

- el **user-data**: usuarios, contraseñas, claves SSH, paquetes, ficheros que hay que escribir y órdenes que hay que ejecutar;
- el **network-config**: la red del primer arranque.

openLAB usa el `network-config` solo para que la instancia tenga red mientras se configura: la interfaz que ya está en la red exterior o, si no tiene ninguna, una temporal para instalar los paquetes. La configuración definitiva de las interfaces del escenario la escribe en el `user-data`, con `write_files`, para el gestor de red de la distribución. Así, cada instancia sale configurada sin que nadie tenga que entrar en ella.

> Toda la información está en la [documentación de cloud-init](https://cloudinit.readthedocs.io/en/latest/). Las directivas que se pueden usar en el user-data (`users`, `packages`, `write_files`, `runcmd`…) están en la [referencia de sus módulos](https://cloudinit.readthedocs.io/en/latest/reference/modules.html), y hay muchos [ejemplos](https://cloudinit.readthedocs.io/en/latest/reference/examples.html). Cómo se lo entrega Incus a las instancias se explica en [su documentación](https://linuxcontainers.org/incus/docs/main/cloud-init/).

`incus launch` hace dos cosas seguidas: `incus init`, que crea la instancia sin arrancarla, e `incus start`, que la arranca. openLAB usa esas dos órdenes por separado, y entre medias espera a cloud-init y reinicia la instancia. Con la instancia `debian` de nuestro escenario, lo que ha hecho equivale a:

```bash
# 1. Crear la instancia, sin perfiles, con su configuración y sus dispositivos en YAML
incus init images:debian/13/cloud una-maquina-debian --no-profiles < instancia.yaml

# 2. Arrancarla: en el primer arranque, cloud-init la configura
incus start una-maquina-debian

# 3. Esperar a que cloud-init termine
incus exec una-maquina-debian -- cloud-init status --wait

# 4. Reiniciarla, para que arranque con su configuración definitiva
incus stop una-maquina-debian
incus start una-maquina-debian
```

Lo que contiene `instancia.yaml` lo vemos a continuación, porque es lo que guarda la instancia en su configuración.

## ¿Qué ha pasado en Incus?

### La instancia

```
$ incus list
+--------------------+---------+----------------------+------------------------------------------------+-----------+-----------+
|        NAME        |  STATE  |         IPV4         |                      IPV6                      |   TYPE    | SNAPSHOTS |
+--------------------+---------+----------------------+------------------------------------------------+-----------+-----------+
| una-maquina-debian | RUNNING | 10.125.174.10 (eth0) | fd42:21de:d612:ecd2:1266:6aff:fe50:b436 (eth0) | CONTAINER | 0         |
+--------------------+---------+----------------------+------------------------------------------------+-----------+-----------+
```

La instancia se llama **`una-maquina-debian`**: openLAB nombra cada instancia como `<escenario>-<instancia>`, para que no choquen dos escenarios que tengan una instancia con el mismo nombre (si la combinación coincide —`a` + `b-c` y `a-b` + `c` dan `a-b-c`—, openLAB avisa y no crea nada). Es un contenedor (`CONTAINER`), está en marcha y el DHCP de `incusbr0` le ha dado la IP `10.125.174.10`.

Veamos su configuración completa (hemos recortado algunas líneas largas con `...`):

```
$ incus config show una-maquina-debian
architecture: x86_64
config:
  cloud-init.network-config: |
    version: 2
    ethernets:
      eth0:
        dhcp4: true
  cloud-init.user-data: |
    #cloud-config
    hostname: debian
    users:
    - name: usuario
    ...
  image.architecture: amd64
  image.description: Debian trixie amd64 (20261102_05:24)
  image.os: Debian
  image.release: trixie
  image.serial: "20261102_05:24"
  image.type: squashfs
  image.variant: cloud
  limits.cpu: "1"
  limits.memory: 512MiB
  user.escenario: una-maquina
  user.escenario.definicion: '{"claves_ssh":null,"cloud-init":{},"gestor_red":"networkd","imagen":"debian/13", ...}'
  user.escenario.directorio: /home/usuario/openlab/ejemplos/una-maquina
  user.escenario.huella: 52699542b2f6
  user.escenario.listo: si
  user.escenario.maquina: debian
  user.escenario.tipo: c.small
  user.escenario.usuario: usuario
  volatile.base_image: 1a6be58879a020a5b93ab4c851b7194fe1a6812635009b53c7db85912bc42224
  volatile.cloud-init.instance-id: 6fa17dff-e8b2-4467-affc-9ca84ed8f74a
  volatile.eth0.host_name: veth863dfa4b
  volatile.eth0.hwaddr: 10:66:6a:50:b4:36
  volatile.idmap.base: "0"
  ...
  volatile.last_state.power: RUNNING
  volatile.uuid: e4bbca74-264c-46d5-a502-65edccd99c37
  ...
devices:
  eth0:
    name: eth0
    network: incusbr0
    type: nic
  root:
    path: /
    pool: default
    type: disk
ephemeral: false
profiles: []
stateful: false
description: ""
```

La configuración tiene dos partes: las **opciones** (`config`) y los **dispositivos** (`devices`). Veamos las opciones por grupos:

- **`cloud-init.*`**: la configuración que Incus le entrega a cloud-init para el primer arranque. Incus solo la guarda y se la pasa; quien la aplica, dentro de la instancia, es cloud-init. La explicamos más abajo.
- **`image.*`**: de qué imagen viene la instancia. Las copia Incus de la imagen al crearla.
- **`limits.cpu` y `limits.memory`**: los recursos del tipo `c.small`. En un contenedor son un **tope**: sin ellos, el contenedor usaría lo que necesitara del anfitrión.
- **`user.*`**: claves propias de openLAB. También las explicamos más abajo.
- **`volatile.*`**: datos que Incus genera y mantiene él mismo, como la imagen de la que viene la instancia (`volatile.base_image`), la MAC de su tarjeta (`volatile.eth0.hwaddr`), la interfaz del anfitrión a la que está conectada (`volatile.eth0.host_name`) o su identificador (`volatile.uuid`). No se tocan a mano.

En `devices` están los mismos dispositivos que en el perfil `default`: la tarjeta `eth0` en `incusbr0` y el disco `root` en el pool `default`. Sin embargo, fíjate en la línea **`profiles: []`**: la instancia **no tiene ningún perfil**. openLAB crea las instancias con `--no-profiles` y les pone directamente sus dispositivos. Lo hace por dos motivos:

- **Las interfaces de cada instancia son las del fichero.** El perfil `default` pone siempre una `eth0` en `incusbr0`, pero muchas instancias de un escenario no deben estar en la red exterior. Por ejemplo, un cliente que solo está en una red interna, donde su `eth0` es la de esa red. Con el perfil habría que tapar en cada instancia la interfaz heredada. Sin él, cada instancia lleva exactamente las interfaces que dice el fichero, en su orden (`eth0`, `eth1`…).
- **El escenario no depende de cómo esté configurado cada equipo.** Si alguien modifica su perfil `default`, por ejemplo añadiéndole un disco, unos límites o su propia configuración de cloud-init, esos cambios no llegan a las instancias de openLAB. Así, el mismo `escenario.yaml` produce las mismas instancias en el equipo del profesor y en el de cada alumno.

Eso no quiere decir que openLAB ignore el perfil `default`: lo **lee**, pero no lo aplica. Antes de crear nada, lo consulta para saber cuál es la red exterior (la de su `eth0`, normalmente `incusbr0`) y en qué pool va el disco raíz (normalmente `default`). Por eso funciona también en un equipo donde Incus ya estaba configurado con otros nombres. Y si al perfil le falta la red o el disco, openLAB avisa de que Incus no está inicializado.

Además, como la instancia no hereda nada, `incus config show` muestra toda su configuración, sin tener que añadir lo que viene de los perfiles.

### La imagen

Las instancias se crean a partir de **imágenes**: un sistema de ficheros con una distribución ya instalada. Incus las descarga de un **servidor de imágenes remoto**:

```
$ incus remote list
+-----------------+------------------------------------+---------------+-------------+--------+--------+--------+
|      NAME       |                URL                 |   PROTOCOL    |  AUTH TYPE  | PUBLIC | STATIC | GLOBAL |
+-----------------+------------------------------------+---------------+-------------+--------+--------+--------+
| images          | https://images.linuxcontainers.org | simplestreams | none        | YES    | NO     | NO     |
+-----------------+------------------------------------+---------------+-------------+--------+--------+--------+
| local (current) | unix://                            | incus         | file access | NO     | YES    | NO     |
+-----------------+------------------------------------+---------------+-------------+--------+--------+--------+
```

`images:` es el servidor del proyecto Linux Containers, con imágenes de muchas distribuciones, y `local` es nuestro propio Incus. Cuando en el escenario escribimos `imagen: debian/13`, openLAB usa la imagen `images:debian/13/cloud`. Veamos qué imágenes de Debian 13 ofrece el servidor (es una lista larga; mostramos el principio):

```
$ incus image list images:debian/13 -c lfdtsu
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
|              ALIAS               | FINGERPRINT  |              DESCRIPTION               |      TYPE       |   SIZE    |     UPLOAD DATE      |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
| debian/13 (7 more)               | 6f0c47d71aa4 | Debian trixie amd64 (20261102_05:24)   | CONTAINER       | 100.63MiB | 2026/11/02 01:00 CET |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
| debian/13 (7 more)               | 050b18d439fc | Debian trixie amd64 (20261102_05:24)   | VIRTUAL-MACHINE | 348.08MiB | 2026/11/02 01:00 CET |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
| debian/13/arm64 (3 more)         | 808b3ef5dc07 | Debian trixie arm64 (20261102_05:24)   | CONTAINER       | 98.02MiB  | 2026/11/02 01:00 CET |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
...
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
| debian/13/cloud (3 more)         | 1a6be58879a0 | Debian trixie amd64 (20261102_05:24)   | CONTAINER       | 132.38MiB | 2026/11/02 01:00 CET |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
| debian/13/cloud (3 more)         | 011ecfa2c4e3 | Debian trixie amd64 (20261102_05:24)   | VIRTUAL-MACHINE | 378.61MiB | 2026/11/02 01:00 CET |
+----------------------------------+--------------+----------------------------------------+-----------------+-----------+----------------------+
...
```

Con `-c` elegimos las columnas, para que la tabla no salga demasiado ancha: `l` (alias), `f` (huella), `d` (descripción), `t` (tipo), `s` (tamaño) y `u` (fecha de subida). Las demás letras se ven con `incus image list --help`.

Aquí vemos varias cosas:

- Cada imagen se identifica por su **huella** (*fingerprint*) y tiene uno o varios **alias** (`debian/13`, `debian/13/cloud`…).
- Hay imágenes para **contenedor** y para **máquina virtual**, y para varias **arquitecturas** (`amd64`, `arm64`…).
- Hay dos **variantes** principales: la normal (`debian/13`), que es un sistema mínimo, y la `cloud` (`debian/13/cloud`), que trae además **cloud-init**. openLAB necesita la variante `cloud`.

Al crear la instancia, Incus ha descargado la imagen y la ha guardado en una **caché local**. Su huella coincide con la `volatile.base_image` de la instancia:

```
$ incus image list
+-------+--------------+--------+--------------------------------------+--------------+-----------+-----------+----------------------+
| ALIAS | FINGERPRINT  | PUBLIC |             DESCRIPTION              | ARCHITECTURE |   TYPE    |   SIZE    |     UPLOAD DATE      |
+-------+--------------+--------+--------------------------------------+--------------+-----------+-----------+----------------------+
|       | 1a6be58879a0 | no     | Debian trixie amd64 (20261102_05:24) | x86_64       | CONTAINER | 132.38MiB | 2026/11/02 16:10 CET |
+-------+--------------+--------+--------------------------------------+--------------+-----------+-----------+----------------------+
```

La próxima instancia de Debian 13 ya no tendrá que descargar nada. Las imágenes de la caché que dejan de usarse se borran solas pasados unos días.

### Primer arranque: cloud-init

Ya hemos visto que la configuración de cloud-init está en dos opciones de la instancia: `cloud-init.user-data` y `cloud-init.network-config`. El reparto de papeles es este: Incus guarda esa configuración y, en el primer arranque, se la ofrece a la instancia; cloud-init, que es un programa de la imagen, la lee y la aplica. El `network-config` solo se ocupa de ese primer arranque: la red definitiva del escenario va en el `user-data`.

La configuración que genera openLAB a partir del `escenario.yaml` se puede ver sin crear nada con `openlab check --cloud-init`:

```
$ openlab check --cloud-init
  ✔ Escenario una-maquina: el fichero es correcto (1 instancia, 0 redes propias).

cloud-init de debian
#cloud-config
hostname: debian
users:
- name: usuario
  groups:
  - sudo
  shell: /bin/bash
  lock_passwd: false
chpasswd:
  expire: false
  users:
  - name: usuario
    password: usuario
    type: text
ssh_pwauth: true
packages:
- openssh-server
write_files:
- path: /etc/systemd/network/20-eth0.network
  content: |
    [Match]
    Name=eth0

    [Network]
    DHCP=ipv4
  permissions: '0644'
  defer: true
- path: /etc/cloud/cloud.cfg.d/99-escenario.cfg
  content: |
    # escenario: cloud-init ya no toca la red ni el nombre de la instancia
    network: {config: disabled}
    preserve_hostname: true
  permissions: '0644'
  defer: true
runcmd:
- echo debian > /etc/hostname
- hostname debian
...
```

Pone el nombre de la máquina, crea el usuario `usuario` (con la contraseña `usuario` y en el grupo `sudo`), instala el servidor SSH, deja escrita la configuración de red y le dice a cloud-init que, a partir de ahora, no vuelva a tocar ni la red ni el nombre. Cada una de estas directivas (`hostname`, `users`, `chpasswd`, `packages`, `write_files`, `runcmd`) está explicada en la [referencia de los módulos de cloud-init](https://cloudinit.readthedocs.io/en/latest/reference/modules.html).

Para comprobar que la configuración se ha aplicado bien en el primer arranque, podemos ejecutar dentro de la instancia, con `incus exec`, la orden `cloud-init status --long`, que nos dice si cloud-init ha terminado, de dónde ha leído su configuración y si ha habido errores:

```
$ incus exec una-maquina-debian -- cloud-init status --long
status: done
extended_status: done
boot_status_code: enabled-by-generator
detail: DataSourceNoCloud [seed=/var/lib/cloud/seed/nocloud-net]
errors: []
recoverable_errors: {}
```

Según la versión de cloud-init, la salida puede incluir alguna línea más, como `last_update`. `status: done` y `errors: []` indican que ha terminado sin errores. La línea `detail` nos dice de dónde ha leído cloud-init su configuración: de una *fuente de datos* NoCloud, que es la forma en que Incus se la entrega a la instancia. Si algo fallara, el registro completo está dentro, en `/var/log/cloud-init-output.log`.

También podemos comprobar el resultado, por ejemplo el nombre de la máquina y el usuario que ha creado:

```
$ incus exec una-maquina-debian -- hostname
debian

$ incus exec una-maquina-debian -- id usuario
uid=1000(usuario) gid=1000(usuario) groups=1000(usuario),27(sudo)
```

### Entrar en la instancia

`incus exec` también sirve para abrir una terminal. Sin decir nada más entramos como `root`:

```
$ incus exec una-maquina-debian -- bash
root@debian:~#
```

`openlab shell debian` hace lo mismo, pero entra como el usuario de la instancia. Por dentro ejecuta `incus exec una-maquina-debian -- su - usuario`:

```
$ incus exec una-maquina-debian -- su - usuario -c "whoami; pwd"
usuario
/home/usuario
```

Para entrar, `incus exec` no usa la red ni SSH: el demonio de Incus entra directamente en la instancia. Por eso funciona aunque la red de la instancia esté mal configurada, algo muy útil cuando estamos haciendo prácticas de redes.

### Cómo sabe openLAB qué es suyo: las claves `user.*`

En la configuración de la instancia vimos varias opciones que empiezan por `user.escenario`. Incus deja guardar en cada instancia (y en cada red o volumen) **claves propias**, siempre que empiecen por `user.`. Incus no las interpreta: solo las guarda. openLAB las usa para marcar lo que crea:

- `user.escenario`: el nombre del escenario.
- `user.escenario.directorio`: el directorio desde el que se creó. Así no se mezclan dos escenarios con el mismo nombre en directorios distintos.
- `user.escenario.maquina`, `user.escenario.tipo`, `user.escenario.usuario`: el nombre de la instancia en el fichero, su tipo y su usuario.
- `user.escenario.listo`: que la instancia terminó de crearse bien.
- `user.escenario.definicion`: lo que decía el fichero sobre esa instancia al crearla. `openlab up` lo compara con el fichero actual para saber qué ha cambiado, como veremos enseguida.

Gracias a estas claves, openLAB solo toca lo suyo y nunca otras instancias de Incus. Nosotros también podemos usarlas, por ejemplo para filtrar la lista de instancias:

```
$ incus list user.escenario=una-maquina -c ns4t
+--------------------+---------+----------------------+-----------+
|        NAME        |  STATE  |         IPV4         |   TYPE    |
+--------------------+---------+----------------------+-----------+
| una-maquina-debian | RUNNING | 10.125.174.10 (eth0) | CONTAINER |
+--------------------+---------+----------------------+-----------+
```

(Con `-c ns4t` elegimos las columnas: nombre, estado, IPv4 y tipo.) Para leer una sola clave:

```
$ incus config get una-maquina-debian user.escenario.tipo
c.small
```

### El ciclo de vida de una instancia

Las órdenes de openLAB para gestionar el escenario corresponden a órdenes de Incus sobre cada instancia:

| openLAB | Incus |
|---|---|
| `openlab up` (la primera vez) | `incus init` + `incus start` (es decir, `incus launch`) |
| `openlab stop` | `incus stop una-maquina-debian` |
| `openlab start` | `incus start una-maquina-debian` |
| `openlab shell debian` | `incus exec una-maquina-debian -- su - usuario` |
| `openlab status` | `incus list` (solo las del escenario) |
| `openlab destroy` | `incus delete --force una-maquina-debian` |

## Para jugar: cambiar el escenario

¿Qué pasa si cambiamos el `escenario.yaml` de un escenario ya creado y volvemos a ejecutar `openlab up`? openLAB compara el fichero con lo que hay en Incus y cambia solo lo necesario. Pero no todos los cambios se pueden aplicar igual.

### Cambios que no rehacen la instancia, y cambios que sí

Hay dos clases de cambios:

- **Los que son configuración de Incus.** Los límites de CPU y memoria, por ejemplo, son opciones de la instancia (`limits.cpu` y `limits.memory`), e Incus las puede cambiar en una instancia ya creada con `incus config set`. openLAB las cambia **sin rehacer la instancia**, y todo lo que hayamos hecho dentro se conserva.
- **Los que aplica cloud-init.** El usuario, los paquetes, la configuración de red… los aplica cloud-init en el **primer arranque**: el `user-data` no se vuelve a aplicar en los arranques siguientes (openLAB, además, le desactiva la red y el nombre). Si cambian, la única forma de aplicarlos es **borrar la instancia y crearla de nuevo**, y se pierde lo que hubiera dentro. Lo mismo ocurre con la imagen: es el sistema de ficheros del que parte la instancia. Incus tiene `incus rebuild`, que la cambia sin tocar la configuración ni los dispositivos, pero también pierde lo que hubiera dentro; openLAB, para aplicar el cambio, la rehace.

Algunos ejemplos:

| Cambio en el `escenario.yaml` | ¿Qué hace `openlab up`? |
|---|---|
| El tipo, por otro de la misma clase (`c.small` → `c.medium`) | Cambia `limits.cpu` y `limits.memory`, sin rehacerla. En un contenedor, en caliente; en una máquina virtual, la reinicia |
| Montar o desmontar almacenamiento | Añade o quita un dispositivo, sin rehacerla (lo veremos en la entrada de almacenamiento) |
| La imagen (`debian/13` → `ubuntu/24.04`) | La rehace |
| El tipo, de contenedor a máquina virtual o al revés | La rehace |
| Los paquetes, el usuario o las claves SSH | La rehace |
| Las interfaces: la red, la IP, la puerta de enlace… | La rehace. Incus podría conectar la tarjeta en caliente, pero su IP y su puerta de enlace las configura cloud-init en el primer arranque |

¿Cómo sabe openLAB qué ha cambiado? Por la clave `user.escenario.definicion` que vimos antes: guarda lo que decía el fichero de esa instancia al crearla, sin la CPU ni la memoria. Si es distinto de lo que dice ahora, la instancia se rehace. Si solo han cambiado los límites, los cambia. En cualquier caso, antes de hacer nada `openlab up` explica lo que va a pasar y, si se va a borrar, rehacer o reiniciar algo, pregunta.

### ¿Cómo sabemos si la instancia es nueva?

El nombre no sirve, porque la instancia nueva se llama igual que la anterior. Pero Incus le da a cada instancia, al crearla, un **identificador único**, que guarda en la opción `volatile.uuid`. Si después del cambio el identificador es el mismo, la instancia es la de antes; si es otro, se ha creado de nuevo.

Vamos a anotar el de nuestra instancia antes de hacer ningún cambio:

```
$ incus config get una-maquina-debian volatile.uuid
e4bbca74-264c-46d5-a502-65edccd99c37
```

### Primer cambio: el tipo

En el `escenario.yaml` cambiamos `tipo: c.small` por `tipo: c.medium` (2 CPU y 1 GiB de memoria) y ejecutamos `openlab up`:

```
$ openlab up
Escenario una-maquina
    Una instancia Debian.

Qué va a pasar
  ✔ Se aplica su tipo, sin reiniciar: debian
    debian: ahora c.medium: 2 CPU · 1GiB

Tipos
  ✔ debian: ahora c.medium: 2 CPU · 1GiB.

Listo
  ✔ debian       eth0 10.125.174.10                       openlab shell debian
    Usuario: usuario, contraseña usuario.
```

openLAB nos ha dicho que va a aplicar el tipo **sin reiniciar**. Comprobamos en Incus el identificador y los límites:

```
$ incus config get una-maquina-debian volatile.uuid
e4bbca74-264c-46d5-a502-65edccd99c37

$ incus config get una-maquina-debian limits.cpu
2

$ incus config get una-maquina-debian limits.memory
1GiB
```

El identificador es el mismo: **es la misma instancia**, y ni siquiera se ha reiniciado. openLAB solo ha cambiado sus límites, lo mismo que haríamos a mano con:

```bash
incus config set una-maquina-debian limits.cpu=2
incus config set una-maquina-debian limits.memory=1GiB
```

Dentro de la instancia, `nproc` y `free` ya muestran los nuevos límites:

```
$ incus exec una-maquina-debian -- nproc
2

$ incus exec una-maquina-debian -- free -m
               total        used        free      shared  buff/cache   available
Mem:            1024          24         988           0          10         999
Swap:              0           0           0
```

Esto no es tan evidente como parece. Un contenedor comparte el núcleo con el anfitrión, y órdenes como `nproc` o `free` sacan sus datos del núcleo (de `/proc`), así que lo normal sería que mostraran las CPU y la memoria del anfitrión, que tiene muchas más. Sin embargo, el contenedor solo ve lo que le corresponde. Cómo lo consigue Incus lo veremos en la próxima entrada.

### Segundo cambio: la imagen

Ahora cambiamos `imagen: debian/13` por `imagen: ubuntu/24.04` y volvemos a ejecutar `openlab up`. Esta vez avisa de que la instancia se va a borrar y a crear de nuevo, y nos pregunta antes de seguir:

```
$ openlab up
Escenario una-maquina
    Una instancia Debian.

Qué va a pasar
  ⚠ Se borra y se crea de nuevo (se pierde lo que se haya hecho dentro):
    debian: imagen debian/13 → ubuntu/24.04; gestor de red networkd → netplan
  ? ¿Sigo? [s/N] s

Comprobaciones
  ✔ Los nombres de las instancias están libres.
  ✔ Las redes no se solapan con las que ya hay.
  ✔ Las imágenes existen.

Borrar
  ✔ debian: borrada.

Redes
  ✔ No tiene redes propias: usa la red exterior.

Instancias
  ✔ debian lista (17 s).

Listo
  ✔ debian       eth0 10.125.174.5                        openlab shell debian
    Usuario: usuario, contraseña usuario.
```

Además de la imagen ha cambiado el gestor de red: Debian usa systemd-networkd, y Ubuntu, Netplan. Comprobamos en Incus:

```
$ incus config get una-maquina-debian volatile.uuid
7d219325-1b46-4b0a-941f-c68e42ff825d

$ incus config get una-maquina-debian image.description
Ubuntu noble amd64 (20261018_07:42)
```

El identificador es otro: **es una instancia nueva**, aunque se llame igual. Por dentro, openLAB ha hecho un `incus delete --force` de la instancia vieja y la ha creado de nuevo, con la nueva imagen y su cloud-init, como la primera vez. Fíjate también en que la IP ha cambiado: el DHCP de `incusbr0` le ha dado otra, porque para Incus es otra instancia, con otra MAC.

### Borrar el escenario

Cuando terminemos, borramos el escenario con `openlab destroy`. Como se pierde todo lo que hayamos hecho dentro de las instancias, antes nos pregunta:

```
$ openlab destroy
  ⚠ Se borrarán las instancias del escenario una-maquina (debian), con todo lo que hayas hecho dentro.
  ? ¿Lo borro? [s/N] s
  ✔ Borrado el escenario una-maquina.
```

Por dentro, `openlab destroy` busca en Incus todo lo que lleva la clave `user.escenario` con el nombre de este escenario (y que se creó desde este directorio) y lo borra en este orden:

1. **Las instancias**, con `incus delete --force`, que las para antes si están en marcha.
2. **Los volúmenes de almacenamiento** del escenario, con `incus storage volume delete`. Este escenario no tiene ninguno; los veremos en la entrada de almacenamiento.
3. **Las redes propias** del escenario, con `incus network delete`. Este tampoco tiene: usa la red exterior, `incusbr0`, que no es del escenario y no se toca.

Lo comprobamos:

```
$ incus list
+------+-------+------+------+------+-----------+
| NAME | STATE | IPV4 | IPV6 | TYPE | SNAPSHOTS |
+------+-------+------+------+------+-----------+

$ incus image list -c lfdts
+-------+--------------+--------------------------------------+-----------+-----------+
| ALIAS | FINGERPRINT  |             DESCRIPTION              |   TYPE    |   SIZE    |
+-------+--------------+--------------------------------------+-----------+-----------+
|       | 1a6be58879a0 | Debian trixie amd64 (20261102_05:24) | CONTAINER | 132.38MiB |
+-------+--------------+--------------------------------------+-----------+-----------+
```

La instancia ha desaparecido, pero **la imagen sigue en la caché**: las imágenes no son de ningún escenario. Si volvemos a ejecutar `openlab up`, el escenario se crea en unos segundos, sin descargar nada.

## Hazlo tú a mano

Vamos a crear una instancia parecida sin openLAB, solo con Incus. Primero escribimos un cloud-init mínimo en un fichero `user-data.yaml`:

```yaml
#cloud-config
users:
- name: alumno
  groups: [sudo]
  shell: /bin/bash
  lock_passwd: false
chpasswd:
  expire: false
  users:
  - {name: alumno, password: alumno, type: text}
packages:
- openssh-server
```

Creamos y arrancamos la instancia con `incus launch`, indicando con `-c` las opciones de configuración:

```
$ incus launch images:debian/13/cloud mi-debian \
    -c limits.cpu=1 -c limits.memory=512MiB \
    -c cloud-init.user-data="$(cat user-data.yaml)"
Launching mi-debian
```

Esperamos a que termine cloud-init (los puntos aparecen mientras espera) y comprobamos el usuario:

```
$ incus exec mi-debian -- cloud-init status --wait
..........status: done

$ incus exec mi-debian -- su - alumno -c "id; hostname"
uid=1000(alumno) gid=1000(alumno) groups=1000(alumno),27(sudo)
mi-debian

$ incus list mi-debian
+-----------+---------+---------------------+------------------------------------------------+-----------+-----------+
|   NAME    |  STATE  |        IPV4         |                      IPV6                      |   TYPE    | SNAPSHOTS |
+-----------+---------+---------------------+------------------------------------------------+-----------+-----------+
| mi-debian | RUNNING | 10.125.174.8 (eth0) | fd42:21de:d612:ecd2:1266:6aff:fe75:6ed4 (eth0) | CONTAINER | 0         |
+-----------+---------+---------------------+------------------------------------------------+-----------+-----------+
```

Como no hemos puesto `hostname` en el cloud-init, la instancia se llama como en Incus (`mi-debian`). Fíjate también en que no hemos dicho nada de la red ni del disco, y sin embargo tiene las dos cosas. Si miramos sus dispositivos, no tiene ninguno propio:

```
$ incus config show mi-debian
...
devices: {}
ephemeral: false
profiles:
- default
...
```

Los recibe del **perfil `default`**. Con `--expanded` vemos la configuración completa, con lo que viene de los perfiles:

```
$ incus config show mi-debian --expanded
...
devices:
  eth0:
    name: eth0
    network: incusbr0
    type: nic
  root:
    path: /
    pool: default
    type: disk
ephemeral: false
profiles:
- default
...
```

Es justo la diferencia con las instancias de openLAB: ellas no tienen perfil y llevan sus dispositivos propios; esta tiene el perfil `default` y hereda sus dispositivos. Por último, la borramos (`--force` la para antes si está en marcha):

```
$ incus delete --force mi-debian
```

## Las órdenes del ciclo de vida

Antes vimos las órdenes de openLAB y sus equivalentes en Incus. Incus tiene alguna más para gestionar el ciclo de vida de una instancia:

| Orden | Qué hace |
|---|---|
| `incus launch <imagen> <nombre>` | Crea la instancia y la arranca |
| `incus init <imagen> <nombre>` | Solo la crea, parada (también `incus create`) |
| `incus start <nombre>` | La arranca |
| `incus stop <nombre>` | La apaga de forma ordenada, como un `poweroff` desde dentro. Con `--force` la apaga de golpe, como si se desenchufara, y con `--timeout` se le dice cuántos segundos esperar |
| `incus restart <nombre>` | La reinicia |
| `incus pause <nombre>` | La **congela**: sus procesos se detienen donde estén, pero sigue ocupando la memoria. En `incus list` aparece como `FROZEN` (también `incus freeze`) |
| `incus resume <nombre>` | La descongela: sus procesos siguen justo por donde iban |
| `incus rename <nombre> <nuevo>` | Le cambia el nombre (tiene que estar parada) |
| `incus rebuild <imagen> <nombre>` | Vuelve a crear su sistema de ficheros a partir de una imagen, pero conserva su configuración y sus dispositivos. Lo que hubiera dentro se pierde (tiene que estar parada, o con `--force`) |
| `incus delete <nombre>` | La borra (tiene que estar parada, o con `--force`) |
| `incus info <nombre>` | Su estado, cuándo se creó y los recursos que está usando: CPU, memoria, disco, red… |

Casi todas admiten varias instancias a la vez (`incus stop una dos tres`), y `start`, `stop`, `restart`, `pause` y `resume` admiten también `--all`, para todas las instancias.

`pause` no es lo mismo que `stop`: una instancia parada libera la memoria y, al arrancar, vuelve a arrancar su sistema desde cero; una instancia congelada conserva la memoria y, al descongelarla, sigue exactamente donde estaba. Es útil para dejar un escenario en pausa unos minutos sin perder lo que estaba en marcha.

> Cuidado con `rename` y `rebuild` en las instancias de openLAB: openLAB las reconoce por su nombre (`<escenario>-<instancia>`) y por su configuración, así que, si se cambian a mano, dejará de reconocerlas o no estarán como dice el fichero. Para practicar con estas órdenes es mejor crear una instancia propia, como la de «Hazlo tú a mano».

## Más allá de openLAB

Algunas funciones de Incus relacionadas con las instancias y las imágenes que openLAB no usa:

- **Instantáneas**: `incus snapshot create` e `incus snapshot restore` guardan y recuperan el estado de una instancia, y con `snapshots.schedule` se hacen de forma automática. Son muy útiles para volver atrás si se estropea una práctica.
- **Copiar instancias**: `incus copy`.
- **Crear imágenes propias** a partir de una instancia ya configurada: `incus publish`.
- **Copias de seguridad**: `incus export` e `incus import`.
- **Arranque automático** de una instancia al encender el anfitrión: `boot.autostart`.
- **Perfiles propios**, para reutilizar configuración entre instancias: `incus profile create`.
- **Proyectos**, para separar instancias, imágenes y redes como si fueran varios Incus: `incus project`.
- **Servidores remotos**: gestionar el Incus de otra máquina con `incus remote add`.

Toda la información está en la [documentación de Incus](https://linuxcontainers.org/incus/docs/main/).

En la siguiente entrada veremos qué diferencia hay entre un contenedor y una máquina virtual, por qué el contenedor ve solo 2 CPU y 1 GiB de memoria, y qué cambia cuando una instancia de openLAB es una máquina virtual.
