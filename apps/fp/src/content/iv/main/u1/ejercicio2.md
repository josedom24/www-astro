---
title: "Almacenamiento, clonación e instantáneas"
---

En este ejercicio vas a gestionar el almacenamiento en QEMU/KVM + libvirt, trabajar con volúmenes en el *pool* `default`, comparar formatos de imagen de disco, añadir y redimensionar discos en máquinas virtuales, clonar máquinas y desplegar nuevas instancias con imágenes cloud. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Pools de almacenamiento

1. Muestra con `virsh` todos los *pools* de almacenamiento definidos en tu sistema. ¿Cuántos hay? ¿De qué tipo es cada uno?
2. Para cada *pool*, muestra su información detallada: tipo, estado, ruta o recurso al que apunta y capacidad disponible.
3. Muestra los volúmenes que contiene cada *pool*. ¿Qué tipo de volúmenes almacena el *pool* `default`? ¿Y el resto de *pools*?
4. Responde: ¿qué diferencia hay entre un *pool* de tipo `dir` y uno de tipo `logical`? ¿Qué ventaja ofrece cada uno como almacenamiento de discos para máquinas virtuales?

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

:::tip[Comprueba que...]
1. Sabes listar los *pools* de tu sistema y explicar las diferencias entre los tipos de *pool*.
2. Puedes crear volúmenes en el *pool* `default` tanto con `virsh` como con `qemu-img`.
3. Entiendes por qué un fichero raw ocupa todo el espacio desde el principio y uno qcow2 no.
4. Sabes añadir discos a una MV y redimensionarlos, tanto el volumen como el sistema de ficheros dentro de la MV.
5. Puedes instalar una MV usando un volumen ya existente como disco principal.
6. Entiendes qué problemas de identidad aparecen al clonar una MV y sabes corregirlos.
7. Sabes desplegar una MV a partir de una imagen cloud personalizada con `cloud-init`.
8. Sabes crear, listar y revertir una instantánea de una MV.
:::
