---
title: "Ejercicio 1: Contenedores LXC"
---

En este ejercicio vas a instalar y gestionar contenedores LXC, configurar sus recursos, conectarlos a distintas redes y construir un escenario de router/NAT con almacenamiento compartido desde el host. Todas las operaciones se realizan desde la línea de comandos.

## Ejercicio 1: Primeros pasos con LXC

1. Instala LXC en tu sistema.
2. Crea un contenedor con la última versión de Ubuntu. Lista los contenedores disponibles.
3. Inicia el contenedor y comprueba la dirección IP que ha tomado. ¿Tiene conectividad al exterior?
4. Sal del contenedor y ejecuta un `apt update` dentro de él sin estar conectado a la consola del contenedor.
5. Limita el uso de memoria del contenedor a 512 MB y restringe su uso a una sola CPU. Comprueba que los cambios se han aplicado.

## Ejercicio 2: Red del contenedor

1. Comprueba que se ha creado un bridge llamado `lxcbr0` al que está conectado el contenedor.
2. Cambia la configuración del contenedor para desconectarlo de `lxcbr0` y conectarlo a la red `red-nat` que creaste en el ejercicio de redes de la unidad anterior.
3. Inicia el contenedor, comprueba la nueva dirección IP que ha tomado y verifica que sigue teniendo conectividad al exterior.

## Ejercicio 3: Escenario router/NAT con LXC

1. Crea un contenedor llamado **router** a partir de una plantilla de Debian. Configura su arranque automático.
2. Crea un contenedor llamado **servidorweb** a partir de una plantilla de Ubuntu 24.04. Configura su arranque automático.
3. Crea manualmente un bridge llamado `br-contenedores` en el host (sin usar `virsh`). Este bridge formará una red aislada entre los contenedores.
4. Conecta el contenedor **router** al bridge `br0` (red externa) y al bridge `br-contenedores`. Configura las interfaces de red dentro del contenedor de forma adecuada.
5. Conecta el contenedor **servidorweb** únicamente al bridge `br-contenedores`. Configura su interfaz de red dentro del contenedor.
6. Configura el contenedor **router** para que realice NAT y permita al contenedor **servidorweb** tener acceso a internet.
7. Instala el servidor SSH en ambos contenedores. Crea un usuario sin privilegios y configura el acceso por clave pública/privada. Accede por SSH al contenedor **servidorweb** desde el host.
8. Instala un servidor web en el contenedor **servidorweb**.
9. Crea el directorio `/opt/web` en el host con un fichero `index.html` y móntalo en el directorio `/var/www/html` del contenedor **servidorweb**.
10. Configura el contenedor **router** para redirigir el tráfico web del exterior al contenedor **servidorweb**. Comprueba que se puede acceder a la página web desde fuera y que al modificar `index.html` en el host el cambio se refleja inmediatamente.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: salida que muestre los contenedores creados. Comprobación de conectividad al exterior. Instrucción usada para ejecutar `apt update` sin conectarse al contenedor.
2. Del ejercicio 2: configuración de red del contenedor antes y después del cambio. Comprobación de la nueva IP y conectividad.
3. Del ejercicio 3: direccionamiento y rutas de los dos contenedores. Comprobación del acceso por SSH al contenedor **servidorweb**. Captura accediendo a la página web desde el exterior. Comprobación de que al modificar `index.html` en el host cambia el contenido servido.
:::
