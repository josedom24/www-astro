---
title: "Ejercicio 1: Primeros pasos con OpenStack"
---

En este ejercicio vas a acceder a OpenStack por primera vez, configurar tu par de claves y grupo de seguridad, crear una instancia y acceder a ella desde el exterior.

## Ejercicio 1: Acceso y configuración inicial

1. Accede a la interfaz web **Horizon** de OpenStack con tus credenciales.
2. Sube tu clave pública a OpenStack para que pueda inyectarse en las instancias que crees.
3. Abre el puerto 22 en tu **Grupo de Seguridad** para permitir el acceso SSH desde el exterior.

## Ejercicio 2: Creación de una instancia

1. Crea una instancia a partir de una imagen (Debian o Ubuntu). No uses volúmenes.
2. Utiliza un sabor que comience por **m1**.
3. Conecta la instancia a tu red y selecciona tu clave pública para que se inyecte en ella.
4. Asigna una **IP flotante** a la instancia para poder acceder desde el exterior.
5. Accede a la instancia por SSH desde tu ordenador. Recuerda que el usuario es `debian` para imágenes Debian y `ubuntu` para imágenes Ubuntu.

## Ejercicio 3: Operaciones sobre la instancia

Practica las siguientes operaciones sobre la instancia que has creado:

1. Pausar y reanudar la instancia.
2. Apagar y encender la instancia.
3. Redimensionar la instancia a un sabor diferente.
4. Crear una instantánea (*snapshot*) de la instancia.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: captura de la interfaz Horizon donde se vea tu clave pública subida. Captura donde se vea la regla del puerto 22 en tu Grupo de Seguridad.
2. Del ejercicio 2: captura de la instancia creada y en ejecución. Captura de la conexión SSH a la instancia desde tu ordenador.
3. Del ejercicio 3: capturas que muestren las distintas operaciones realizadas sobre la instancia.
:::
