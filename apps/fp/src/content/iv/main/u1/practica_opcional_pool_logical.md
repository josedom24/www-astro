---
title: "Optativa 1.2: MV con pool logical (LVM)"
---

Sobre el mismo host donde tienes montado el escenario de la [Práctica: QEMU/KVM + libvirt](practica/) (o dentro de una MV, si no tienes espacio libre en el host), vamos a crear el disco de una máquina virtual directamente sobre un volumen lógico LVM, en lugar de sobre un fichero de imagen.

Esta práctica es **optativa**: solo puede mejorar tu nota, nunca perjudicarla.

## Pool de tipo `logical`

* Crea un grupo de volúmenes LVM solo para este *pool*, sobre un disco o una partición libre del host. No uses el grupo de volúmenes del sistema. Si ya tienes un grupo de volúmenes libre, puedes reutilizarlo.
* Si no tienes en el host ninguna partición ni ningún grupo de volúmenes libres, haz la práctica dentro de una máquina virtual:
	* Crea una MV con QEMU/KVM + libvirt con discos extra suficientes para crear los volúmenes físicos.
	* Activa la **virtualización anidada**: la MV tiene que tener acceso a las extensiones de virtualización del procesador (por ejemplo, con `--cpu host-passthrough` en `virt-install`).
	* Instala QEMU/KVM + libvirt dentro de esa MV y haz en ella el resto de la práctica: el *pool*, el volumen y la nueva máquina virtual.
* Define con `virsh` un *pool* de almacenamiento de tipo `logical` sobre ese grupo de volúmenes, actívalo y configúralo para que arranque automáticamente.
* Crea un volumen dentro de ese *pool* de al menos 5 GB.

## Instalación de la MV

* Instala una nueva máquina virtual Linux con `virt-install` usando ese volumen lógico como disco principal (sin pasar por un fichero `qcow2`/`raw`).
* Comprueba en la definición XML de la máquina que el disco apunta al volumen del *pool* `logical`, no a un fichero.

## Comprobación y comparación

* Responde: ¿qué diferencia hay entre usar un *pool* `dir` (como `default`) y uno `logical` como almacenamiento de discos para máquinas virtuales? ¿Qué ventaja tiene trabajar a nivel de bloque y qué pierdes (formato qcow2, snapshots)?

:::tip[Entrega]
1. Salida de `virsh pool-list --all` y `virsh pool-dumpxml` del *pool* `logical` creado.
2. Salida de `virsh vol-list` mostrando el volumen creado en ese *pool*.
3. Fragmento de la definición XML de la máquina virtual donde se vea que el disco es ese volumen lógico.
4. Respuesta a la pregunta sobre la diferencia entre pool `dir` y `logical`.
:::

## Vídeo de demostración

Además de las capturas, graba un **vídeo de 2 a 4 minutos** mostrando la MV creada sobre el *pool* `logical` funcionando en directo, con **narración en voz** explicando qué está pasando y por qué.

:::tip[Qué debe mostrar el vídeo]
1. El *pool* `logical` y el volumen creado dentro de él (`virsh pool-list`, `virsh vol-list`).
2. La MV arrancada, mostrando en su definición XML que el disco es ese volumen lógico (no un fichero).
3. Una explicación breve de la diferencia entre un *pool* `dir` y uno `logical`: qué ventaja tiene trabajar a nivel de bloque y qué se pierde (formato qcow2, snapshots).
:::

Se valorará que la explicación hablada demuestre que entiendes qué diferencia hay entre almacenar un disco en un fichero y en un volumen lógico, no solo que la máquina arranque en pantalla. Sube el vídeo a YouTube (puede ser como **oculto** / **no listado**) y añade la URL en la incidencia de Redmine junto con el resto de la entrega.
