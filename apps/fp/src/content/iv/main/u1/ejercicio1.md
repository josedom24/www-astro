---
title: "Creación de máquinas virtuales desde la línea de comandos"
---

En este ejercicio vas a instalar QEMU/KVM + libvirt, crear una máquina virtual Linux sin entorno gráfico y otra con un sistema Windows, y comprobar el funcionamiento, la red, el almacenamiento y la definición XML de cada una de ellas. Todas las operaciones se realizan desde la línea de comandos usando una **conexión privilegiada** a libvirt (`qemu:///system`).

## Preparación del entorno

1. Instala los paquetes necesarios para trabajar con QEMU/KVM y libvirt en tu equipo.
2. Añade tu usuario al grupo `libvirt` para poder usar `virsh` sin `sudo`.
3. Comprueba que el servicio `libvirtd` está activo y que puedes listar las máquinas con una conexión privilegiada.
4. Estudia la red `default` y el *pool* de almacenamiento `default` que libvirt ha creado por defecto. Anota: rango de direcciones IP de la red, modo de funcionamiento (NAT) y ruta del *pool* de almacenamiento.

## Ejercicio 1: Máquina virtual Linux sin entorno gráfico

Vas a crear una máquina virtual Debian/Ubuntu **sin entorno gráfico** usando `virt-install`.

1. Descarga la ISO de instalación netinst de Debian (o Ubuntu Server).
2. Crea la máquina con `virt-install` indicando: nombre, memoria (2 GB), vCPUs (2), un disco de 10 GB en formato `qcow2` dentro del *pool* `default`, la ISO como CDROM, la red `default`, sin entorno gráfico y consola serie.
3. Realiza la instalación desde la consola serie. Configura el sistema con un usuario que tenga `sudo` y el servicio `openssh-server` instalado.
4. Una vez instalada y arrancada, comprueba con `virsh` la información del dominio, las interfaces de red y los discos asociados.
5. Muestra la definición XML completa de la máquina e identifica los bloques de memoria, vCPUs, dispositivos de disco e interfaces, y el tipo de gráficos.
6. Averigua la dirección IP que ha tomado la máquina en la red `default` consultando las concesiones DHCP, y accede por SSH desde el host.
7. Practica las operaciones habituales de gestión: apagar, arrancar, suspender, reanudar, apagado forzoso y configuración de arranque automático.

## Ejercicio 2: Máquina virtual Windows

Vas a crear una máquina virtual con un sistema Windows (cualquier versión 10/11 de evaluación o Windows Server). En este caso sí necesitarás interfaz gráfica para la instalación.

1. Descarga la ISO de Windows.
2. Crea la máquina con `virt-install` ajustando los recursos (Windows requiere más RAM y disco): al menos 4 GB de memoria, 2 vCPUs y un disco de 40 GB. Usa la red `default` y gráficos SPICE.
3. Conéctate con `virt-viewer` o `virt-manager` para completar la instalación gráfica.
4. Una vez instalado Windows, habilita el **Escritorio remoto (RDP)** desde el sistema y abre el puerto 3389 en su firewall.
5. Averigua su IP y comprueba que puedes acceder por RDP desde el host.
6. Comprueba con `virsh` la misma información que en la máquina Linux y compara la definición XML de ambas: ¿qué dispositivos cambian (controladora de disco, tipo de gráficos, sonido, USB)?

## Ejercicio 3: Modificación de la definición XML

1. Apaga la máquina Linux y edita su definición XML:
    * Aumenta la memoria a 3 GB y los vCPUs a 3.
    * Añade un segundo disco de 5 GB. Para ello, primero crea el volumen en el *pool* `default` y después añade el bloque `<disk>` correspondiente en el XML del dominio.
2. Arranca la máquina y comprueba dentro de ella que ve la nueva memoria, los nuevos vCPUs y el nuevo disco.

## Ejercicio 4: Acceso desde el exterior

La red `default` es de tipo NAT, por lo que las máquinas no son accesibles directamente desde fuera del host. Vas a configurar un acceso desde otro equipo de tu red local:

1. En el host, crea una regla de **DNAT** que redirija un puerto del host (por ejemplo 2222) al puerto 22 de la máquina Linux. Asegúrate de que la regla persiste y de que el reenvío de paquetes está habilitado.
2. Desde otro equipo de tu red local accede por SSH a la máquina Linux usando la IP del host y el puerto redirigido.
3. Repite el procedimiento con la máquina Windows redirigiendo otro puerto del host al 3389 de la VM y comprobando el acceso por RDP desde otro equipo.

:::tip[¿Qué tienes que entregar?]
1. Información de la red `default` y del *pool* de almacenamiento `default`.
2. Captura de la instalación finalizada de la máquina Linux y de la máquina Windows.
3. Para cada máquina: información del dominio, interfaces, discos y la definición XML completa.
4. Captura del acceso por SSH a la máquina Linux y por RDP a la máquina Windows desde el host.
5. Pruebas del ejercicio 3: cambios de memoria/vCPUs y nuevo disco visibles dentro de la VM Linux.
6. Captura del acceso desde otro equipo de la red local (a través de las reglas DNAT) tanto a la VM Linux (SSH) como a la VM Windows (RDP).
:::
