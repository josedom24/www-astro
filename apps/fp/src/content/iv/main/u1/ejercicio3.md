---
title: "Gestión de redes en QEMU/KVM + libvirt"
---

En este ejercicio vas a crear y gestionar distintos tipos de redes virtuales con QEMU/KVM + libvirt, conectar máquinas virtuales a ellas y configurar un puente externo para dar acceso a la red física. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Crear redes virtuales

Crea los siguientes dos tipos de redes usando `virsh`:

- Una red privada de tipo **NAT**:
    - Nombre: **red-nat**
    - Nombre del bridge: `virbr1`
    - Direccionamiento: `192.168.125.0/24`
    - Dirección del host (puerta de enlace): `192.168.125.1`
    - Rango DHCP: `192.168.125.2 – 192.168.125.100`
- Una red privada **aislada** sin DHCP:
    - Nombre: **red-aislada**
    - Nombre del bridge: `virbr2`
    - Direccionamiento: `192.168.126.0/24`
    - Dirección del host (puerta de enlace): `192.168.126.1`

Activa las dos redes y configúralas para que se inicien de forma automática. Si hay conflicto con el nombre del bridge o el direccionamiento, modifícalos.

## Ejercicio 2: Cambiar la red de una máquina virtual

1. Desconecta una máquina que tengas conectada a la red `default` y conéctala a `red-nat`. ¿Puedes hacer esta modificación con la máquina encendida?
2. Comprueba la nueva dirección IP que ha tomado la máquina y su puerta de enlace.

## Ejercicio 3: Crear una máquina en una red específica

Sin realizar la instalación, indica cómo sería la instrucción `virt-install` para crear una nueva máquina virtual conectada a la red `red-nat`.

## Ejercicio 4: Red aislada

1. Conecta la máquina a la `red-aislada`.
2. ¿Qué configuración de red tienes que hacer dentro de la máquina para que tenga direccionamiento? Realiza la configuración.
3. ¿Puedes hacer `ping` a `192.168.126.1`? Razona la respuesta.

:::tip[Comprueba que...]
1. Sabes definir con `virsh` una red NAT y una red aislada, y activarlas con arranque automático.
2. Sabes desconectar una MV de una red y conectarla a otra, y explicar si se puede hacer con la máquina encendida.
3. Sabes indicar en `virt-install` la red a la que se conecta una MV.
4. Sabes configurar el direccionamiento dentro de la MV cuando la red no tiene DHCP, y explicar por qué no hay conectividad con el exterior en una red aislada.
:::
