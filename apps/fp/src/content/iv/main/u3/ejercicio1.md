---
title: "Ejercicio 1: Primeros pasos con OpenStack"
---

En este ejercicio vas a usar OpenStack por primera vez desde su aplicación web, **Horizon**: vas a preparar tu proyecto, crear una instancia y acceder a ella desde tu ordenador. **No hay que entregar nada**: el objetivo es que conozcas los conceptos con los que vamos a trabajar el resto de la unidad.

## Recursos

Vamos a usar el [Curso de OpenStack](https://github.com/josedom24/curso_openstack_ies). En concreto, estos apartados:

* [Acceso a Horizon y primeros pasos](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo1/horizon.md)
* [Conceptos previos](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/conceptos_previos.md)
* [Creación de instancias a partir de una imagen](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/instancias.md)
* [Operaciones sobre la instancia](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/operaciones.md)

## Conceptos previos

* **Proyecto**: el espacio de trabajo de cada usuario. Todos los recursos que crees (instancias, redes, volúmenes…) pertenecen a tu proyecto y están aislados de los de tus compañeros.
* **Imagen**: plantilla con un sistema operativo ya instalado y con la configuración mínima para funcionar en la nube.
* **Instancia**: servidor virtual que se crea a partir de una imagen. Al principio es un clon de la imagen.
* **Sabor** (*flavor*): define el tamaño de la instancia: número de vCPU, memoria RAM y tamaño del disco.
* **Par de claves**: tu clave pública SSH, guardada en OpenStack. Se inyecta en la instancia al crearla, y por eso se accede con clave y no con contraseña.
* **Grupo de seguridad**: el cortafuegos de la instancia. Por defecto no permite ninguna conexión entrante: hay que abrir los puertos que necesitemos.
* **IP fija**: dirección de la instancia en la red privada a la que está conectada. No cambia durante la vida de la instancia.
* **IP flotante**: dirección de la red externa que se asocia a una instancia para poder acceder a ella desde fuera. Se puede quitar y asignar a otra instancia.

Al entrar en tu proyecto ya tienes creada **una red privada conectada a un router**. En el ejercicio 4 veremos cómo funciona y crearemos otras.

## Acceso y configuración inicial

Siguiendo la documentación de [Acceso a Horizon y primeros pasos](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo1/horizon.md):

:::caution[Ejercicio]
1. Accede a **Horizon** con tu usuario.
2. Sube tu **clave pública** SSH a OpenStack.
3. Abre el puerto 22 en el **grupo de seguridad** `default` para poder acceder por SSH.
:::

## Creación de una instancia

Repasa los [Conceptos previos](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/conceptos_previos.md) y sigue la documentación de [Creación de instancias a partir de una imagen](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/instancias.md):

:::caution[Ejercicio]
1. Crea una instancia a partir de una imagen de Debian o de Ubuntu. No uses volúmenes.
2. Elige un sabor cuyo nombre empiece por **m1**.
3. Conecta la instancia a la red de tu proyecto y elige tu par de claves.
4. Asocia una **IP flotante** a la instancia.
5. Accede a la instancia por SSH desde tu ordenador. El usuario es `debian` en las imágenes de Debian y `ubuntu` en las de Ubuntu.
6. Dentro de la instancia, comprueba cuál es su dirección IP. ¿Es la IP fija o la flotante? ¿Dónde está configurada la IP flotante?
:::

## Operaciones sobre la instancia

Siguiendo la documentación de [Operaciones sobre la instancia](https://github.com/josedom24/curso_openstack_ies/blob/main/modulo3/operaciones.md):

:::caution[Ejercicio]
1. Pausa y reanuda la instancia.
2. Apaga y enciende la instancia.
3. Redimensiona la instancia a un sabor diferente.
4. Crea una instantánea (*snapshot*) de la instancia. ¿Dónde aparece la instantánea creada?
5. Elimina la instancia.
:::
