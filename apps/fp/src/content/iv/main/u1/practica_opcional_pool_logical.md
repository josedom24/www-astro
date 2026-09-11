---
title: "Práctica optativa 3: MV con pool logical (LVM)"
---

Sobre el mismo host donde tienes montado el escenario de la [Práctica: QEMU/KVM + libvirt](practica/), vamos a crear el disco de una máquina virtual directamente sobre un volumen lógico LVM, en lugar de sobre un fichero de imagen.

Esta práctica es **optativa**: solo puede mejorar tu nota, nunca perjudicarla.

## Pool de tipo `logical`

* Crea (o reutiliza si ya tienes) un grupo de volúmenes LVM libre en tu host.
* Define con `virsh` un *pool* de almacenamiento de tipo `logical` sobre ese grupo de volúmenes, actívalo y configúralo para que arranque automáticamente.
* Crea un volumen dentro de ese *pool* de al menos 10 GB.

## Instalación de la MV

* Instala una nueva máquina virtual Linux con `virt-install` usando ese volumen lógico como disco principal (sin pasar por un fichero `qcow2`/`raw`).
* Comprueba en la definición XML de la máquina que el disco apunta al volumen del *pool* `logical`, no a un fichero.

## Comprobación y comparación

* Responde: ¿qué diferencia hay entre usar un *pool* `dir` (como `default`) y uno `logical` como almacenamiento de discos para máquinas virtuales? ¿Qué ventaja de rendimiento ofrece el segundo, y qué facilidad pierdes (por ejemplo, al copiar o mover el disco)?

:::tip[Entrega]
1. Salida de `virsh pool-list --all` y `virsh pool-dumpxml` del *pool* `logical` creado.
2. Salida de `virsh vol-list` mostrando el volumen creado en ese *pool*.
3. Fragmento de la definición XML de la máquina virtual donde se vea que el disco es ese volumen lógico.
4. Respuesta a la pregunta sobre la diferencia entre pool `dir` y `logical`.
:::
