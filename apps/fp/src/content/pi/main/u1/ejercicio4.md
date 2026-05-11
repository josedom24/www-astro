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

2. Instala OpenTofu y haz un fork del repositorio de ejemplos: [https://github.com/josedom24/opentofu-libvirt/](https://github.com/josedom24/opentofu-libvirt/).

## Ejemplo 1: Máquina virtual conectada a la red "default"

Empezamos a trabajar en el directorio `ejemplo1`. En este ejemplo vamos a crear una máquina virtual conectada a la red `default`. OpenTofu trabaja con ficheros **tf** que se pueden llamar como queramos. Veamos los ficheros con los que vamos a trabajar:

* `provider.tf`: Configura el provider que vamos a usar y lo configura. El plugin del provider se instala en el directorio `.terraform` cuando ejecutamos `tofu init`. Este comando normalmente **sólo se ejecuta una vez**. Este fichero **no hay que modificarlo**.
* `variables.tf`: Se declaran variables globales, que podemos usar en nuestras definiciones. En este caso se definen:
  * `var.libvirt_pool_name`: donde guardamos el nombre del pool en el que queremos crear la máquina virtual. Su valor por defecto es `default`.
  * `var.libvirt_pool_path`: donde se guarda el directorio correspondiente al pool `default`, normalmente es `/var/lib/libvirt/images`.
  Este fichero **se modifica una vez** indicando vuestros datos particulares.
* `cloud-init/base.yaml`: Fichero para configurar la máquina instalando los paquetes y configurando lo necesario para que el teclado esté en español cuando accedemos a la máquina. **No hay que modificarlo**.
* `cloud-init/server1/user-data.yaml`: Fichero para configurar la máquina virtual con el mecanismo de cloud-init. En este ejemplo:
  * Se indica el hostname.
  * Se configura el usuario `debian` y se le pone una contraseña.
  * Se ejecuta una `apt update`.
* `main.tf`: Aquí está la definición de los recursos con los que queremos trabajar. En este fichero se definen los siguientes recursos:
  * `resource "libvirt_volume" "server1-disk"`: Un volumen creado con clonación enlazada cuya imagen base está indicada con el parámetro `base_volume_id`.
  * `resource "libvirt_cloudinit_disk" "server1-cloudinit"`: Un disco con formato ISO donde se guarda el fichero de configuración de cloud-init.
  * `resource "libvirt_domain" "server1"`: Una máquina virtual, donde se indica el nombre, la memoria, el número de CPUs, la red a la que está conectada y los discos que tiene.
* `output.tf`: Se define la información que se mostrará al terminar de crear el escenario. Este fichero **no tienes que modificarlo**.

Realiza los cambios que creas convenientes en los siguientes ficheros: `variables.tf` para ajustar las variables, `cloud-init/server1/user-data.yaml` para cambiar la configuración de la máquina, por ejemplo **indicar tu clave pública** y `main.tf` por si quieres cambiar la imagen base, cambiar la memoria o cpus o conectarlo a otra red.

Una vez hechos los cambios, **los comandos se ejecutan en el directorio del proyecto**:

* Ejecutamos **una sola vez** el comando `tofu init` para instalar el plugin del provider.
* Ejecutamos el comando `tofu plan` para ver las acciones que se van a realizar.
* Para aplicar el escenario descrito ejecutamos `tofu apply`.
* Una vez creado el escenario nos saldrá la información definida en `output.tf`. Esta información siempre se puede mostrar ejecutando `tofu output`.
* Podemos ver el estado de los recursos ejecutando `tofu show`.
* Para eliminar todos los recursos creados, ejecutamos `tofu destroy`.

**¿Qué tienes que realizar?**

1. Configura tu escenario de forma adecuada para crear una máquina virtual con debian13. Conecta por ssh con la máquina. Destruye el escenario.
2. Modifica los ficheros necesarios para crear una máquina virtual con ubuntu: `cloud-init/server1/user-data.yaml` y `main.tf`. Conecta por ssh con la máquina. Destruye el escenario.

## Ejemplo 2: Máquina virtual con disco adicional

Este ejemplo es similar al anterior, pero en esta ocasión la máquina virtual tiene un disco adicional de 1Gb. En este caso en el fichero `main.tf` se declaran 4 recursos:

* El disco principal de la máquina virtual creado con clonación enlazada.
* El disco ISO con el fichero para configurar el cloud-init.
* Un disco adicional de 1Gb que se conectará con la máquina virtual.
* La máquina virtual que tiene dos parámetros `disk` donde se especifican los dos discos: el principal y el extra.

**¿Qué tienes que realizar?**

1. Modifica el fichero `main.tf` para crear otro disco de 5Gb y añadirlo a la máquina virtual.
2. Accede a la máquina virtual por ssh y comprueba con `lsblk` los discos que se han añadido.
3. Destruye el escenario.

## Ejemplo 3: Máquina virtual conectada a dos redes con DHCP

En este ejemplo vamos a comenzar a trabajar con las redes. En los dos ejemplos anteriores habíamos conectado la máquina virtual a una red no gestionada por OpenTofu. En este ejemplo vamos a crear redes gestionadas por OpenTofu, que se crearán con `tofu apply` y se eliminarán con `tofu destroy`.

Hemos añadido el fichero `networks.tf` donde se van a definir las redes. En este caso:

* Se crea una red NAT con DHCP con el recurso `resource "libvirt_network" "nat_dhcp"`. Estudia los distintos parámetros que hemos indicado.
* Tienes comentado la definición de otros tipos de redes por si en otro ejercicio las quieres definir.

A continuación estudia la definición del recurso de la máquina virtual en el fichero `main.tf` y comprueba que la máquina está conectada a dos redes. Recuerda que cuando conectamos a una red con servidor DHCP indicamos el parámetro `wait_for_lease = true`.

* Cuando la red no es creada por OpenTofu, por ejemplo `default`, indicamos el nombre con el parámetro `network_name`.
* Cuando la red es gestionada por OpenTofu, indicamos su id con el parámetro `network_id`, por ejemplo: `network_id = libvirt_network.nat-dhcp.id`.

El hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Creamos el fichero `cloud-init/server1/network-config.yaml` donde guardaremos la configuración netplan de la máquina.
* Añadimos este fichero en la imagen ISO junto al fichero `cloud-init/server1/user-data.yaml`. Esto se hace con el parámetro `network_config` del recurso `resource "libvirt_cloudinit_disk" "server1-cloudinit"` en el fichero `main.tf`.

:::tip[¿Qué tienes que entregar?]
1. Configura tu escenario de forma adecuada y créalo. Conecta por ssh con la máquina. Comprueba con `ip a` que está conectado a dos redes. Destruye el escenario.
2. Crea una nueva red de tipo NAT con servidor DHCP. Modifica la definición de la máquina para conectarla a esta nueva red. Modifica la configuración de red (fichero `cloud-init/server1/network-config.yaml`) para configurar la tercera interfaz y finalmente modifica el fichero `output.tf` para que salga información de la tercera IP.
3. Crea el escenario, comprueba que la máquina tiene 3 interfaces configuradas. Destruye el escenario.
:::

