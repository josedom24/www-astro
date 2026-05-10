---
title: "Almacenamiento, clonación e instantáneas"
---

En este ejercicio vas a gestionar el almacenamiento en QEMU/KVM + libvirt, trabajar con volúmenes en el *pool* `default`, comparar formatos de imagen de disco, añadir y redimensionar discos en máquinas virtuales, clonar máquinas y desplegar nuevas instancias con imágenes cloud. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Pools de almacenamiento

1. Muestra con `virsh` todos los *pools* de almacenamiento definidos en tu sistema. ¿Cuántos hay? ¿De qué tipo es cada uno?
2. Para cada *pool*, muestra su información detallada: tipo, estado, ruta o recurso al que apunta y capacidad disponible.
3. Muestra los volúmenes que contiene cada *pool*. ¿Qué tipo de volúmenes almacena el *pool* `default`? ¿Y el resto de *pools*?
4. Responde: ¿qué diferencia hay entre un *pool* de tipo `dir` y uno de tipo `logical`? ¿Qué ventaja ofrece cada uno como almacenamiento de discos para máquinas virtuales?

:::note[Ejercicio optativo]
En lugar de ficheros de imagen (tipo `dir`), es posible usar volúmenes lógicos LVM o particiones de disco directamente como discos de máquinas virtuales. Crea un *pool* de tipo `logical` o `disk` y arranca una máquina virtual que use un volumen de ese *pool* como disco principal.
:::

## Ejercicio 2: Gestión de volúmenes en el pool default

1. Lista los volúmenes existentes en el *pool* `default` con `virsh`.
2. Crea un nuevo volumen llamado **disco1.qcow2** de 1 GB en el *pool* `default` usando `virsh`.
3. Crea un segundo volumen llamado **disco2.qcow2** de 2 GB usando `qemu-img` directamente en el directorio del *pool*. Refresca el *pool* para que libvirt lo detecte.
4. Lista de nuevo los volúmenes del *pool* `default` y comprueba que aparecen los dos nuevos volúmenes.

## Ejercicio 3: Diferencia entre qcow2 e img (raw)

1. Crea un volumen **nuevo_disco.img** de tipo raw y 10 GB en el *pool* `default`.
2. Lista los volúmenes del *pool* `default` mostrando la capacidad declarada y el tamaño real que ocupa cada uno en disco.
3. Compara el espacio real que ocupa **nuevo_disco.img** con el que ocupa **disco1.qcow2**. Responde: ¿por qué el fichero raw ocupa todo el espacio desde el principio y el qcow2 no? ¿Qué ventajas e inconvenientes tiene cada formato?

## Ejercicio 4: Añadir y redimensionar discos en máquinas virtuales

1. Añade **disco1** y **disco2** a tu máquina Linux usando `virsh`. Comprueba con `virsh` que los discos están conectados a la máquina.
2. Dentro de la máquina, formatea cada disco y móntalo de forma persistente.
3. Redimensiona **disco1** a 2 GB usando `virsh`. Redimensiona **disco2** a 3 GB usando `qemu-img` (con la máquina apagada).
4. Dentro de la máquina, amplía el sistema de ficheros de cada disco para aprovechar el nuevo espacio.

## Ejercicio 5: Instalación de una MV usando un volumen creado

1. Crea un nuevo volumen **mv-debian.qcow2** de 10 GB en el *pool* `default`.
2. Realiza la instalación de una máquina virtual con `virt-install` usando ese volumen como disco principal.
3. Una vez instalada, muestra el fragmento de la definición XML de la máquina donde se comprueba qué volumen está usando como disco.

## Ejercicio 6: Clonación completa

1. Clona tu máquina Linux con `virt-clone`. Llama a la nueva máquina **maquina-clonada**.
2. Arranca la máquina clonada. Responde: ¿qué problemas tiene respecto a la original? ¿Qué ocurre con el *hostname*? ¿Y con las claves SSH del servidor? ¿Por qué es problemático que dos máquinas compartan la misma identidad en la red?
3. Realiza los cambios necesarios en la máquina clonada para que tenga una identidad propia: cambia el *hostname* y regenera las claves SSH del servidor.
4. Responde: ¿qué solución existe para no tener que hacer estos cambios a mano cada vez que se clona? ¿Qué es una plantilla?

## Ejercicio 7: Despliegue con imágenes cloud y cloud-init

Aunque podemos crear plantillas manualmente (puedes aprender cómo en el curso de referencia), vamos a usar un enfoque más eficiente: las **imágenes cloud** junto con **cloud-init**, que es el estándar en entornos cloud para personalizar máquinas en el primer arranque.

1. Descarga una imagen cloud de Ubuntu 24.04 y cópiala al directorio del *pool* `default`.
2. Crea un fichero `cloud.yaml` con configuración `cloud-init` que establezca el nombre de la máquina, actualice los paquetes y configure las contraseñas de los usuarios `root` y `ubuntu`.
3. Crea una clonación enlazada a partir de la imagen cloud descargada y amplía el disco a 20 GB.
4. Crea la máquina virtual con `virt-install` usando la clonación enlazada como disco y el fichero `cloud.yaml` como configuración cloud-init.
5. Conéctate a la máquina por consola serie. Comprueba que el nombre de la máquina y las contraseñas son los que has configurado.

## Ejercicio 8: Instantáneas

1. En cualquiera de tus máquinas virtuales, crea un directorio de prueba dentro de la máquina.
2. Crea una instantánea de la máquina con `virsh` y lista las instantáneas disponibles.
3. Borra el directorio que creaste en el paso 1.
4. Recupera la instantánea para volver al estado anterior y comprueba que el directorio ha reaparecido.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: salida de los comandos que muestran los *pools* y sus volúmenes. Responde a las preguntas sobre tipos de *pool* y diferencias entre ellos.
2. Del ejercicio 2: instrucciones usadas para crear `disco1.qcow2` con `virsh` y `disco2.qcow2` con `qemu-img`. Salida que muestra los volúmenes del *pool* `default` con los dos nuevos volúmenes.
3. Del ejercicio 3: salida que muestra la capacidad y el tamaño real de cada volumen. Responde a las preguntas sobre las diferencias entre qcow2 y raw.
4. Del ejercicio 4: instrucción usada para añadir `disco1` a la máquina y salida que muestra los dispositivos de bloque conectados. Instrucciones usadas para redimensionar discos y sistemas de ficheros.
5. Del ejercicio 5: instrucción `virt-install` usada. Fragmento del XML de la máquina donde se comprueba el volumen que usa como disco principal.
6. Del ejercicio 6: instrucción `virt-clone` usada. Responde a las preguntas sobre los problemas de identidad al clonar y la solución. Instrucciones ejecutadas para corregir el *hostname* y las claves SSH.
7. Del ejercicio 7: contenido del fichero `cloud.yaml`. Instrucción usada para crear la clonación enlazada. Instrucción `virt-install` usada. Captura de la conexión por consola que muestre el *prompt* con el nombre de la máquina configurado.
8. Del ejercicio 8: instrucciones para crear y revertir la instantánea. Salida de `virsh snapshot-list`. Capturas o salidas que demuestren que el directorio desaparece y reaparece tras la reversión.
:::
