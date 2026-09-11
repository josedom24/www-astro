---
title: "Práctica optativa 1: MV Windows con drivers VirtIO"
---

Sobre el escenario ya montado en la [Práctica: QEMU/KVM + libvirt](practica/), vamos a añadir una máquina virtual Windows y comprobar el problema de los dispositivos paravirtualizados VirtIO.

Esta práctica es **optativa**: solo puede mejorar tu nota, nunca perjudicarla.

## Instalación de la MV Windows

* Añade al escenario una nueva máquina virtual `windows` con una versión de Windows (10, 11 o Server) instalada mediante `virt-install`, usando disco y tarjeta de red de tipo `virtio` para mejor rendimiento.
* Descarga la ISO de instalación de Windows y la ISO de drivers del proyecto **virtio-win**.
* Durante la instalación, cuando el instalador no detecte ningún disco donde instalar el sistema, añade el segundo CD-ROM con los drivers y usa la opción "Cargar controlador" para que reconozca el disco `virtio`.
* Conecta la máquina a la red `default` para que tenga acceso a Internet a través de la NAT que ya proporciona libvirt.

## Comprobación

* Conéctate a la máquina Windows por RDP (o por consola gráfica si no tienes RDP disponible) una vez instalada.
* Desde dentro de Windows, comprueba que tiene conectividad con el resto del escenario: por ejemplo, haciendo ping al `router` o accediendo por navegador a la página que sirve el `servidorWeb`.

:::tip[Entrega]
1. Salida de `virsh list --all` mostrando la máquina `windows` activa junto al resto del escenario.
2. Captura del escritorio de Windows (por RDP o consola gráfica).
3. Captura mostrando la comprobación de conectividad con el resto del escenario (ping o acceso web) desde dentro de Windows.
4. Explica qué problema ocurre si se usa `bus=virtio` sin proporcionar los drivers durante la instalación, y cómo se soluciona.
:::

## Vídeo de demostración

Además de las capturas, graba un **vídeo de 2 a 4 minutos** mostrando la MV Windows funcionando en directo, con **narración en voz** explicando qué está pasando y por qué.

:::tip[Qué debe mostrar el vídeo]
1. Conexión en directo a la MV Windows (por RDP o consola gráfica).
2. Una comprobación de conectividad en directo desde dentro de Windows (ping al `router`, o acceso web al `servidorWeb`).
3. Una explicación breve de qué son los drivers VirtIO y por qué han sido necesarios para poder instalar el sistema.
:::

Se valorará que la explicación hablada demuestre que entiendes por qué Windows necesita esos drivers, no solo que la máquina funcione en pantalla. Sube el vídeo a YouTube (puede ser como **oculto** / **no listado**) y añade la URL en la incidencia de Redmine junto con el resto de la entrega.
