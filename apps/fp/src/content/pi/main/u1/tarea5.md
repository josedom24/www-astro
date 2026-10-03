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

Como el dominio tiene `qemu_agent = true`, OpenTofu pregunta las direcciones al agente `qemu-guest-agent`, así que en la información de `output.tf` aparece también la dirección estática. Sin el agente, OpenTofu solo conocería las direcciones que asigna el servidor DHCP. Si al terminar el `apply` sale «No disponible», es que el agente aún no estaba funcionando: espera un poco y ejecuta `tofu refresh` y `tofu output`.

:::tip[¿Qué tienes que entregar?]
1. Configura el escenario, crea la máquina virtual con debian13 y comprueba que las dos interfaces están configuradas. Entrega el comando y la salida del ping desde el anfitrión a la dirección estática, y la salida de `ip a` en el anfitrión donde se vea el bridge de la red `ej4-aislada-static`. ¿Funciona el ping? **Explícalo con lo que ves en el anfitrión.** Destruye el escenario.
2. Crea una nueva **red muy aislada** (`mode = "none"`, sin `addresses`) y conecta la máquina a ella con una dirección en `172.16.0.0/16`. Entrega los ficheros modificados, el comando y la salida del ping desde el anfitrión a esa dirección, y la salida de `ip a` en el anfitrión donde se vea el bridge de esa red. ¿Funciona el ping? **Explícalo con lo que ves en el anfitrión.** Destruye el escenario.
:::

## Ejemplo 5: Dos máquinas virtuales conectadas entre sí

Nos situamos en el directorio `opentofu/ejemplo5`. En este ejemplo vamos a comenzar a crear escenarios, es decir, a crear varias máquinas interconectadas. En este ejemplo concreto tenemos dos máquinas que están conectadas entre sí. Para conseguirlo tenemos los siguientes ficheros:

* `main.tf`: contiene la definición de las dos máquinas virtuales (`ej5-server1` y `ej5-server2`) en un único fichero.
* En el directorio `cloud-init` encontramos los ficheros de configuración para cada máquina:
  * `user-data1.yaml`: configura `ej5-server1` (Debian, usuario `debian`).
  * `user-data2.yaml`: configura `ej5-server2` (Ubuntu, usuario `ubuntu`). La instalación de paquetes y la actualización están comentadas: `ej5-server2` no tiene salida al exterior y cloud-init fallaría al usar apt.
  * `network-config1.yaml`: configura las interfaces de red de `ej5-server1` (`ens3` con DHCP, `ens4` con IP estática `10.0.0.1/24`).
  * `network-config2.yaml`: configura la interfaz de red de `ej5-server2` (`ens3` con IP estática `10.0.0.2/24` y ruta por defecto por `10.0.0.1`, con `routes`).
* `network.tf`: define dos redes: `ej5-nat-dhcp` (NAT con DHCP) y `ej5-muy-aislada` (`mode = "none"`, sin rango de direcciones).
* `variables.tf`: define tres variables: `libvirt_pool_name`, `base_image_debian` (`debian13-base.qcow2`) y `base_image_ubuntu` (`ubuntu2604-base.qcow2`).
* `inventario.tf` y `inventario.tftpl`: generan el **inventario de Ansible**. El recurso `local_file` escribe el fichero `hosts` en el directorio del proyecto, y `templatefile` rellena la plantilla `inventario.tftpl` con las IP del escenario. Así, cada vez que se crea el escenario, el inventario sale con las IP correctas. `ej5-server2` solo es accesible a través de `ej5-server1`, y por eso en el inventario se conecta con `ProxyJump`. Este fichero usa un segundo provider, `hashicorp/local`, declarado en `provider.tf`: después de añadirlo hay que volver a ejecutar `tofu init`.
* El fichero `output.tf` devuelve información de las dos máquinas. Las IP de `ej5-server1` se obtienen del agente, como en el ejemplo 4. La de `ej5-server2` aparece como «No disponible»: sin salida al exterior no puede instalar `qemu-guest-agent`, y por eso su dominio no usa `qemu_agent`.

En este ejemplo, `ej5-server1` (Debian) está conectado a la red `ej5-nat-dhcp` y a la red `ej5-muy-aislada`. `ej5-server2` (Ubuntu) se conecta únicamente a la red `ej5-muy-aislada` y tiene como puerta de enlace la dirección de `ej5-server1` (`10.0.0.1`). En este ejemplo no se activa en `ej5-server1` el reenvío de paquetes ni el NAT, así que `ej5-server2` no tiene salida al exterior.

:::tip[¿Qué tienes que entregar?]
1. Crea el escenario del ejemplo 5. Entrega los comandos y la salida del acceso por SSH a `ej5-server1`, del ping desde ahí a `ej5-server2` (`10.0.0.2`) y del acceso por SSH de una máquina a otra (para ello, conéctate a `ej5-server1` con reenvío del agente: `ssh -A`).
2. Entrega el fichero `hosts` que ha generado OpenTofu y la salida de `ansible -i hosts all -m ping`.
3. Añade una tercera máquina conectada a la red `ej5-muy-aislada`, y añádela también al inventario. Entrega los ficheros modificados, y los comandos y la salida que comprueben que todo funciona correctamente (también `ansible -i hosts all -m ping`). Destruye el escenario.
:::
