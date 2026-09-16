---
title: "Tarea 5: Creación de escenarios con OpenTofu"
---

Seguimos trabajando con el repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi). Para cada ejemplo nos situamos en el directorio **opentofu/ejemploX** correspondiente.

## Ejemplo 4: Máquina virtual conectada a dos redes: una con DHCP y otra con direccionamiento estático

Nos situamos en el directorio `opentofu/ejemplo4`. En este ejemplo seguimos trabajando con redes. En esta ocasión vamos a aprender a **configurar una interfaz de red de forma estática**.

En el fichero `network.tf` se definen dos redes:

* `resource "libvirt_network" "ej4-nat-dhcp"`: una red NAT con DHCP en el rango `192.168.100.0/24`.
* `resource "libvirt_network" "ej4-aislada-static"`: una red **aislada sin DHCP** (`mode = "none"`) en el rango `192.168.130.0/24`. Estudia los parámetros que hemos indicado.

Recuerda: el hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Creamos el fichero `cloud-init/network-config1.yaml` donde guardaremos la configuración netplan de la máquina. En este ejemplo puedes observar cómo se ha configurado `ens4` de forma estática con la dirección `192.168.130.10/24`. Si fuera necesario podríamos indicar la puerta de enlace, el servidor DNS o cualquier otra configuración de red.
* Añadimos este fichero en la imagen ISO junto al fichero `cloud-init/user-data1.yaml` con el parámetro `network_config` del recurso `libvirt_cloudinit_disk "ej4-server1-cloudinit"` en el fichero `main.tf`.

:::tip[¿Qué tienes que entregar?]
1. Configura el escenario, crea la máquina virtual con debian13 y comprueba que las dos interfaces están configuradas. Entrega una captura de pantalla haciendo ping a la dirección estática. ¿Funciona? Razona la respuesta. Destruye el escenario.
2. Crea una nueva **red muy aislada** (`mode = "none"`) y conecta la máquina a ella con una dirección en `172.16.0.0/16`. Entrega los ficheros modificados y una captura haciendo ping a esa dirección. ¿Funciona? Razona la respuesta. Destruye el escenario.
:::

## Ejemplo 5: Dos máquinas virtuales conectadas entre sí

Nos situamos en el directorio `opentofu/ejemplo5`. En este ejemplo vamos a comenzar a crear escenarios, es decir, a crear varias máquinas interconectadas. En este ejemplo concreto tenemos dos máquinas que están conectadas entre sí. Para conseguirlo tenemos los siguientes ficheros:

* `main.tf`: contiene la definición de las dos máquinas virtuales (`ej5-server1` y `ej5-server2`) en un único fichero.
* En el directorio `cloud-init` encontramos los ficheros de configuración para cada máquina:
  * `user-data1.yaml`: configura `ej5-server1` (Debian, usuario `debian`).
  * `user-data2.yaml`: configura `ej5-server2` (Ubuntu, usuario `ubuntu`).
  * `network-config1.yaml`: configura las interfaces de red de `ej5-server1` (`ens3` con DHCP, `ens4` con IP estática `10.0.0.1/24`).
  * `network-config2.yaml`: configura la interfaz de red de `ej5-server2` (`ens3` con IP estática `10.0.0.2/24` y gateway `10.0.0.1`).
* `network.tf`: define dos redes: `ej5-nat-dhcp` (NAT con DHCP) y `ej5-muy-aislada` (`mode = "none"`, sin rango de direcciones).
* `variables.tf`: define tres variables: `libvirt_pool_name`, `base_image_debian` (`debian13-base.qcow2`) y `base_image_ubuntu` (`ubuntu2404-base.qcow2`).
* El fichero `output.tf` devuelve información de las dos máquinas.

En este ejemplo, `ej5-server1` (Debian) está conectado a la red `nat-dhcp` y a la red `muy-aislada` (actúa como gateway). `ej5-server2` (Ubuntu) se conecta únicamente a la red `muy-aislada`.

:::tip[¿Qué tienes que entregar?]
1. Crea el escenario del ejemplo 5. Entrega una captura de pantalla accediendo por SSH a `ej5-server1`, haciendo ping desde ahí a `ej5-server2` (`10.0.0.2`) y accediendo por SSH de una máquina a otra.
2. Añade una tercera máquina conectada a la red `muy-aislada`. Entrega los ficheros modificados y una captura donde se compruebe que todo funciona correctamente. Destruye el escenario.
:::
