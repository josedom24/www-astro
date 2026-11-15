---
title: "Ejercicio 3: Volúmenes"
---

En este ejercicio vas a trabajar con el almacenamiento persistente de OpenStack: crear volúmenes, asociarlos a instancias, crear instancias cuyo disco es un volumen, y hacer instantáneas de volúmenes.

## Almacenamiento efímero y persistente

Las instancias que hemos creado hasta ahora tienen un disco cuyo tamaño lo indica el sabor. Ese disco es **efímero**: cuando se elimina la instancia, el disco se elimina con ella.

Un **volumen** es un disco independiente de las instancias:

* Es un **dispositivo de bloques** que se puede asociar a una instancia y desasociar cuando queramos.
* Es **persistente**: sigue existiendo aunque se elimine la instancia a la que estaba asociado.
* El componente de OpenStack que gestiona los volúmenes se llama **Cinder**.

Los volúmenes se usan de dos formas: como **disco adicional** para guardar datos, o como **disco raíz** de la instancia, para que el sistema completo sobreviva a la instancia.

## Gestión de volúmenes

Los volúmenes se gestionan con los comandos `openstack volume`:

* Crear un volumen de 1 GB: `openstack volume create --size 1 mi_disco1`
* Listar los volúmenes: `openstack volume list`
* Asociar el volumen a una instancia: `openstack server add volume instancia_prueba mi_disco1`
* Desasociarlo: `openstack server remove volume instancia_prueba mi_disco1`
* Eliminarlo: `openstack volume delete mi_disco1`

Dentro de la instancia el volumen aparece como un disco nuevo (compruébalo con `lsblk`), sin particiones ni sistema de ficheros.

:::caution[Ejercicio]
1. Crea una instancia y un volumen de 1 GB.
2. Asocia el volumen a la instancia. Dentro de la instancia, formatéalo, móntalo y crea algún fichero en él.
3. Intenta eliminar el volumen. ¿Puedes hacerlo? ¿Por qué?
4. Desmonta el volumen dentro de la instancia y desasócialo. No lo elimines: lo usaremos más adelante.
:::

## Instancias con el disco raíz en un volumen

Podemos crear un volumen **arrancable** que contenga una imagen:

```
openstack volume create --bootable --size 8 --image "Debian 13 Trixie" disco_debian
```

Y crear una instancia cuyo disco raíz sea ese volumen. En lugar de la imagen se indica el volumen:

```
openstack server create --flavor vol.mini \
    --volume disco_debian \
    --security-group default \
    --key-name jdmr \
    --network "Red de josedom" \
    instancia_volumen
```

Los sabores cuyo nombre empieza por `vol` tienen 0 GB de disco, porque el disco lo aporta el volumen.

Al eliminar la instancia el volumen no se elimina, de forma que podemos crear otra instancia a partir de él y recuperar el sistema tal como estaba.

:::caution[Ejercicio]
1. Crea un volumen arrancable de 10 GB a partir de una imagen.
2. Crea una instancia cuyo disco raíz sea ese volumen, con un sabor de tipo `vol`.
3. Accede a la instancia e instala algún servicio.
4. Elimina la instancia y crea otra nueva a partir del mismo volumen.
5. Comprueba que el servicio que instalaste sigue ahí.
:::

## Instantáneas de volúmenes

Una instantánea guarda el estado de un volumen en un momento dado. A partir de ella se pueden crear volúmenes nuevos. No es recomendable hacerla con el volumen asociado a una instancia, porque puede quedar corrupta.

* Crear la instantánea: `openstack volume snapshot create --volume mi_disco1 copia_mi_disco1`
* Listar las instantáneas: `openstack volume snapshot list`
* Crear un volumen a partir de la instantánea: `openstack volume create --snapshot copia_mi_disco1 mi_disco2`
* Eliminar la instantánea: `openstack volume snapshot delete copia_mi_disco1`

Un volumen que tiene instantáneas no se puede eliminar: hay que eliminar primero las instantáneas.

```
$ openstack volume delete mi_disco1
Invalid volume: Volume still has 1 dependent snapshots. (HTTP 400)
```

:::caution[Ejercicio]
1. Crea una instantánea del volumen del primer apartado (el que tiene el fichero).
2. Crea un volumen nuevo a partir de la instantánea.
3. Asocia el volumen nuevo a una instancia, móntalo y comprueba que el fichero está.
:::

## Ampliar un volumen

Para cambiar el tamaño de un volumen, este tiene que estar **desasociado** de la instancia:

```
openstack server remove volume instancia_prueba mi_disco2
openstack volume set --size 2 mi_disco2
openstack server add volume instancia_prueba mi_disco2
```

El volumen crece, pero el sistema de ficheros que contiene no: hay que redimensionarlo dentro de la instancia (por ejemplo, con `resize2fs` si es ext4).

:::caution[Ejercicio]
1. Desmonta y desasocia el volumen del apartado anterior, amplíalo a 2 GB y vuelve a asociarlo a la instancia.
2. Redimensiona el sistema de ficheros, móntalo y comprueba el nuevo tamaño con `df -h`.
3. Elimina las instancias, las instantáneas y los volúmenes que has creado.
:::

:::tip[Entrega]
Lo que tienes que entregar de este ejercicio en la [Tarea 3.1](../tarea1/):

1. Las instrucciones para crear el volumen arrancable y la instancia sobre él.
2. Una captura que demuestre que, después de eliminar la instancia y crear otra con el mismo volumen, el servicio que instalaste sigue ahí.
3. Las instrucciones para crear la instantánea del volumen y el volumen nuevo, y una captura donde se vea el fichero en el volumen nuevo.
4. Responde: ¿qué diferencia hay entre el disco de una instancia creada con un sabor `m1` y el de una creada sobre un volumen cuando eliminamos la instancia?
:::
