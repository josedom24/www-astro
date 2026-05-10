---
title: "Ejercicio 2: Uso de OpenStack client (OSC)"
---

En este ejercicio vas a gestionar OpenStack desde la línea de comandos usando el cliente OSC: instalar instancias con cloud-init, gestionar almacenamiento con volúmenes y trabajar con redes NAT. Todas las operaciones se realizan desde el CLI.

## Ejercicio 1: Instalación y uso básico de OSC

1. Instala el cliente de OpenStack y configúralo con el fichero de credenciales que debes descargar desde Horizon.
2. Muestra con OSC los distintos recursos de tu proyecto: instancias, claves SSH, imágenes, redes, sabores y reglas del grupo de seguridad.
3. Abre el puerto 443 en el grupo de seguridad `default`.

## Ejercicio 2: Creación de instancias con cloud-init

1. Crea un fichero `cloud-config.yaml` que al iniciarse la instancia: actualice los paquetes, instale Apache2, cree un usuario con tu nombre y contraseña, y configure el FQDN a `maquina1.example.org`.
2. Crea una instancia Linux usando ese fichero de cloud-init. Solicita una IP flotante y asígnala a la instancia.
3. Accede por SSH a la instancia y comprueba que la configuración se ha aplicado correctamente.
4. Para la instancia, arráncala de nuevo y finalmente elimínala.

## Ejercicio 3: Instantáneas de instancias

1. Crea una instantánea de la instancia que has creado.
2. Crea una nueva instancia a partir de esa instantánea y comprueba que tiene la misma configuración (Apache2, usuario, etc.).

## Ejercicio 4: Gestión de volúmenes

1. Crea un volumen, asócialo a una instancia, fórmatelo y móntalo dentro de la instancia.
2. Intenta eliminar el volumen mientras está asociado. ¿Puedes hacerlo? ¿Por qué? Desasócialo y elimínalo.
3. Crea un volumen arrancable de 10 GB desde una imagen. Crea una instancia cuyo disco principal sea ese volumen (usa un sabor de tipo `vol`).
4. Instala algún servicio en la instancia. Elimínala y crea una nueva instancia a partir del mismo volumen. Comprueba que la información no se ha perdido.
5. Crea un volumen, asócialo a una instancia y añade algún fichero. Desasócialo, crea una instantánea del volumen y elimínalo. Crea un nuevo volumen desde la instantánea, vuelve a asociarlo a la instancia y comprueba que los ficheros siguen ahí.
6. Redimensiona un volumen asociado a una instancia y redimensiona también el sistema de ficheros dentro de la instancia.

## Ejercicio 5: Redes NAT

1. Crea un router conectado a la red externa.
2. Crea una red (`red1`) con subred de tipo NAT con DHCP, DNS `172.22.0.1` y direccionamiento `192.168.0.0/24`. Conéctala al router.
3. Crea una instancia (`maquina1`) conectada a `red1`. Comprueba que la IP fija está en el rango de la red. ¿Puedes asignarle una IP flotante? ¿Por qué? Comprueba en la configuración de netplan que la interfaz se ha configurado por DHCP.
4. Crea una instancia (`maquina2`) en `red1` con la IP fija `192.168.0.200` usando un puerto. Comprueba que la IP asignada es la reservada y que netplan la ha configurado por DHCP.
5. Crea una red (`red2`) de tipo NAT **sin DHCP** con el mismo router y direccionamiento `192.168.10.0/24`. Crea una instancia (`maquina3`) conectada a ella usando `--config-drive True`. Asígnale una IP flotante y comprueba que netplan ha configurado la interfaz de forma estática.
6. Crea una instancia (`maquina4`) en `red2` con la IP fija `192.168.10.100` usando un puerto. Comprueba que netplan ha configurado la IP de forma estática.
7. Elimina todas las instancias, puertos, subredes, redes y el router siguiendo el orden correcto.

:::tip[¿Qué tienes que entregar?]
1. Del ejercicio 1: instrucción usada para instalar OSC. Salidas de los comandos que muestran los recursos del proyecto. Instrucción para abrir el puerto 443.
2. Del ejercicio 2: contenido del fichero `cloud-config.yaml`. Instrucción `openstack server create` usada. Captura del acceso SSH a la instancia con la configuración aplicada.
3. Del ejercicio 3: instrucciones para crear la instantánea y la nueva instancia. Captura que comprueba que la nueva instancia tiene la misma configuración.
4. Del ejercicio 4: instrucciones usadas en cada paso. Responde a la pregunta sobre por qué no se puede eliminar un volumen asociado. Captura que demuestra la persistencia de datos tras recrear la instancia desde el volumen. Captura de la instantánea del volumen restaurada con los ficheros.
5. Del ejercicio 5: instrucciones para crear la infraestructura de red. Para cada instancia: dirección IP obtenida y comprobación del fichero de netplan. Responde a las preguntas sobre IP flotante y configuración estática vs dinámica. Instrucciones de limpieza de la infraestructura.
:::
