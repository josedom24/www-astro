---
title: "Aprende Incus con openLAB: contenedores y máquinas virtuales"
date: 2026-11-19
slug: "blog/2026/11/aprende-incus-con-openlab-2-contenedores-y-maquinas-virtuales"
tags:
  - "Incus"
  - "Virtualización"
  - "openLAB"
---

![Aprende Incus con openLAB: contenedores y máquinas virtuales](/pledin/assets/2026/11/aprende-incus-2.svg)

En la [primera entrada](https://www.josedomingo.org/pledin/2026/11/aprende-incus-con-openlab-1-instancias-e-imagenes/) de esta serie vimos qué es Incus y cómo crea [openLAB](https://git.josedomingo.org/josedom24/openlab) sus instancias, y trabajamos solo con contenedores. Incus gestiona también **máquinas virtuales**, y lo hace con las mismas órdenes. En esta entrada creamos un escenario que mezcla los dos tipos de instancia y miramos, con las herramientas de Incus y del propio anfitrión, en qué se parecen y en qué se diferencian.

## Contenedores y máquinas virtuales

Incus llama **instancias** tanto a los contenedores como a las máquinas virtuales, pero por dentro son cosas muy distintas:

- Un **contenedor** no es más que un grupo de procesos del anfitrión, aislados del resto. Usa el **núcleo del anfitrión**: no arranca ninguno propio. Incus los gestiona con [LXC](https://linuxcontainers.org/lxc/).
- Una **máquina virtual** es un ordenador simulado, con su firmware, su disco y su **núcleo propio**. Incus las gestiona con [QEMU](https://www.qemu.org/) y KVM, la virtualización del núcleo de Linux.

Lo podemos ver en la información del servidor: Incus tiene dos *drivers*, uno para cada tipo.

```
$ incus info | grep -E '^ +driver'
  driver: lxc | qemu
  driver_version: 6.0.4 | 10.0.13
```

<!--more-->

## El escenario

El ejemplo de esta entrada es `ejemplos/contenedores-y-vm`: un cortafuegos en una máquina virtual y dos clientes en contenedores, uno con Debian y otro con Fedora, que salen a internet a través de él.

```yaml
descripcion: Un cortafuegos en una máquina virtual y dos clientes en contenedores.
etiquetas: [Redes]

redes:
  lan: {}                         # muy aislada: la salida la da el cortafuegos

instancias:
  cortafuegos:
    imagen: debian/13
    rol: cortafuegos
    tipo: vm                      # máquina virtual: 1 CPU, 1GiB y 10GiB de disco
    gestor_red: ifupdown
    paquetes: [nftables]
    interfaces:
      - red: exterior             # eth0: hacia internet
      - red: lan                  # eth1: la puerta de enlace de la red interna
        ip: 10.0.0.1/24
    cloud-init:
      write_files:
        - path: /etc/sysctl.d/90-router.conf
          content: |
            net.ipv4.ip_forward = 1
        - path: /etc/nftables.conf
          content: |
            #!/usr/sbin/nft -f
            flush ruleset
            table inet nat {
                chain postrouting {
                    type nat hook postrouting priority srcnat;
                    oifname "eth0" masquerade
                }
            }
          defer: true             # después de instalar nftables, que trae su propio fichero
      runcmd:
        - systemctl enable nftables.service

  cliente1:
    imagen: debian/13
    tipo: c.small                 # contenedor con 1 CPU y 512MiB
    interfaces:
      - red: lan
        ip: 10.0.0.10/24
        puerta_enlace: 10.0.0.1
        dns: [1.1.1.1]

  cliente2:
    imagen: fedora/44
    tipo: c.small
    interfaces:
      - red: lan
        ip: 10.0.0.11/24
        puerta_enlace: 10.0.0.1
        dns: [1.1.1.1]
```

El escenario tiene una red propia, `lan`, y el cortafuegos hace NAT con nftables. De las redes nos ocuparemos en la próxima entrada: aquí nos interesa la clave **`tipo`**. Como vimos, el tipo dice si la instancia es un contenedor (`c.small`) o una máquina virtual (`vm`), y con qué recursos. Todo lo demás (la imagen, las interfaces, los paquetes, el cloud-init propio) se escribe igual en los dos casos.

Lo creamos:

```
$ cd openlab/ejemplos/contenedores-y-vm
$ openlab up
Escenario contenedores-y-vm
    Un cortafuegos en una máquina virtual y dos clientes en contenedores.
    Etiquetas: Redes

Comprobaciones
  ✔ Se pueden crear máquinas virtuales.
  ✔ Los nombres de las instancias están libres.
  ✔ Las redes no se solapan con las que ya hay.
  ✔ Las imágenes existen.

Redes
  ✔ lan: creada (esc-1, muy aislada)

Instancias
  ✔ cliente1 lista (38 s).
  ✔ cliente2 lista (79 s).
  ✔ cortafuegos lista (139 s).

Listo
  ✔ cortafuegos  eth0 10.125.174.203, eth1 10.0.0.1       openlab shell cortafuegos
  ✔ cliente1     eth0 10.0.0.10                           openlab shell cliente1
  ✔ cliente2     eth0 10.0.0.11                           openlab shell cliente2
    Usuario: usuario, contraseña usuario.
```

Hay dos cosas nuevas respecto a la entrada anterior:

- Una comprobación más: **«Se pueden crear máquinas virtuales»**. Para crearlas, Incus necesita KVM (la virtualización activada en la BIOS/UEFI del equipo, que se ve en el anfitrión como `/dev/kvm`) y QEMU. `openlab install` instala QEMU, y `openlab up` comprueba las dos cosas antes de crear nada.
- **Los tiempos**. Las tres instancias se crean a la vez, pero la máquina virtual es la que más tarda: tiene que descargar una imagen mayor y arrancar un sistema completo, con su firmware y su núcleo.

## ¿Qué ha pasado en Incus?

### Las instancias

```
$ incus list
+-------------------------------+---------+-----------------------+------------------------------------------------+-----------------+-----------+
|             NAME              |  STATE  |         IPV4          |                      IPV6                      |      TYPE       | SNAPSHOTS |
+-------------------------------+---------+-----------------------+------------------------------------------------+-----------------+-----------+
| contenedores-y-vm-cliente1    | RUNNING | 10.0.0.10 (eth0)      |                                                | CONTAINER       | 0         |
+-------------------------------+---------+-----------------------+------------------------------------------------+-----------------+-----------+
| contenedores-y-vm-cliente2    | RUNNING | 10.0.0.11 (eth0)      |                                                | CONTAINER       | 0         |
+-------------------------------+---------+-----------------------+------------------------------------------------+-----------------+-----------+
| contenedores-y-vm-cortafuegos | RUNNING | 10.125.174.203 (eth0) | fd42:21de:d612:ecd2:1266:6aff:fe04:e6a7 (eth0) | VIRTUAL-MACHINE | 0         |
|                               |         | 10.0.0.1 (eth1)       |                                                |                 |           |
+-------------------------------+---------+-----------------------+------------------------------------------------+-----------------+-----------+
```

La columna `TYPE` dice qué es cada una: dos `CONTAINER` y una `VIRTUAL-MACHINE`. Las tres aparecen en la misma lista y se gestionan con las mismas órdenes: `incus start`, `incus stop`, `incus exec`, `incus config`…

Con otras columnas podemos ver lo que está gastando cada una (`m` es la memoria y `N` el número de procesos):

```
$ incus list -c ntmN
+-------------------------------+-----------------+--------------+-----------+
|             NAME              |      TYPE       | MEMORY USAGE | PROCESSES |
+-------------------------------+-----------------+--------------+-----------+
| contenedores-y-vm-cliente1    | CONTAINER       | 22.35MiB     | 9         |
+-------------------------------+-----------------+--------------+-----------+
| contenedores-y-vm-cliente2    | CONTAINER       | 33.99MiB     | 19        |
+-------------------------------+-----------------+--------------+-----------+
| contenedores-y-vm-cortafuegos | VIRTUAL-MACHINE | 225.35MiB    | 10        |
+-------------------------------+-----------------+--------------+-----------+
```

Los dos contenedores, recién arrancados, gastan entre 20 y 35 MiB. La máquina virtual, que hace prácticamente lo mismo, entre seis y diez veces más: además de sus procesos, tiene en memoria su propio núcleo.

### El núcleo

La diferencia fundamental se ve preguntando a cada instancia qué núcleo está usando, y comparándolo con el del anfitrión:

```
$ uname -r
6.12.116+deb13-amd64

$ incus exec contenedores-y-vm-cliente1 -- uname -r
6.12.116+deb13-amd64

$ incus exec contenedores-y-vm-cliente2 -- uname -r
6.12.116+deb13-amd64

$ incus exec contenedores-y-vm-cortafuegos -- uname -r
6.12.117+deb13-amd64
```

Los dos contenedores responden con el núcleo del **anfitrión**, porque no tienen otro. Fíjate en `cliente2`: es un Fedora 44, pero su núcleo es el de Debian. De Fedora tiene todo lo demás: sus ficheros, su gestor de paquetes, su systemd…

```
$ incus exec contenedores-y-vm-cliente2 -- grep PRETTY_NAME /etc/os-release
PRETTY_NAME="Fedora Linux 44 (Container Image)"
```

La máquina virtual, en cambio, tiene **su propio núcleo**, el que viene instalado en su imagen (en este caso, algo más nuevo que el del anfitrión). El propio sistema sabe dónde se está ejecutando:

```
$ incus exec contenedores-y-vm-cliente1 -- systemd-detect-virt
lxc

$ incus exec contenedores-y-vm-cortafuegos -- systemd-detect-virt
kvm
```

Esto explica cuándo hace falta una máquina virtual: cuando lo que queremos hacer depende del núcleo. Cargar módulos, usar Docker o Kubernetes dentro sin tocar la seguridad del contenedor, algunas configuraciones de cortafuegos, hacer prácticas de virtualización o usar otro sistema operativo, como Windows. En la máquina virtual podemos cargar un módulo del núcleo; en el contenedor ni siquiera está instalada la orden para hacerlo, y aunque la instaláramos, el contenedor no tiene permiso para cargar módulos en el núcleo del anfitrión:

```
$ incus exec contenedores-y-vm-cortafuegos -- sh -c 'modprobe dummy && lsmod | grep dummy'
dummy                  12288  0

$ incus exec contenedores-y-vm-cliente1 -- modprobe dummy
Error: Command not found
```

Para todo lo demás, que es casi todo, un contenedor arranca antes y gasta mucho menos.

### Vistos desde el anfitrión

Veamos ahora las instancias desde fuera, con `ps` en el anfitrión. La máquina virtual es **un solo proceso**, `qemu-system-x86_64` (hemos recortado sus opciones):

```
$ ps -eo pid,user,args | grep qemu-system
  52136 nobody   /usr/bin/qemu-system-x86_64 -S -name contenedores-y-vm-cortafuegos -uuid 3272c104-505c-4201-b010-f741db995c4d -daemonize -cpu host,hv_passthrough -nographic ... -spice unix=on,disable-ticketing=on,addr=/run/incus/contenedores-y-vm-cortafuegos/qemu.spice ...
```

Lo que pasa dentro de la máquina no se ve desde el anfitrión: sus procesos los gestiona su núcleo, y para el anfitrión todo es ese proceso de QEMU, que se ejecuta como el usuario `nobody`. La opción `-uuid` lleva el `volatile.uuid` de la instancia, y `-spice` es su pantalla, que usaremos más abajo.

Con los contenedores es al revés: **sus procesos son procesos del anfitrión**, y se ven todos:

```
$ ps -eo pid,user,args | grep -E '1000000|lxc monitor'
  49965 root     [lxc monitor] /var/lib/incus/containers contenedores-y-vm-cliente1
  49985 1000000  /sbin/init
  50227 1000000  /usr/lib/systemd/systemd-journald
  50240 1000000  /usr/lib/systemd/systemd-udevd
  50352 1000000  /usr/lib/systemd/systemd-logind
  50356 1000000  /sbin/agetty -o -- \u --noreset --noclear --keep-baud 115200,57600,38400,9600 - linux
  50369 1000000  sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
  ...
```

Ahí está el `init` (systemd) de `cliente1`, su `sshd`, su `journald`… (los que siguen son los de `cliente2`). Son los mismos procesos que vemos desde dentro, pero con otros números. Dentro hay alguno más, como `systemd-resolved` o `dbus-daemon`, que no ha recogido el `grep`: no son de `root`, y en el anfitrión su usuario no es el 1000000, sino su número dentro del contenedor más 1000000, como veremos enseguida:

```
$ incus exec contenedores-y-vm-cliente1 -- ps -eo pid,user,args
    PID USER     COMMAND
      1 root     /sbin/init
    142 root     /usr/lib/systemd/systemd-journald
    151 systemd+ /usr/lib/systemd/systemd-resolved
    154 root     /usr/lib/systemd/systemd-udevd
    186 systemd+ /usr/lib/systemd/systemd-networkd
    205 message+ /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
    208 root     /usr/lib/systemd/systemd-logind
    212 root     /sbin/agetty -o -- \u --noreset --noclear --keep-baud 115200,57600,38400,9600 - linux
    223 root     sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
    ...
```

El proceso 49985 del anfitrión es el proceso 1 del contenedor, y el usuario `1000000` del anfitrión es el `root` del contenedor. Es el trabajo de los **espacios de nombres** (*namespaces*) del núcleo: cada contenedor tiene su propia numeración de procesos, sus propios usuarios, su propia red, su propio nombre de máquina y sus propios puntos de montaje. El proceso `[lxc monitor]` es el de LXC que vigila el contenedor.

La traducción de usuarios se puede ver dentro del contenedor:

```
$ incus exec contenedores-y-vm-cliente1 -- cat /proc/self/uid_map
         0    1000000 1000000000
```

Se lee así: el usuario 0 del contenedor es el 1000000 del anfitrión, y así con los siguientes. Por eso se dice que los contenedores de Incus son **no privilegiados**: el `root` del contenedor manda dentro, pero en el anfitrión es un usuario sin ningún permiso. Si un proceso consiguiera salir del contenedor, no sería `root` fuera.

### Los límites de un contenedor: cgroups y LXCFS

Al final de la entrada anterior dejamos una pregunta pendiente: si un contenedor comparte el núcleo con el anfitrión, ¿por qué `nproc` y `free` muestran dentro solo la CPU y la memoria de su tipo? El anfitrión de estas pruebas tiene 12 CPU y 32 GiB de memoria, pero `cliente1`, que es un `c.small`, ve esto:

```
$ incus exec contenedores-y-vm-cliente1 -- nproc
1

$ incus exec contenedores-y-vm-cliente1 -- free -m
               total        used        free      shared  buff/cache   available
Mem:             512          16         489           0           6         495
Swap:              0           0           0
```

Hay dos mecanismos distintos: uno **pone** el límite y otro lo **enseña**.

**El límite lo ponen los cgroups.** Los *grupos de control* son la función del núcleo que limita los recursos de un grupo de procesos. Incus crea un cgroup para cada contenedor y traduce a él las opciones `limits.*` de la instancia. Lo vemos en el anfitrión:

```
$ cd /sys/fs/cgroup/lxc.payload.contenedores-y-vm-cliente1

$ cat memory.max
536870912

$ cat cpuset.cpus
8
```

`memory.max` son los 512 MiB de `limits.memory`, en bytes: si los procesos del contenedor intentan usar más, el núcleo mata alguno. Y `limits.cpu: 1` se ha convertido en un `cpuset`: Incus le ha asignado al contenedor **una CPU concreta** del anfitrión (aquí, la número 8), y sus procesos solo se ejecutan en ella. Incus reparte las CPU entre los contenedores para que no coincidan todos en las mismas.

**El límite lo enseña LXCFS.** Con los cgroups el contenedor ya está limitado, pero órdenes como `free`, `nproc` o `top` no miran los cgroups: leen ficheros de `/proc`, como `/proc/meminfo` o `/proc/cpuinfo`, que hablan de todo el equipo. [LXCFS](https://linuxcontainers.org/lxcfs/) es un pequeño sistema de ficheros, del mismo proyecto Linux Containers, que Incus monta **encima** de esos ficheros dentro de cada contenedor:

```
$ incus exec contenedores-y-vm-cliente1 -- sh -c 'mount | grep lxcfs'
lxcfs on /proc/cpuinfo type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/diskstats type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/loadavg type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/meminfo type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/slabinfo type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/stat type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/swaps type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /proc/uptime type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
lxcfs on /sys/devices/system/cpu type fuse.lxcfs (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other)
```

Cuando un proceso del contenedor lee `/proc/meminfo`, quien responde es LXCFS, que mira el cgroup del contenedor y contesta con sus límites en lugar de con los datos del anfitrión:

```
$ head -1 /proc/meminfo
MemTotal:       32801020 kB

$ incus exec contenedores-y-vm-cliente1 -- head -1 /proc/meminfo
MemTotal:         524288 kB
```

También hay un `/proc/uptime` propio: por eso `uptime` dice dentro cuánto lleva arrancado el contenedor, y no el anfitrión.

En la máquina virtual no hace falta nada de esto. QEMU le presenta un hardware con 1 CPU y 1 GiB de memoria, y su núcleo no conoce otra cosa:

```
$ incus exec contenedores-y-vm-cortafuegos -- nproc
1

$ incus exec contenedores-y-vm-cortafuegos -- free -m
               total        used        free      shared  buff/cache   available
Mem:             945         240         727          18         111         704
Swap:              0           0           0
```

Hay dos detalles en esta salida. El total no llega a 1024 MiB, porque una parte de la memoria la reserva el núcleo de la máquina al arrancar. Y ya hay 240 MiB usados, frente a los 16 del contenedor. Además, las dos opciones no significan lo mismo: en un contenedor, `limits.memory` es un **tope**, y el contenedor solo ocupa lo que usa; en una máquina virtual es **la memoria de la máquina**, la que tiene desde que arranca y que su núcleo considera suya.

### La configuración de la máquina virtual

La configuración de las dos clases de instancia se ve con la misma orden. Esta es la de la máquina virtual, con las líneas del cloud-init recortadas:

```
$ incus config show contenedores-y-vm-cortafuegos
architecture: x86_64
config:
  cloud-init.network-config: |
    version: 2
    ethernets:
      eth0:
        match:
          macaddress: 10:66:6a:04:e6:a7
        set-name: eth0
        dhcp4: true
  cloud-init.user-data: |
    #cloud-config
    hostname: cortafuegos
    ...
  image.architecture: amd64
  image.description: Debian trixie amd64 (20261115_05:24)
  image.os: Debian
  image.release: trixie
  image.serial: "20261115_05:24"
  image.type: disk-kvm.img
  image.variant: cloud
  limits.cpu: "1"
  limits.memory: 1GiB
  user.escenario: contenedores-y-vm
  user.escenario.definicion: '{"claves_ssh":null,"cloud-init":{"runcmd":["systemctl enable nftables.service"], ...,"vm":true}'
  user.escenario.directorio: /home/usuario/openlab/ejemplos/contenedores-y-vm
  user.escenario.huella: c301004bcc66
  user.escenario.listo: si
  user.escenario.maquina: cortafuegos
  user.escenario.tipo: vm
  user.escenario.usuario: usuario
  volatile.base_image: 2efaff00f0e46b1992ae71c5c78f432ec0d457494ec5b53eab1bef0c65cb51c4
  volatile.cloud-init.instance-id: 1cbd32b7-457e-4a0c-b784-0766511886d8
  volatile.eth0.host_name: tapdc1f97fd
  volatile.eth1.host_name: tap14ed72de
  volatile.last_state.power: RUNNING
  volatile.uuid: 3272c104-505c-4201-b010-f741db995c4d
  volatile.uuid.generation: 3272c104-505c-4201-b010-f741db995c4d
  volatile.vm.definition: pc-q35-10.0
  volatile.vsock_id: "3055551475"
devices:
  eth0:
    hwaddr: 10:66:6a:04:e6:a7
    name: eth0
    network: incusbr0
    type: nic
  eth1:
    hwaddr: 10:66:6a:16:05:03
    name: eth1
    network: esc-1
    type: nic
  root:
    path: /
    pool: default
    size: 10GiB
    type: disk
ephemeral: false
profiles: []
stateful: false
description: ""
```

Tiene las mismas partes que la de un contenedor, y openLAB la crea igual: sin perfiles, con su cloud-init, sus límites y sus claves `user.*`. Las diferencias son estas:

- **`image.type: disk-kvm.img`**. La imagen de un contenedor es un sistema de ficheros (`squashfs`); la de una máquina virtual, un disco completo, con su tabla de particiones y su cargador de arranque. Son imágenes distintas, aunque en el servidor tengan el mismo alias, como vimos en la entrada anterior. En la caché local ya tenemos las dos de Debian 13, además de la de Fedora (si has preparado las imágenes con escritorio, que veremos más abajo, aparecerán también):

  ```
  $ incus image list -c fdts
  +--------------+--------------------------------------+-----------------+-----------+
  | FINGERPRINT  |             DESCRIPTION              |      TYPE       |   SIZE    |
  +--------------+--------------------------------------+-----------------+-----------+
  | 2efaff00f0e4 | Debian trixie amd64 (20261115_05:24) | VIRTUAL-MACHINE | 378.60MiB |
  +--------------+--------------------------------------+-----------------+-----------+
  | 52c1436af8d1 | Fedora 44 amd64 (20261113_20:33)     | CONTAINER       | 131.40MiB |
  +--------------+--------------------------------------+-----------------+-----------+
  | f46b75ee7e29 | Debian trixie amd64 (20261115_05:24) | CONTAINER       | 132.40MiB |
  +--------------+--------------------------------------+-----------------+-----------+
  ```

- **El disco raíz tiene tamaño**: `size: 10GiB`, el del tipo `vm`. Un contenedor con el almacenamiento `dir` es un directorio del anfitrión y usa su disco, sin límite. Una máquina virtual tiene un disco propio, un fichero en el anfitrión que solo ocupa lo que se ha escrito en él. Dentro se ve como un disco de verdad, con sus particiones:

  ```
  $ incus exec contenedores-y-vm-cortafuegos -- lsblk
  NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
  sda      8:0    0   10G  0 disk
  ├─sda1   8:1    0  100M  0 part /boot/efi
  └─sda2   8:2    0  9.9G  0 part /
  ```

  La partición `/boot/efi` nos dice además que la máquina arranca con un firmware UEFI.

- **Las tarjetas de red llevan la MAC escrita** (`hwaddr`), y en el anfitrión no son interfaces `veth`, como las de un contenedor, sino `tap` (`volatile.eth0.host_name: tapdc1f97fd`). En el contenedor, Incus crea la interfaz dentro con el nombre que le decimos (`name: eth0`). En una máquina virtual no puede: QEMU le presenta una tarjeta, y el nombre se lo pone el sistema de dentro, que la llamaría `enp5s0`. Para que en un escenario las interfaces se llamen igual en los dos casos, openLAB fija la MAC de cada tarjeta y escribe con cloud-init un fichero `.link` de systemd que le da su nombre:

  ```
  $ incus exec contenedores-y-vm-cortafuegos -- cat /etc/systemd/network/10-escenario-eth0.link
  [Match]
  MACAddress=10:66:6a:04:e6:a7

  [Link]
  Name=eth0
  ```

- **Claves `volatile.*` propias de las máquinas virtuales**: `volatile.vm.definition` es el modelo de máquina que simula QEMU (`pc-q35-10.0`), y `volatile.vsock_id`, el identificador con el que Incus habla con el agente, que vemos a continuación. Las claves `volatile.idmap.*` del contenedor, la traducción de usuarios, aquí no están.

### El agente

En un contenedor, `incus exec` es sencillo: como sus procesos son del anfitrión, el demonio de Incus crea un proceso más y lo mete en los espacios de nombres del contenedor. En una máquina virtual eso no es posible, porque el anfitrión no puede crear procesos dentro de otro núcleo. Alguien tiene que hacerlo desde dentro: el **agente de Incus** (`incus-agent`), un servicio que se ejecuta en la máquina virtual.

```
$ incus exec contenedores-y-vm-cortafuegos -- systemctl status incus-agent
● incus-agent.service - Incus - agent
     Loaded: loaded (/usr/lib/systemd/system/incus-agent.service; static)
     Active: active (running) since Sun 2026-11-15 20:07:19 UTC; 14s ago
       Docs: https://linuxcontainers.org/incus/docs/main/
    Process: 372 ExecStartPre=/lib/systemd/incus-agent-setup (code=exited, status=0/SUCCESS)
   Main PID: 571 (incus-agent)
     CGroup: /system.slice/incus-agent.service
             ├─571 /run/incus_agent/incus-agent
             └─733 systemctl status incus-agent
```

El demonio de Incus y el agente no se comunican por la red, sino por un canal directo entre el anfitrión y la máquina (*vsock*): por eso `incus exec` y `openlab shell` funcionan también en una máquina virtual con la red mal configurada, igual que en un contenedor. El programa del agente no viene en la imagen: se lo entrega Incus a la máquina en cada arranque (`/run/incus_agent/incus-agent`), así que siempre es de la misma versión que el demonio. La imagen solo trae el servicio que lo pone en marcha.

Gracias al agente funcionan en una máquina virtual `incus exec` e `incus file`, e Incus puede saber qué pasa dentro: sus direcciones IP, los procesos, la memoria usada o el sistema que tiene instalado. `incus info` muestra en una máquina virtual una sección que en un contenedor no aparece:

```
$ incus info contenedores-y-vm-cortafuegos
Name: contenedores-y-vm-cortafuegos
Status: RUNNING
Type: virtual-machine
Architecture: x86_64
PID: 52136
Created: 2026/11/15 21:05 CET
Last Used: 2026/11/15 21:07 CET

Operating System:
  OS: Debian GNU/Linux
  OS Version: 13
  Kernel Version: 6.12.117+deb13-amd64
  Hostname: cortafuegos
  FQDN: localhost

Resources:
  Processes: 10
  CPU usage:
    CPU usage (in seconds): 4
  Memory usage:
    Memory (current): 225.56MiB
  ...
```

El `PID` es el del proceso de QEMU que vimos antes. El agente tarda unos segundos en arrancar: hasta entonces la máquina está en marcha (`RUNNING`), pero no se puede entrar en ella. Lo veremos al crear una a mano.

### La consola

Además de `incus exec`, Incus da acceso a la **consola** de cada instancia, que es lo que veríamos si le conectáramos un monitor y un teclado:

```
$ incus console contenedores-y-vm-cortafuegos
To detach from the console, press: <ctrl>+a q
```

Es una consola de texto: al pulsar Intro aparece el `login`, y hay que entrar con usuario y contraseña. Se sale con `Ctrl+a q`. Funciona tanto en los contenedores como en las máquinas virtuales. Con `--show-log` no se conecta: muestra lo que ha salido por ella desde el arranque, que es muy útil cuando una instancia no arranca bien.

Las máquinas virtuales tienen, además, una **consola gráfica**: su pantalla.

```
$ incus console contenedores-y-vm-cortafuegos --type=vga
```

Incus la ofrece con el protocolo SPICE (la opción `-spice` del proceso de QEMU) y la abre con `remote-viewer`, del paquete `virt-viewer`, que tiene que estar instalado. En nuestro cortafuegos solo veremos una pantalla de texto con el `login`, pero es la forma de ver el arranque completo de una máquina, entrar en el menú de su cargador de arranque o usar una máquina con escritorio.

## Una pantalla en el navegador: el ejemplo `escritorio`

El ejemplo `ejemplos/escritorio` tiene un servidor web y un cliente con escritorio gráfico para probarlo con Firefox. Usa una imagen que no está en `images:`, sino que la prepara openLAB con `openlab install --desktop`:

```yaml
instancias:
  web:
    imagen: debian/13
    rol: web
    tipo: c.small
    paquetes: [nginx]

  cliente:
    imagen: debian/13/escritorio  # contenedor con XFCE, Firefox, xrdp y VNC
    rol: cliente
    tipo: c.medium                # 2 CPU y 1GiB: el escritorio necesita al menos 1GiB
    # La máquina virtual con GNOME (sin tipo, vm.desktop: 2 CPU, 4GiB y 20GiB):
    # imagen: ubuntu/24.04/escritorio
```

Hay dos imágenes con escritorio, y son **imágenes locales** de nuestro Incus, con su alias:

```
$ incus image list openlab/ -c lfdts
+---------------------------------+--------------+----------------------------------------+-----------------+------------+
|              ALIAS              | FINGERPRINT  |              DESCRIPTION               |      TYPE       |    SIZE    |
+---------------------------------+--------------+----------------------------------------+-----------------+------------+
| openlab/debian-13-escritorio    | 011e77e39a99 | Debian 13 + XFCE (contenedor)          | CONTAINER       | 655.26MiB  |
+---------------------------------+--------------+----------------------------------------+-----------------+------------+
| openlab/ubuntu-24.04-escritorio | a0c059d8a187 | Ubuntu 24.04 + GNOME (máquina virtual) | VIRTUAL-MACHINE | 1514.44MiB |
+---------------------------------+--------------+----------------------------------------+-----------------+------------+
```

Para prepararlas, `openlab install --desktop` crea una instancia con la imagen de la distribución, le instala el escritorio y la guarda como imagen con `incus publish`, una de las órdenes que citamos en «Más allá de openLAB» en la entrada anterior. Una es para contenedor y la otra para máquina virtual, y eso es justo lo interesante: **las dos tienen escritorio, pero su pantalla llega a nosotros por caminos distintos**.

Un contenedor no tiene pantalla: no tiene hardware, solo procesos. El escritorio del contenedor es, por tanto, un servicio más, que se ofrece por la red. Con el ejemplo creado tal cual (`openlab up`), dentro de `cliente` hay dos servidores de escritorio remoto:

```
$ incus exec escritorio-cliente -- ss -tlnp
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      128          0.0.0.0:22        0.0.0.0:*    users:(("sshd",pid=251,fd=6))
LISTEN 0      5          127.0.0.1:5901      0.0.0.0:*    users:(("Xtigervnc",pid=339,fd=9))
LISTEN 0      2                  *:3389            *:*    users:(("xrdp",pid=270,fd=13))
...
```

`xrdp` (puerto 3389) es el que usa `openlab rdp cliente`, que abre el escritorio con Remmina o con cualquier otro cliente de RDP. `Xtigervnc` es un servidor VNC que solo escucha dentro del contenedor (`127.0.0.1`): es el que usa `openlab web` para mostrar el escritorio en el navegador, y llega hasta él con `incus exec`, sin pasar por la red.

Si cambiamos la imagen del cliente por `ubuntu/24.04/escritorio` (y quitamos el `tipo`, para que coja `vm.desktop`), `openlab up` nos avisa de que la instancia cambia de clase y la rehace:

```
Qué va a pasar
  ⚠ Se borra y se crea de nuevo (se pierde lo que se haya hecho dentro):
    cliente: contenedor → máquina virtual; imagen debian/13/escritorio → ubuntu/24.04/escritorio; gestor de red networkd → netplan
    No se toca: web
```

Ahora el cliente es una máquina virtual con GNOME, y gasta bastante más que el contenedor con XFCE, que antes del cambio usaba unos 135 MiB:

```
$ incus list -c nst4m
+--------------------+---------+-----------------+-----------------------+--------------+
|        NAME        |  STATE  |      TYPE       |         IPV4          | MEMORY USAGE |
+--------------------+---------+-----------------+-----------------------+--------------+
| escritorio-cliente | RUNNING | VIRTUAL-MACHINE | 10.125.174.228 (eth0) | 1009.07MiB   |
+--------------------+---------+-----------------+-----------------------+--------------+
| escritorio-web     | RUNNING | CONTAINER       | 10.125.174.40 (eth0)  | 26.33MiB     |
+--------------------+---------+-----------------+-----------------------+--------------+
```

Una máquina virtual sí tiene pantalla: la consola VGA. Podemos verla con `incus console escritorio-cliente --type=vga`, y es también la que muestra `openlab web` en el navegador. Para eso openLAB no ejecuta la orden `incus`, sino que habla directamente con el demonio, por su API.

### La API de Incus

En la primera entrada dijimos que el cliente `incus` se comunica con el demonio a través de una **API REST**. Todo lo que hace la orden `incus` es una petición a esa API, y nosotros también podemos hacerlas con `incus query`:

```
$ incus query /1.0/instances
[
	"/1.0/instances/escritorio-cliente",
	"/1.0/instances/escritorio-web"
]
```

Cada instancia es un recurso, con su dirección. `incus query /1.0/instances/escritorio-cliente` devuelve en JSON lo mismo que `incus config show`, y añadiendo `/state`, su estado: lo que muestra `incus info`.

```
$ incus query /1.0/instances/escritorio-web/state
{
	"cpu": {
		...
	},
	"disk": {},
	"memory": {
		...
		"total": 536870912,
		...
	},
	"network": {
		"eth0": {
			"addresses": [
				{
					"address": "10.125.174.40",
					"family": "inet",
					"netmask": "24",
					"scope": "global"
				},
	...
```

En local, la API se sirve por un socket de Unix, que es el fichero al que da permiso el grupo `incus-admin`. Podemos usarla sin el cliente de Incus, con `curl`:

```
$ ls -l /var/lib/incus/unix.socket
srw-rw---- 1 root incus-admin 0 nov 15 08:16 /var/lib/incus/unix.socket

$ curl -s --unix-socket /var/lib/incus/unix.socket http://incus/1.0/instances
{"type":"sync","status":"Success","status_code":200,"operation":"","error_code":0,"error":"","metadata":["/1.0/instances/escritorio-cliente","/1.0/instances/escritorio-web"]}
```

Con `-X` se elige el método y con `-d` se envían datos. Esta es, casi igual, la petición que hace `openlab web` para abrir la pantalla de la máquina virtual: pedir su consola de tipo `vga` (`openlab web` añade además `"force": true`, que cierra otra conexión a la consola si la hubiera).

```
$ incus query -X POST -d '{"type":"vga"}' /1.0/instances/escritorio-cliente/console
{
	"class": "websocket",
	"description": "Showing console",
	"id": "a600c669-f9d8-4c88-a685-377a94229a2a",
	"metadata": {
		"fds": {
			"0": "1dbd560815449db1bb354f12394b103b0c0bc3cbf1c575c35119ceafc05840f0",
			"control": "8773468db5ed657c34ebc1e5139e7643b3ff79d70bb771c230b8183e5f6370ce"
		}
	},
	"resources": {
		"instances": [
			"/1.0/instances/escritorio-cliente"
		]
	},
	"status": "Running",
	...
}
```

Incus no responde con la pantalla, sino con una **operación**: una tarea que se queda en marcha en el demonio, con su identificador. La operación ofrece una conexión (un *WebSocket*) por la que viaja el protocolo SPICE, y las claves para conectarse a ella (`fds`: una para los datos y otra de control). `openlab web` une esa conexión con un cliente de SPICE escrito en JavaScript, y así la pantalla de la máquina virtual aparece en una pestaña del navegador. Las operaciones en marcha se ven con `incus operation list`, y se cancelan con `incus operation delete`.

> Toda la API está documentada en la [referencia de la API REST](https://linuxcontainers.org/incus/docs/main/rest-api/) de Incus. `incus query` es la forma más cómoda de explorarla. También ayuda la opción `--debug` de cualquier orden (`incus list --debug`), que muestra las peticiones que hace.

## Para jugar: cambiar de tipo

Volvemos al escenario `contenedores-y-vm`. En la entrada anterior cambiamos el tipo de un contenedor, de `c.small` a `c.medium`, y openLAB lo aplicó **en caliente**, sin reiniciarlo: le basta con cambiar los límites del cgroup. ¿Y en una máquina virtual?

### Primer cambio: el tipo de la máquina virtual

Probemos primero a mano, con Incus, a darle más memoria al cortafuegos mientras está en marcha:

```
$ incus config set contenedores-y-vm-cortafuegos limits.memory=2GiB
Error: Failed updating memory limit: Cannot increase memory size beyond boot time size when VM is running (Boot time size 1024MiB, new size 2048MiB)
```

Incus no nos deja: la memoria de una máquina virtual es la que tenía al arrancar. Para cambiarla hay que pararla. Por eso openLAB, cuando cambia el tipo de una máquina virtual, la **reinicia**.

Anotamos el identificador de la instancia, y en el `escenario.yaml` cambiamos el tipo del cortafuegos de `vm` a `vm.medium` (2 CPU, 2 GiB de memoria y 20 GiB de disco):

```
$ incus config get contenedores-y-vm-cortafuegos volatile.uuid
3272c104-505c-4201-b010-f741db995c4d

$ openlab up
Escenario contenedores-y-vm
    Un cortafuegos en una máquina virtual y dos clientes en contenedores.
    Etiquetas: Redes

Qué va a pasar
  ⚠ Se reinicia, para aplicar su tipo: cortafuegos
    cortafuegos: ahora vm.medium: 2 CPU · 2GiB
  ✔ El disco de cortafuegos crece de 10GiB a 20GiB (dentro crece solo al arrancar)
    No se toca: cliente1, cliente2
  ? ¿Sigo? [s/N] s

Almacenamiento
  ✔ cortafuegos: el disco crece de 10GiB a 20GiB.

Tipos
  ✔ cortafuegos: ahora vm.medium: 2 CPU · 2GiB, reiniciada.

Listo
  ✔ cortafuegos  eth0 10.125.174.203, eth1 10.0.0.1       openlab shell cortafuegos
  ✔ cliente1     eth0 10.0.0.10                           openlab shell cliente1
  ✔ cliente2     eth0 10.0.0.11                           openlab shell cliente2
    Usuario: usuario, contraseña usuario.
```

Como reiniciar una máquina interrumpe lo que esté haciendo, esta vez openLAB pregunta. Comprobamos en Incus:

```
$ incus config get contenedores-y-vm-cortafuegos volatile.uuid
3272c104-505c-4201-b010-f741db995c4d

$ incus config get contenedores-y-vm-cortafuegos limits.cpu
2

$ incus config get contenedores-y-vm-cortafuegos limits.memory
2GiB

$ incus config device get contenedores-y-vm-cortafuegos root size
20GiB
```

El identificador es el mismo: **es la misma instancia**, con su misma IP y con todo lo que hubiéramos hecho dentro. Lo que ha hecho openLAB equivale a:

```bash
incus stop contenedores-y-vm-cortafuegos
incus config device set contenedores-y-vm-cortafuegos root size=20GiB
incus config set contenedores-y-vm-cortafuegos limits.cpu=2
incus config set contenedores-y-vm-cortafuegos limits.memory=2GiB
incus start contenedores-y-vm-cortafuegos
```

Y dentro, la máquina tiene otro hardware:

```
$ incus exec contenedores-y-vm-cortafuegos -- nproc
2

$ incus exec contenedores-y-vm-cortafuegos -- free -m
               total        used        free      shared  buff/cache   available
Mem:            1951         273        1704          18         112        1678
Swap:              0           0           0

$ incus exec contenedores-y-vm-cortafuegos -- lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   20G  0 disk
├─sda1   8:1    0  100M  0 part /boot/efi
└─sda2   8:2    0 19.9G  0 part /

$ incus exec contenedores-y-vm-cortafuegos -- df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2        20G  923M   19G   5% /
```

Fíjate en el disco. Incus solo ha agrandado el disco de la máquina, de 10 a 20 GiB. Quien ha agrandado la partición y el sistema de ficheros para ocupar el sitio nuevo ha sido, otra vez, cloud-init: sus módulos `growpart` y `resizefs` lo hacen en cada arranque. Al revés no funciona: un disco no se puede reducir, y openLAB lo avisa.

### Segundo cambio: de contenedor a máquina virtual

Ahora cambiamos el tipo de `cliente1` de `c.small` a `vm.small`. No es un cambio de recursos, sino de clase: un contenedor no se puede convertir en una máquina virtual. Tienen imágenes distintas: uno es un directorio con procesos; la otra, un disco con su núcleo. openLAB borra la instancia y la crea de nuevo:

```
$ incus config get contenedores-y-vm-cliente1 volatile.uuid
f9d9567e-ae69-4dc4-99e4-b698e2775cd5

$ openlab up
Escenario contenedores-y-vm
    Un cortafuegos en una máquina virtual y dos clientes en contenedores.
    Etiquetas: Redes

Qué va a pasar
  ⚠ Se borra y se crea de nuevo (se pierde lo que se haya hecho dentro):
    cliente1: contenedor → máquina virtual
    No se toca: cortafuegos, cliente2
  ? ¿Sigo? [s/N] s

Comprobaciones
  ✔ Se pueden crear máquinas virtuales.
  ✔ Los nombres de las instancias están libres.
  ✔ Las redes no se solapan con las que ya hay.
  ✔ Las imágenes existen.

Borrar
  ✔ cliente1: borrada.

Redes
  ✔ lan: ya existe (esc-1).

Instancias
  ✔ cliente1 lista (72 s).

Listo
  ✔ cortafuegos  eth0 10.125.174.203, eth1 10.0.0.1       openlab shell cortafuegos
  ✔ cliente1     eth0 10.0.0.10                           openlab shell cliente1
  ✔ cliente2     eth0 10.0.0.11                           openlab shell cliente2
    Usuario: usuario, contraseña usuario.
```

Esta vez ha tardado 72 segundos, en lugar de los 139 del cortafuegos: la imagen de máquina virtual de Debian ya estaba en la caché. Comprobamos:

```
$ incus config get contenedores-y-vm-cliente1 volatile.uuid
4e99d95d-2650-40bf-9f66-a579f6f846d7

$ incus list -c nst4
+-------------------------------+---------+-----------------+-----------------------+
|             NAME              |  STATE  |      TYPE       |         IPV4          |
+-------------------------------+---------+-----------------+-----------------------+
| contenedores-y-vm-cliente1    | RUNNING | VIRTUAL-MACHINE | 10.0.0.10 (eth0)      |
+-------------------------------+---------+-----------------+-----------------------+
| contenedores-y-vm-cliente2    | RUNNING | CONTAINER       | 10.0.0.11 (eth0)      |
+-------------------------------+---------+-----------------+-----------------------+
| contenedores-y-vm-cortafuegos | RUNNING | VIRTUAL-MACHINE | 10.125.174.203 (eth0) |
|                               |         |                 | 10.0.0.1 (eth1)       |
+-------------------------------+---------+-----------------+-----------------------+

$ incus exec contenedores-y-vm-cliente1 -- uname -r
6.12.117+deb13-amd64
```

El identificador es otro: **es una instancia nueva**, ahora con su propio núcleo. Pero para el resto del escenario no ha cambiado nada: se llama igual, tiene la misma IP y su interfaz se sigue llamando `eth0`.

En resumen, esto es lo que hace `openlab up` cuando cambia el tipo de una instancia:

| Cambio de tipo | ¿Qué hace `openlab up`? |
|---|---|
| De contenedor a contenedor (`c.small` → `c.medium`) | Cambia `limits.cpu` y `limits.memory`, en caliente |
| De máquina virtual a máquina virtual (`vm` → `vm.medium`) | La para, cambia los límites y el tamaño del disco, y la arranca. Es la misma instancia |
| De máquina virtual a otra con el disco menor | Cambia la CPU y la memoria, pero el disco no se reduce: avisa |
| De contenedor a máquina virtual, o al revés | La borra y la crea de nuevo |

Cuando terminemos, borramos el escenario con `openlab destroy`.

## Hazlo tú a mano

Vamos a crear una máquina virtual sin openLAB. La orden es la misma que para un contenedor, `incus launch`, con la opción `--vm`:

```
$ incus launch images:debian/13 mi-vm --vm \
    -c limits.cpu=1 -c limits.memory=1GiB \
    -d root,size=10GiB
Launching mi-vm
```

Con el mismo alias, `images:debian/13`, Incus elige ahora la imagen de máquina virtual. Con `-c` indicamos las opciones de configuración, como en un contenedor, y con `-d` cambiamos una propiedad de un dispositivo que viene del perfil: el tamaño del disco raíz. Si no decimos nada, una máquina virtual de Incus tiene 1 CPU, 1 GiB de memoria y 10 GiB de disco.

Si intentamos entrar enseguida, nos encontramos con el agente:

```
$ incus exec mi-vm -- hostname
Error: VM agent isn't currently running

$ incus list mi-vm
+-------+---------+------+------------------------------------------------+-----------------+-----------+
| NAME  |  STATE  | IPV4 |                      IPV6                      |      TYPE       | SNAPSHOTS |
+-------+---------+------+------------------------------------------------+-----------------+-----------+
| mi-vm | RUNNING |      | fd42:21de:d612:ecd2:1266:6aff:fe81:dc38 (eth0) | VIRTUAL-MACHINE | 0         |
+-------+---------+------+------------------------------------------------+-----------------+-----------+
```

La máquina está `RUNNING`, porque el proceso de QEMU ya está en marcha, pero su sistema todavía está arrancando y el agente no ha empezado a funcionar. Unos segundos después:

```
$ incus exec mi-vm -- hostname
mi-vm

$ incus exec mi-vm -- uname -r
6.12.117+deb13-amd64

$ incus exec mi-vm -- ip -br a
lo               UNKNOWN        127.0.0.1/8 ::1/128
enp5s0           UP             10.125.174.192/24 metric 1024 fe80::1266:6aff:fe81:dc38/64

$ incus list mi-vm
+-------+---------+-------------------------+------+-----------------+-----------+
| NAME  |  STATE  |          IPV4           | IPV6 |      TYPE       | SNAPSHOTS |
+-------+---------+-------------------------+------+-----------------+-----------+
| mi-vm | RUNNING | 10.125.174.192 (enp5s0) |      | VIRTUAL-MACHINE | 0         |
+-------+---------+-------------------------+------+-----------------+-----------+
```

Aquí está lo que contábamos antes: sin los ficheros `.link` de openLAB, la interfaz de la máquina virtual se llama `enp5s0`, aunque el dispositivo del perfil se llame `eth0`. Y la lista de instancias cambia cuando el agente arranca, porque es él quien le cuenta a Incus qué interfaces y qué direcciones hay dentro.

Mientras arranca, puedes abrir su consola en otra terminal para ver el arranque (`incus console mi-vm`, o con `--type=vga`).

Ahora cambiamos su memoria. En marcha no se puede aumentar, así que la paramos antes:

```
$ incus stop mi-vm

$ incus config set mi-vm limits.memory=2GiB

$ incus start mi-vm

$ incus exec mi-vm -- free -m
               total        used        free      shared  buff/cache   available
Mem:            1951         241        1755          18          75        1710
Swap:              0           0           0
```

`incus stop` no apaga la máquina de golpe: le envía la señal del botón de apagado (ACPI), como si lo pulsáramos, y espera a que su sistema termine. Con `--force` la apaga de golpe.

Por último, la borramos:

```
$ incus delete --force mi-vm
```

## Contenedor o máquina virtual

Un resumen de lo que hemos visto:

| | Contenedor | Máquina virtual |
|---|---|---|
| Lo gestiona | LXC | QEMU y KVM |
| Núcleo | El del anfitrión | El suyo |
| En el anfitrión es | Un grupo de procesos, que se ven con `ps` | Un proceso `qemu-system-x86_64` |
| Imagen | Un sistema de ficheros (`squashfs`) | Un disco (`disk-kvm.img`) |
| Arranque | Unos segundos | Bastante más: firmware, cargador y núcleo |
| `limits.cpu` y `limits.memory` | Un tope (cgroups), que dentro enseña LXCFS | El hardware de la máquina |
| Cambiar los límites | En caliente | La memoria, con la máquina parada |
| Disco raíz | Un directorio del anfitrión (con el almacenamiento `dir`) | Un disco con su tamaño |
| Interfaces en el anfitrión | `veth` | `tap` |
| `incus exec` | Un proceso más del anfitrión, dentro del contenedor | A través del agente |
| Consola | De texto | De texto y gráfica (`--type=vga`) |
| Para qué | Casi todo | Lo que depende del núcleo: módulos, Docker, virtualización, otros sistemas |

## Más allá de openLAB

Algunas funciones de Incus relacionadas con lo que hemos visto en esta entrada que openLAB no usa:

- **Contenedores dentro de contenedores**: con `security.nesting=true`, dentro de un contenedor se puede ejecutar Docker u otro Incus, sin necesidad de una máquina virtual.
- **Contenedores privilegiados y traducción de usuarios**: `security.privileged` quita la traducción que hemos visto (el `root` de dentro es el del anfitrión, con el riesgo que supone), y `security.idmap.isolated` le da a cada contenedor un rango de usuarios distinto.
- **Otros límites de CPU**: `limits.cpu` admite también CPU concretas (`limits.cpu=0-3`), `limits.cpu.allowance` limita el tiempo de CPU (`50%`) y `limits.cpu.priority`, la prioridad.
- **Otros límites**: `limits.processes` (cuántos procesos puede tener un contenedor), `limits.memory.enforce` o `limits.memory.swap`.
- **Arranque seguro**: las máquinas virtuales de Incus arrancan con UEFI y *Secure Boot*; `security.secureboot=false` lo desactiva para los sistemas que no lo admiten.
- **Dispositivos del anfitrión**: además de `nic` y `disk`, una instancia puede recibir una GPU (`gpu`), un dispositivo USB (`usb`) o un dispositivo de caracteres (`unix-char`).
- **Ver el consumo**: `incus info` muestra lo que usa cada instancia, e `incus top`, todas a la vez, como `top`.
- **Ficheros**: `incus file push` e `incus file pull` copian ficheros entre el anfitrión y una instancia, también en las máquinas virtuales, gracias al agente.

Toda la información está en la [documentación de Incus](https://linuxcontainers.org/incus/docs/main/).

En la siguiente entrada veremos las redes: qué son `incusbr0` y `esc-1`, cómo se conectan a ellas las instancias y cómo consigue openLAB que una red esté aislada.
