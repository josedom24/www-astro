---
title: "Optativa 1.3: MV con pool logical (LVM)"
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

## Vídeo de demostración

Además de las capturas, graba un **vídeo de 2 a 4 minutos** mostrando la MV creada sobre el *pool* `logical` funcionando en directo, con **narración en voz** explicando qué está pasando y por qué.

:::tip[Qué debe mostrar el vídeo]
1. El *pool* `logical` y el volumen creado dentro de él (`virsh pool-list`, `virsh vol-list`).
2. La MV arrancada, mostrando en su definición XML que el disco es ese volumen lógico (no un fichero).
3. Una explicación breve de la diferencia entre un *pool* `dir` y uno `logical`, y qué ventaja de rendimiento ofrece este último.
:::

Se valorará que la explicación hablada demuestre que entiendes qué diferencia hay entre almacenar un disco en un fichero y en un volumen lógico, no solo que la máquina arranque en pantalla. Sube el vídeo a YouTube (puede ser como **oculto** / **no listado**) y añade la URL en la incidencia de Redmine junto con el resto de la entrega.
