---
title: "Tarea 4: Introducción a OpenTofu + libvirt"
---

1. Vamos a descargar las imágenes cloud con las que vamos a trabajar. Las vamos a copiar en el directorio correspondiente al pool `default`:

    ```
    cd /var/lib/libvirt/images
    sudo wget https://cloud.debian.org/images/cloud/trixie/latest/debian-13-genericcloud-amd64.qcow2 -O debian13-base.qcow2
    sudo wget https://cloud-images.ubuntu.com/resolute/current/resolute-server-cloudimg-amd64.img -O ubuntu2604-base.qcow2
    ```

    Las imágenes bases se llaman `debian13-base.qcow2` (Debian 13) y `ubuntu2604-base.qcow2` (Ubuntu 26.04).

    Estos discos son muy pequeños, por lo tanto antes de empezar a utilizarlos vamos a redimensionarlos:

    ```
    sudo qemu-img resize debian13-base.qcow2 10G
    sudo qemu-img resize ubuntu2604-base.qcow2 10G
    ```

    Como hemos copiado los ficheros directamente en el directorio del pool, hay que pedirle a libvirt que lo vuelva a leer. Si no, OpenTofu no encontrará las imágenes (`storage volume not found`):

    ```
    sudo virsh pool-refresh default
    virsh -c qemu:///system vol-list default
    ```

2. Instala OpenTofu. Vamos a trabajar con el repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi) que ya tienes en tu equipo. Para cada ejemplo nos situamos en el directorio **opentofu/ejemploX** correspondiente.

## Ejemplo 1: Máquina virtual conectada a la red "default"

En este ejemplo vamos a crear una máquina virtual conectada a la red `default`. OpenTofu trabaja con ficheros **tf** que se pueden llamar como queramos. Veamos los ficheros con los que vamos a trabajar:

* `provider.tf`: Configura el provider `dmacvicar/libvirt` y la URI de conexión (`qemu:///system`). El plugin del provider se instala en el directorio `.terraform` cuando ejecutamos `tofu init`. Este comando normalmente **sólo se ejecuta una vez**. Este fichero **no hay que modificarlo**: la versión del provider está fijada a la `0.8.3`, la última con esta sintaxis: desde la `0.9` el provider se ha reescrito y usa otra. Cuando busques documentación del provider, consulta la de la versión `0.8.3`.
* `variables.tf`: Se declaran variables globales, que podemos usar en nuestras definiciones. En este caso se definen:
  * `var.libvirt_pool_name`: nombre del pool de almacenamiento donde se crean los volúmenes. Su valor por defecto es `default`.
  * `var.base_image`: nombre de la imagen base en el pool. Su valor por defecto es `debian13-base.qcow2`.
* `cloud-init/user-data1.yaml`: Fichero para configurar la máquina virtual con el mecanismo de cloud-init. En este ejemplo:
  * Se indica el hostname, zona horaria, locale y teclado.
  * Se configura el usuario `debian` con acceso sudo sin contraseña, clave ssh y contraseña.
  * Se instala `qemu-guest-agent` y se actualiza el sistema.

  **Debes modificar este fichero para poner tu clave pública**: sustituye la línea de ejemplo del campo `ssh-authorized-keys`.
* `main.tf`: Aquí está la definición de los recursos con los que queremos trabajar. En este fichero se definen los siguientes recursos:
  * `resource "libvirt_volume" "ej1-server1-disk"`: Un clon ligero sobre la imagen base indicada por `var.base_image`, usando `base_volume_name` y `base_volume_pool`.
  * `resource "libvirt_cloudinit_disk" "ej1-server1-cloudinit"`: Un disco con formato ISO donde se guarda el fichero `cloud-init/user-data1.yaml`.
  * `resource "libvirt_domain" "ej1-server1"`: Una máquina virtual con 1024 MB de RAM, 2 vCPUs, conectada a la red `default` y con consola serie habilitada. Con `qemu_agent = true`, OpenTofu pregunta la IP de la máquina al agente `qemu-guest-agent`, que instala cloud-init.
* `output.tf`: Se define la información que se mostrará al terminar de crear el escenario (nombre e IP de la máquina). Este fichero **no hay que modificarlo**.

Modifica `cloud-init/user-data1.yaml` para **poner tu clave pública** y, si lo deseas, `main.tf` para cambiar la memoria o el número de CPUs.

Una vez hechos los cambios, **los comandos se ejecutan en el directorio del proyecto**:

* Ejecutamos **una sola vez** el comando `tofu init` para instalar el plugin del provider.
* Ejecutamos el comando `tofu plan` para ver las acciones que se van a realizar.
* Para aplicar el escenario descrito ejecutamos `tofu apply`.
* Una vez creado el escenario nos saldrá la información definida en `output.tf`. Esta información siempre se puede mostrar ejecutando `tofu output`.
* Podemos ver el estado de los recursos ejecutando `tofu show`.
* Para eliminar todos los recursos creados, ejecutamos `tofu destroy`.

**Destruye siempre el escenario antes de pasar al siguiente ejemplo**: además de liberar recursos, varios ejemplos crean redes con el mismo rango (`192.168.100.0/24`) y libvirt no deja crear dos redes con el mismo rango.

:::tip[¿Qué tienes que entregar?]
1. Configura tu escenario para crear una máquina virtual con debian13. Entrega el fichero `cloud-init/user-data1.yaml` modificado, y el comando y la salida del acceso por ssh a la máquina. Destruye el escenario.
2. Modifica los ficheros necesarios para crear una máquina virtual con ubuntu (cambia `var.base_image` en `variables.tf` y adapta `cloud-init/user-data1.yaml`). Entrega los ficheros modificados, y el comando y la salida del acceso por ssh a la máquina. Destruye el escenario.
:::

## Ejemplo 2: Máquina virtual con disco adicional

Nos situamos en el directorio `opentofu/ejemplo2`. Este ejemplo es similar al anterior, pero en esta ocasión la máquina virtual tiene un disco adicional de 1 GB. En el fichero `main.tf` se declaran 4 recursos:

* `libvirt_volume "ej2-server1-disk"`: el disco principal creado con clonación enlazada.
* `libvirt_volume "ej2-server1-disk-extra1"`: un disco adicional vacío de 1 GB (el tamaño se indica en bytes: `1 * 1024 * 1024 * 1024`).
* `libvirt_cloudinit_disk "ej2-server1-cloudinit"`: el disco ISO con la configuración cloud-init.
* `libvirt_domain "ej2-server1"`: la máquina virtual, con dos entradas `disk` para el disco principal y el extra.

:::tip[¿Qué tienes que entregar?]
1. Modifica el fichero `main.tf` para crear otro disco de 5 GB y añadirlo a la máquina virtual. Entrega el fichero `main.tf` modificado.
2. Entrega la salida de `lsblk` en la máquina, donde se vean los discos añadidos.
3. Destruye el escenario.
:::

## Ciclo de vida de los recursos

Seguimos en el directorio `opentofu/ejemplo2`, con el escenario del ejemplo 2 creado (sin el disco de 5 GB). Ahora vamos a ver qué hace OpenTofu cuando **cambiamos** la descripción de un escenario que ya existe. Después de cada cambio, ejecuta `tofu plan`, fíjate en lo que propone y aplícalo con `tofu apply`:

* `~ update in-place`: el recurso se modifica sin destruirlo.
* `-/+ destroy and then create replacement`: el recurso se destruye y se vuelve a crear. El `plan` indica qué cambio lo obliga (`forces replacement`).
* `+ create`: el recurso se crea.

1. **Un cambio que se aplica en el sitio.** Añade `autostart = true` al recurso `libvirt_domain`, para que la máquina arranque con el anfitrión.
2. **Un cambio que obliga a recrear la máquina.** Antes, entra en la máquina y crea un fichero en el directorio de tu usuario. Cambia la memoria a 2048 MB y aplica. Entra otra vez en la máquina.
3. **Un cambio que se propaga.** Cambia `var.base_image` por la imagen de Ubuntu. Fíjate en qué recursos se recrean.
4. **Cambios hechos fuera de OpenTofu.** Borra la máquina a mano (`virsh -c qemu:///system destroy ej2-server1` y `virsh -c qemu:///system undefine ej2-server1`) y ejecuta `tofu plan`. Aplícalo y destruye el escenario.

:::tip[¿Qué tienes que entregar?]
1. Las líneas del `plan` del cambio 1 donde se ve el tipo de cambio.
2. Las líneas del `plan` del cambio 2 donde se ve el tipo de cambio y qué lo obliga. ¿Sigue el fichero que creaste? ¿Tiene la máquina la misma IP? **¿Por qué?**
3. Las líneas del `plan` del cambio 3 con los recursos que se recrean. **¿Por qué se recrea también la máquina, si no has tocado `libvirt_domain`?**
4. La salida de `tofu plan` después de borrar la máquina a mano. **¿Cómo sabe OpenTofu que falta, y qué papel tiene el estado (`terraform.tfstate`)?**
:::

## Ejemplo 3: Máquina virtual conectada a dos redes con DHCP

Nos situamos en el directorio `opentofu/ejemplo3`. En este ejemplo vamos a comenzar a trabajar con las redes. En los dos ejemplos anteriores habíamos conectado la máquina virtual a la red `default`, que no es gestionada por OpenTofu. En este ejemplo vamos a crear redes gestionadas por OpenTofu, que se crearán con `tofu apply` y se eliminarán con `tofu destroy`.

Se ha añadido el fichero `network.tf` donde se define la red:

* `resource "libvirt_network" "ej3-nat-dhcp"`: una red NAT con DHCP en el rango `192.168.100.0/24`. Estudia los parámetros que hemos indicado.

A continuación estudia la definición del recurso de la máquina virtual en el fichero `main.tf` y comprueba que la máquina está conectada a dos redes (como en el ejemplo 2, también tiene un disco adicional de 1 GB). Recuerda que cuando conectamos a una red con servidor DHCP indicamos el parámetro `wait_for_lease = true`.

* Cuando la red no es creada por OpenTofu, por ejemplo `default`, indicamos el nombre con el parámetro `network_name`.
* Cuando la red es gestionada por OpenTofu, indicamos su id con el parámetro `network_id`, por ejemplo: `network_id = libvirt_network.ej3-nat-dhcp.id`.

El hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Se ha creado el fichero `cloud-init/network-config1.yaml`, donde se guarda la configuración netplan de la máquina.
* Este fichero se añade en la imagen ISO junto al fichero `cloud-init/user-data1.yaml`. Esto se hace con el parámetro `network_config` del recurso `libvirt_cloudinit_disk "ej3-server1-cloudinit"` en el fichero `main.tf`.

:::tip[¿Qué tienes que entregar?]
1. Configura el escenario y crea la máquina conectada a las dos redes. Entrega la salida de `ip a`.
2. Crea una nueva red NAT con DHCP, con un rango distinto (por ejemplo, `192.168.110.0/24`), y conecta la máquina a ella, configurando la tercera interfaz en cloud-init y en `output.tf`. Entrega los ficheros modificados (`network.tf`, `main.tf`, `cloud-init/network-config1.yaml`, `output.tf`).
3. Entrega la salida de `ip a` mostrando la máquina con sus 3 interfaces correctamente configuradas.
4. Destruye el escenario.
:::

