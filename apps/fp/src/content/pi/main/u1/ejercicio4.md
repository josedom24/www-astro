---
title: "Ejercicio 4: Introducción a OpenTofu + libvirt"
---

1. Vamos a descargar las imágenes cloud con las que vamos a trabajar. Las vamos a copiar en el directorio correspondiente al pool `default`:

    ```
    cd /var/lib/libvirt/images
    sudo wget https://cloud.debian.org/images/cloud/trixie/daily/latest/debian-13-genericcloud-amd64-daily.qcow2 -O debian13-base.qcow2
    sudo wget https://cloud-images.ubuntu.com/noble/20251001/noble-server-cloudimg-amd64.img -O ubuntu2404-base.qcow2
    ```

    Las imágenes bases se llaman `debian13-base.qcow2` y `ubuntu2404-base.qcow2`.

    Estos discos son muy pequeños, por lo tanto antes de empezar a utilizarlos vamos a redimensionarlos:

    ```
    qemu-img resize debian13-base.qcow2 10G
    qemu-img resize ubuntu2404-base.qcow2 10G
    ```

2. Instala OpenTofu. Vamos a trabajar con el repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi) que ya tienes en tu equipo. Para cada ejemplo nos situamos en el directorio **02_opentofu/ejemploX** correspondiente.

## Ejemplo 1: Máquina virtual conectada a la red "default"

En este ejemplo vamos a crear una máquina virtual conectada a la red `default`. OpenTofu trabaja con ficheros **tf** que se pueden llamar como queramos. Veamos los ficheros con los que vamos a trabajar:

* `provider.tf`: Configura el provider `dmacvicar/libvirt` y la URI de conexión (`qemu:///system`). El plugin del provider se instala en el directorio `.terraform` cuando ejecutamos `tofu init`. Este comando normalmente **sólo se ejecuta una vez**. Este fichero **no hay que modificarlo**.
* `variables.tf`: Se declaran variables globales, que podemos usar en nuestras definiciones. En este caso se definen:
  * `var.libvirt_pool_name`: nombre del pool de almacenamiento donde se crean los volúmenes. Su valor por defecto es `default`.
  * `var.base_image`: nombre de la imagen base en el pool. Su valor por defecto es `debian13-base.qcow2`.
* `cloud-init/user-data1.yaml`: Fichero para configurar la máquina virtual con el mecanismo de cloud-init. En este ejemplo:
  * Se indica el hostname, zona horaria, locale y teclado.
  * Se configura el usuario `debian` con acceso sudo sin contraseña, clave ssh y contraseña.
  * Se instala `qemu-guest-agent` y se actualiza el sistema.

  **Debes modificar este fichero para añadir tu clave pública** en el campo `ssh-authorized-keys`.
* `main.tf`: Aquí está la definición de los recursos con los que queremos trabajar. En este fichero se definen los siguientes recursos:
  * `resource "libvirt_volume" "ej1-server1-disk"`: Un clon ligero sobre la imagen base indicada por `var.base_image`, usando `base_volume_name` y `base_volume_pool`.
  * `resource "libvirt_cloudinit_disk" "ej1-server1-cloudinit"`: Un disco con formato ISO donde se guarda el fichero `cloud-init/user-data1.yaml`.
  * `resource "libvirt_domain" "ej1-server1"`: Una máquina virtual con 1024 MB de RAM, 2 vCPUs, conectada a la red `default` y con consola serie habilitada.
* `output.tf`: Se define la información que se mostrará al terminar de crear el escenario (nombre e IP de la máquina). Este fichero **no hay que modificarlo**.

Modifica `cloud-init/user-data1.yaml` para **añadir tu clave pública** y, si lo deseas, `main.tf` para cambiar la memoria o el número de CPUs.

Una vez hechos los cambios, **los comandos se ejecutan en el directorio del proyecto**:

* Ejecutamos **una sola vez** el comando `tofu init` para instalar el plugin del provider.
* Ejecutamos el comando `tofu plan` para ver las acciones que se van a realizar.
* Para aplicar el escenario descrito ejecutamos `tofu apply`.
* Una vez creado el escenario nos saldrá la información definida en `output.tf`. Esta información siempre se puede mostrar ejecutando `tofu output`.
* Podemos ver el estado de los recursos ejecutando `tofu show`.
* Para eliminar todos los recursos creados, ejecutamos `tofu destroy`.

**¿Qué tienes que realizar?**

1. Configura tu escenario de forma adecuada para crear una máquina virtual con debian13. Conecta por ssh con la máquina. Destruye el escenario.
2. Modifica los ficheros necesarios para crear una máquina virtual con ubuntu: cambia `var.base_image` en `variables.tf` a `ubuntu2404-base.qcow2` y adapta `cloud-init/user-data1.yaml` (el usuario por defecto en Ubuntu es `ubuntu`). Conecta por ssh con la máquina. Destruye el escenario.

## Ejemplo 2: Máquina virtual con disco adicional

Nos situamos en el directorio `02_opentofu/ejemplo2`. Este ejemplo es similar al anterior, pero en esta ocasión la máquina virtual tiene un disco adicional de 1 GB. En el fichero `main.tf` se declaran 4 recursos:

* `libvirt_volume "ej2-server1-disk"`: el disco principal creado con clonación enlazada.
* `libvirt_volume "ej2-server1-disk-extra1"`: un disco adicional vacío de 1 GB (el tamaño se indica en bytes: `1 * 1024 * 1024 * 1024`).
* `libvirt_cloudinit_disk "ej2-server1-cloudinit"`: el disco ISO con la configuración cloud-init.
* `libvirt_domain "ej2-server1"`: la máquina virtual, con dos entradas `disk` para el disco principal y el extra.

**¿Qué tienes que realizar?**

1. Modifica el fichero `main.tf` para crear otro disco de 5 GB y añadirlo a la máquina virtual.
2. Accede a la máquina virtual por ssh y comprueba con `lsblk` los discos que se han añadido.
3. Destruye el escenario.

## Ejemplo 3: Máquina virtual conectada a dos redes con DHCP

Nos situamos en el directorio `02_opentofu/ejemplo3`. En este ejemplo vamos a comenzar a trabajar con las redes. En los dos ejemplos anteriores habíamos conectado la máquina virtual a la red `default`, que no es gestionada por OpenTofu. En este ejemplo vamos a crear redes gestionadas por OpenTofu, que se crearán con `tofu apply` y se eliminarán con `tofu destroy`.

Se ha añadido el fichero `network.tf` donde se define la red:

* `resource "libvirt_network" "nat-dhcp"`: una red NAT con DHCP en el rango `192.168.100.0/24`. Estudia los parámetros que hemos indicado.

A continuación estudia la definición del recurso de la máquina virtual en el fichero `main.tf` y comprueba que la máquina está conectada a dos redes. Recuerda que cuando conectamos a una red con servidor DHCP indicamos el parámetro `wait_for_lease = true`.

* Cuando la red no es creada por OpenTofu, por ejemplo `default`, indicamos el nombre con el parámetro `network_name`.
* Cuando la red es gestionada por OpenTofu, indicamos su id con el parámetro `network_id`, por ejemplo: `network_id = libvirt_network.nat-dhcp.id`.

El hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Creamos el fichero `cloud-init/network-config1.yaml` donde guardaremos la configuración netplan de la máquina.
* Añadimos este fichero en la imagen ISO junto al fichero `cloud-init/user-data1.yaml`. Esto se hace con el parámetro `network_config` del recurso `libvirt_cloudinit_disk "ej3-server1-cloudinit"` en el fichero `main.tf`.

:::tip[¿Qué tienes que entregar?]
1. Configura tu escenario de forma adecuada y créalo. Conecta por ssh con la máquina. Comprueba con `ip a` que está conectado a dos redes. Destruye el escenario.
2. Crea una nueva red de tipo NAT con servidor DHCP. Modifica la definición de la máquina para conectarla a esta nueva red. Modifica la configuración de red (fichero `cloud-init/network-config1.yaml`) para configurar la tercera interfaz y finalmente modifica el fichero `output.tf` para que salga información de la tercera IP.
3. Crea el escenario, comprueba que la máquina tiene 3 interfaces configuradas. Destruye el escenario.
:::

