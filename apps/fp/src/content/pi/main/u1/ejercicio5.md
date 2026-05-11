---
title: "Ejercicio 5: Creación de escenarios con OpenTofu"
---

Seguimos trabajando con el repositorio de ejemplos: [https://github.com/josedom24/opentofu-libvirt/](https://github.com/josedom24/opentofu-libvirt/).

## Ejemplo 4: Máquina virtual conectada a dos redes: una con DHCP y otra con direccionamiento estático

En este ejemplo seguimos trabajando con redes. En esta ocasión vamos a aprender a **configurar una interfaz de red de forma estática**.

En el fichero `networks.tf`:

* Se crea una red NAT con DHCP con el recurso `resource "libvirt_network" "nat_dhcp"`.
* Se crea una red **aislada sin DHCP**, con el recurso `resource "libvirt_network" "aislada-static"`. Estudia los parámetros que hemos indicado.

Recuerda: el hecho de que conectemos una máquina virtual a dos redes **no significa que netplan configure las dos interfaces**. Tenemos que configurarlo nosotros, para ello:

* Creamos el fichero `cloud-init/server1/network-config.yaml` donde guardaremos la configuración netplan de la máquina. En este ejemplo puedes observar cómo se ha configurado de forma estática. Si fuera necesario podríamos indicar la puerta de enlace, el servidor DNS o cualquier otra configuración de red que necesitemos.
* Recuerda que añadimos este fichero en la imagen ISO junto al fichero `cloud-init/server1/user-data.yaml` con el parámetro `network_config` del recurso `resource "libvirt_cloudinit_disk" "server1-cloudinit"` en el fichero `main.tf`.

**¿Qué tienes que realizar?**

1. Configura tu escenario de forma adecuada para crear una máquina virtual con debian13. Ejecuta la configuración del ejemplo 4 y comprueba que efectivamente las dos interfaces están configuradas. ¿Puedes hacer ping a la dirección que hemos configurado de forma estática? Razona la respuesta. Destruye el escenario.
2. Crea una nueva **red muy aislada** y cambia la configuración para conectar la máquina virtual a esta red. Configúrala con una dirección en el direccionamiento `172.16.0.0/16`. ¿Puedes hacer ping a esta dirección que hemos configurado? Razona la respuesta. Destruye el escenario.

## Ejemplo 5: Dos máquinas virtuales conectadas entre sí

En este ejemplo vamos a comenzar a crear escenarios, es decir, a crear varias máquinas interconectadas. En este ejemplo concreto tenemos dos máquinas que están conectadas entre sí. Para conseguirlo tenemos los siguientes ficheros:

* `main1.tf` y `main2.tf`: en cada uno de estos ficheros está la definición de una máquina.
* Dentro del directorio `cloud-init` tenemos dos directorios, para guardar el `user-data.yaml` y el `network-config.yaml` para configurar cada una de las máquinas.
* El fichero `output.tf` se ha modificado para que devuelva información de cada máquina.

En este ejemplo, el primer servidor está conectado a una red NAT y una red muy aislada. El segundo servidor se conecta sólo a la red muy aislada.

**Limitación** de esta solución para crear escenarios:

* Es **muy repetitiva**: si queremos crear un escenario con 3 máquinas necesitamos crear 3 ficheros `mainX.tf`, 3 directorios `cloud-init/serverX` y modificar el fichero `output.tf` para mostrar información de las 3 máquinas.

:::tip[¿Qué tienes que entregar?]
1. Configura tu escenario de forma adecuada para crear las máquinas virtuales del ejemplo 5. Accede a la primera por ssh y comprueba que puedes hacer ping a la segunda. Accede de forma adecuada por ssh a la primera máquina para desde ella acceder a la segunda. Destruye el escenario.
2. Modifica lo necesario para crear otra máquina conectada a la red muy aislada. Comprueba que todo funciona de manera adecuada. Destruye el escenario.
:::
