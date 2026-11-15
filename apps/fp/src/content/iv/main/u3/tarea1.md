---
title: "Tarea 3.1: Gestión de OpenStack con OSC"
---

En esta tarea tienes que entregar lo que se pide al final de los ejercicios que has hecho con OpenStack client (OSC). El ejercicio 1 no se entrega.

Todas las operaciones sobre recursos de OpenStack tienes que hacerlas con OSC. Horizon solo lo puedes usar para comprobar el resultado y para las capturas de la Topología de red.

:::tip[¿Qué tienes que entregar?]
1. Del [ejercicio 2: Instancias con OpenStack client (OSC)](../ejercicio2/):
    * El contenido de tu fichero `cloud-config.yaml`.
    * La instrucción con la que has creado la instancia y las que has usado para asociarle la IP flotante.
    * Una captura del acceso por SSH con tu usuario donde se vea el FQDN de la máquina y que Apache2 está instalado.
    * La salida de `openstack image list` donde se vea la instantánea, y una captura que demuestre que la instancia creada a partir de ella tiene la misma configuración.
2. Del [ejercicio 3: Volúmenes](../ejercicio3/):
    * Las instrucciones para crear el volumen arrancable y la instancia sobre él.
    * Una captura que demuestre que, después de eliminar la instancia y crear otra con el mismo volumen, el servicio que instalaste sigue ahí.
    * Las instrucciones para crear la instantánea del volumen y el volumen nuevo, y una captura donde se vea el fichero en el volumen nuevo.
    * Responde: ¿qué diferencia hay entre el disco de una instancia creada con un sabor `m1` y el de una creada sobre un volumen cuando eliminamos la instancia?
3. Del [ejercicio 4: Redes privadas en OpenStack](../ejercicio4/):
    * Las instrucciones para crear el router, las dos redes con sus subredes, el puerto y las dos instancias.
    * Una captura de la Topología de red de Horizon con las dos redes y las dos instancias.
    * Las instrucciones para crear los dos grupos de seguridad y sus reglas.
    * Una captura del acceso por SSH a `backend` a través de `maquina1`, donde se vea su dirección IP y que tiene acceso a Internet.
    * Responde: `backend` tiene acceso a Internet pero no se puede acceder a ella desde fuera. ¿Quién hace posible lo primero y por qué no es posible lo segundo?
4. Del [ejercicio 5: Red aislada y router Linux en OpenStack](../ejercicio5/):
    * Las instrucciones para crear la red aislada, los puertos y las dos instancias.
    * La configuración de `maquina_router` como router: reenvío de paquetes y regla de SNAT.
    * El fichero de netplan de `maquina2` con la puerta de enlace.
    * Las instrucciones para desactivar la seguridad de los puertos.
    * Una captura de la Topología de red de Horizon.
    * Una captura en `maquina2` donde se vea su tabla de rutas y que tiene acceso a Internet usando un nombre de dominio.
    * Responde: ¿por qué `maquina2` no tiene acceso a Internet hasta que se desactiva la seguridad de los puertos, si el router está bien configurado?
:::
