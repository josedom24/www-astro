---
title: "Tarea 5: Creación de escenarios con OpenTofu"
---

Seguimos trabajando con el repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi). Para cada ejemplo nos situamos en el directorio **opentofu/ejemploX** correspondiente.

## Ejemplo 4: Máquina virtual conectada a dos redes: una con DHCP y otra con direccionamiento estático

Nos situamos en el directorio `opentofu/ejemplo4`. En este ejemplo seguimos trabajando con redes. En esta ocasión vamos a aprender a **configurar una interfaz de red de forma estática**. Como en el ejemplo 3, la máquina tiene también un disco adicional de 1 GB.

En el fichero `network.tf` se definen dos redes:

* `resource "libvirt_network" "ej4-nat-dhcp"`: una red NAT con DHCP en el rango `192.168.100.0/24`.
* `resource "libvirt_network" "ej4-aislada-static"`: una red **aislada sin DHCP** (`mode = "none"`) en el rango `192.168.130.0/24`. Estudia los parámetros que hemos indicado.

Recuerda: el hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Se ha creado el fichero `cloud-init/network-config1.yaml`, donde se guarda la configuración netplan de la máquina. En este ejemplo puedes observar cómo se ha configurado `ens4` de forma estática con la dirección `192.168.130.10/24`. Si fuera necesario podríamos indicar la puerta de enlace, el servidor DNS o cualquier otra configuración de red.
* Este fichero se añade en la imagen ISO junto al fichero `cloud-init/user-data1.yaml` con el parámetro `network_config` del recurso `libvirt_cloudinit_disk "ej4-server1-cloudinit"` en el fichero `main.tf`.

OpenTofu obtiene las direcciones de la máquina de las concesiones (*leases*) del servidor DHCP de libvirt, así que solo conoce las que se asignan por DHCP. La dirección estática no pasa por ningún servidor DHCP: por eso en `output.tf` está escrita a mano (`ip2`), copiada de `cloud-init/network-config1.yaml`. Si cambias la dirección estática, tienes que cambiarla en los dos ficheros.

:::tip[¿Qué tienes que entregar?]
1. Configura el escenario, crea la máquina virtual con debian13 y comprueba que las dos interfaces están configuradas. Entrega el comando y la salida del ping desde el anfitrión a la dirección estática, y la salida de `ip a` en el anfitrión donde se vea el bridge de la red `ej4-aislada-static`. ¿Funciona el ping? **Explícalo con lo que ves en el anfitrión.** Destruye el escenario.
2. Crea una nueva **red muy aislada** (`mode = "none"`, sin `addresses`) y conecta la máquina a ella con una dirección en `172.16.0.0/16`. Entrega los ficheros modificados, el comando y la salida del ping desde el anfitrión a esa dirección, y la salida de `ip a` en el anfitrión donde se vea el bridge de esa red. ¿Funciona el ping? **Explícalo con lo que ves en el anfitrión.** Destruye el escenario.
:::

## Ejemplo 5: Dos máquinas virtuales conectadas entre sí

Nos situamos en el directorio `opentofu/ejemplo5`. En este ejemplo vamos a comenzar a crear escenarios, es decir, a crear varias máquinas interconectadas. En este ejemplo concreto tenemos dos máquinas que están conectadas entre sí. Para conseguirlo tenemos los siguientes ficheros:

* `main.tf`: contiene la definición de las dos máquinas virtuales (`ej5-server1` y `ej5-server2`) en un único fichero.
* En el directorio `cloud-init` encontramos los ficheros de configuración para cada máquina:
  * `user-data1.yaml`: configura `ej5-server1` (Debian, usuario `debian`).
  * `user-data2.yaml`: configura `ej5-server2` (Ubuntu, usuario `ubuntu`). La actualización del sistema está comentada: `ej5-server2` no tiene salida al exterior y cloud-init fallaría al usar apt.
  * `network-config1.yaml`: configura las interfaces de red de `ej5-server1` (`ens3` con DHCP, `ens4` con IP estática `10.0.0.1/24`).
  * `network-config2.yaml`: configura la interfaz de red de `ej5-server2` (`ens3` con IP estática `10.0.0.2/24` y ruta por defecto por `10.0.0.1`, con `routes`).
* `network.tf`: define dos redes: `ej5-nat-dhcp` (NAT con DHCP) y `ej5-muy-aislada` (`mode = "none"`, sin rango de direcciones).
* `variables.tf`: define tres variables: `libvirt_pool_name`, `base_image_debian` (`debian13-base.qcow2`) y `base_image_ubuntu` (`ubuntu2604-base.qcow2`).
* `inventario.tf` y `inventario.tftpl`: generan el **inventario de Ansible** (el fichero `hosts`) con las IP del escenario. Lo explicamos en detalle más abajo.
* El fichero `output.tf` devuelve información de las dos máquinas. Como en el ejemplo 4, la IP que se asigna por DHCP (`ip1` de `ej5-server1`) la obtiene OpenTofu, y las estáticas (`ip2` de `ej5-server1` e `ip1` de `ej5-server2`) están escritas a mano.

En este ejemplo, `ej5-server1` (Debian) está conectado a la red `ej5-nat-dhcp` y a la red `ej5-muy-aislada`. `ej5-server2` (Ubuntu) se conecta únicamente a la red `ej5-muy-aislada` y tiene como puerta de enlace la dirección de `ej5-server1` (`10.0.0.1`). En este ejemplo no se activa en `ej5-server1` el reenvío de paquetes ni el NAT, así que `ej5-server2` no tiene salida al exterior.

### El inventario de Ansible generado por OpenTofu

La IP de `ej5-server1` en la red `ej5-nat-dhcp` la asigna el servidor DHCP de libvirt y puede cambiar cada vez que creamos el escenario. Si escribimos el inventario de Ansible a mano, tendríamos que corregirlo después de cada `tofu apply`. En lugar de eso, hacemos que **OpenTofu escriba el inventario** al crear el escenario. Intervienen tres piezas:

* **La plantilla `inventario.tftpl`**: es el inventario con huecos `${...}` donde irán las IP:

  ```
  [servidores]
  ej5-server1 ansible_host=${ip_server1} ansible_user=debian
  ej5-server2 ansible_host=${ip_server2} ansible_user=ubuntu ansible_ssh_common_args='-o ProxyJump=debian@${ip_server1}'
  ```

* **La función `templatefile`**: lee la plantilla, sustituye cada hueco por el valor que le pasamos y devuelve el texto resultante. En `inventario.tf`:

  ```hcl
  content = templatefile("${path.module}/inventario.tftpl", {
    ip_server1 = try(libvirt_domain.ej5-server1.network_interface[0].addresses[0], "")
    ip_server2 = "10.0.0.2" # estática: está en cloud-init/network-config2.yaml
  })
  ```

  `ip_server1` la obtiene OpenTofu del recurso `libvirt_domain`, igual que en `output.tf`; la conoce porque esa interfaz tiene `wait_for_lease = true` en `main.tf`. `ip_server2` es estática y, como en el ejemplo 4, está escrita a mano: si la cambias en `cloud-init/network-config2.yaml`, tienes que cambiarla también aquí.

* **El recurso `local_file`**: escribe ese texto en el fichero `hosts` del directorio del proyecto (`path.module`), en el anfitrión. Es un recurso más del escenario: se crea con `tofu apply` (después de `ej5-server1`, porque depende de su IP) y se borra con `tofu destroy`.

**¿Por qué `ProxyJump`?** `ej5-server2` solo está conectado a la red `ej5-muy-aislada`, que no tiene dirección en el anfitrión, así que desde el anfitrión no se llega a `10.0.0.2`. Solo se puede acceder a través de `ej5-server1`, que está en las dos redes. Con `-o ProxyJump=debian@<IP de ej5-server1>`, SSH (y Ansible, que lo usa por debajo) se conecta primero a `ej5-server1` y desde ahí abre un túnel hasta `ubuntu@10.0.0.2`. La autenticación de los dos saltos se hace con la clave del anfitrión.

**Un segundo provider.** `local_file` no pertenece al provider de libvirt, sino al provider **`hashicorp/local`**, que gestiona ficheros locales. Por eso está declarado en `provider.tf`, dentro de `required_providers`. `tofu init` es el que descarga los providers declarados: si inicializaste el directorio antes de añadirlo, `tofu plan` y `tofu apply` darán error, y tienes que volver a ejecutar `tofu init`.

Si añades una máquina al escenario, para que aparezca en el inventario tienes que añadir su línea en `inventario.tftpl` y, si usas un hueco nuevo, pasar su valor a `templatefile` en `inventario.tf`.

:::tip[¿Qué tienes que entregar?]
1. Crea el escenario del ejemplo 5. Entrega los comandos y la salida del acceso por SSH a `ej5-server1`, del ping desde ahí a `ej5-server2` (`10.0.0.2`) y del acceso por SSH de una máquina a otra (para ello, conéctate a `ej5-server1` con reenvío del agente: `ssh -A`).
2. Entrega el fichero `hosts` que ha generado OpenTofu y la salida de `ansible -i hosts all -m ping`.
3. Añade una tercera máquina conectada a la red `ej5-muy-aislada`, y añádela también al inventario. Entrega los ficheros modificados, y los comandos y la salida que comprueben que todo funciona correctamente (también `ansible -i hosts all -m ping`). Destruye el escenario.
:::
