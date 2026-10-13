---
title: "Tarea 2.1: Contenedores LXC"
---

En esta tarea vas a instalar y gestionar contenedores LXC, configurar sus recursos, conectarlos a distintas redes y construir un escenario de router/NAT con almacenamiento compartido desde el host. Todas las operaciones se realizan desde la línea de comandos.

## 1. Primeros pasos con LXC

1. Instala LXC en tu sistema.
2. Crea un contenedor con la última versión de Ubuntu. Lista los contenedores disponibles.
3. Inicia el contenedor y comprueba la dirección IP que ha tomado. ¿Tiene conectividad al exterior?
4. Sal del contenedor y ejecuta un `apt update` dentro de él sin estar conectado a la consola del contenedor.
5. Limita el uso de memoria del contenedor a 512 MB y restringe su uso a una sola CPU. Comprueba que los cambios se han aplicado.

## 2. Red del contenedor

1. Comprueba que se ha creado un bridge llamado `lxcbr0` al que está conectado el contenedor.
2. Cambia la configuración del contenedor para desconectarlo de `lxcbr0` y conectarlo a la red `red-nat` que creaste en el ejercicio de redes de la unidad anterior.
3. Inicia el contenedor, comprueba la nueva dirección IP que ha tomado y verifica que sigue teniendo conectividad al exterior.

## 3. Escenario router/NAT con LXC

1. Crea un contenedor llamado **router** a partir de una plantilla de Debian. Configura su arranque automático.
2. Crea un contenedor llamado **servidorweb** a partir de una plantilla de Ubuntu 24.04. Configura su arranque automático.
3. Crea en el host un bridge llamado `br-contenedores` (sin usar `virsh`), de forma **persistente**, para que exista al arrancar el host y los contenedores puedan iniciarse automáticamente. Este bridge formará una red aislada entre los contenedores.
4. Conecta el contenedor **router** a la red `red-nat` (o a la red `default`), que será su red externa, y al bridge `br-contenedores`. Si tienes el bridge externo `br0` de la optativa 1.1, puedes usarlo como red externa. Configura las interfaces de red dentro del contenedor de forma adecuada.
5. Conecta el contenedor **servidorweb** únicamente al bridge `br-contenedores`. Configura su interfaz de red dentro del contenedor.
6. Configura el contenedor **router** para que realice NAT y permita al contenedor **servidorweb** tener acceso a internet.
7. Instala el servidor SSH en ambos contenedores. Crea un usuario sin privilegios y configura el acceso por clave pública/privada. Accede por SSH al contenedor **servidorweb** desde el host, usando el **router** como salto (opción `-J` de `ssh`).
8. Instala un servidor web en el contenedor **servidorweb**.
9. Crea el directorio `/opt/web` en el host con un fichero `index.html` y móntalo en el directorio `/var/www/html` del contenedor **servidorweb**.
10. Configura el contenedor **router** para redirigir el tráfico web que le llega por su red externa al contenedor **servidorweb**. Comprueba que se puede acceder a la página web desde el host, usando la IP externa del router (o desde otro equipo, si usas `br0`), y que al modificar `index.html` en el host el cambio se refleja inmediatamente.

:::tip[¿Qué tienes que entregar?]
1. Del apartado 1: salida que muestre los contenedores creados. Comprobación de conectividad al exterior. Instrucción usada para ejecutar `apt update` sin conectarse al contenedor. Configuración que limita la memoria y la CPU, y comprobación desde dentro del contenedor de que se ha aplicado.
2. Del apartado 2: configuración de red del contenedor antes y después del cambio. Comprobación de la nueva IP y conectividad.
3. Del apartado 3:
    * Salida de `lxc-ls -f` donde se vea el arranque automático y las IP de los dos contenedores.
    * Direccionamiento y rutas de los dos contenedores.
    * Reglas de NAT del **router** y comprobación de que **servidorweb** tiene acceso a internet.
    * Instrucción de acceso por SSH al contenedor **servidorweb** a través del **router**.
    * Línea de configuración del montaje de `/opt/web` y regla de redirección del tráfico web del **router**.
    * Captura accediendo a la página web desde el host (o desde otro equipo). Comprobación de que al modificar `index.html` en el host cambia el contenido servido.
:::
