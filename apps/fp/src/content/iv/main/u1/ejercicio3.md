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

## Ejercicio 5: Puente externo y conexión a la red física

1. Crea un puente externo llamado **br0** en el host y crea una red de tipo puente con libvirt asociada a él.
2. Desconecta la máquina de `red-nat` y conéctala a la red puente. Puedes indicar la red de libvirt o el bridge directamente.
3. Comprueba que la máquina obtiene una dirección IP del rango de tu red local (`172.22.0.0/16`) a través del servidor DHCP del instituto.
4. Comprueba que puedes acceder a la máquina virtual desde otro equipo conectado a la misma red física.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: ficheros XML usados para definir las redes. Salida del comando `virsh` que lista las redes creadas.
2. Del ejercicio 2: instrucción para desconectar la red y la instrucción para conectarla a `red-nat`. Comprobación del nuevo direccionamiento (IP y puerta de enlace). Responde si es posible hacerlo con la máquina encendida.
3. Del ejercicio 3: la instrucción `virt-install` que usarías.
4. Del ejercicio 4: instrucción para conectar la máquina a `red-aislada`. Comprobación de la nueva configuración de red. Responde a las preguntas sobre el `ping`.
5. Del ejercicio 5: dos instrucciones para conectar la máquina a la red puente (una usando la red de libvirt y otra usando el bridge directamente). Comprobación del nuevo direccionamiento (IP, puerta de enlace, DNS). Comprobación del acceso a la máquina desde otro equipo de la red local.
:::
