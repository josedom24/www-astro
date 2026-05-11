---
title: "Ejercicio 1: Introducción a ansible"
---

1. Realiza la instalación de ansible. Puedes usar los repositorios oficiales de Debian, o realizar una instalación con `pip` en un entorno virtual python.
2. Crea una máquina virtual que vamos a configurar con ansible. Esta máquina debe tener las siguientes características:

    * Debe tener creado un usuario sin privilegios con el que podamos acceder a la máquina usando claves ssh.
    * Debe tener instalado `sudo` y el usuario que estamos usando para acceder debe estar configurado para poder usar `sudo` sin que le pida la contraseña.

3. El **inventario** es el fichero donde definimos los equipos que vamos a configurar. Crea un directorio y dentro un fichero llamado `hosts`, con el siguiente contenido:

    ```
    all:
      children:
        servidores:
          hosts:
            nodo1: 
              ansible_ssh_host: 
              ansible_ssh_user:  
              ansible_ssh_private_key_file: 
    ```

    En el inventario se clasifican los equipos por grupos:

    * El grupo `all` corresponde a todos los equipos definidos.
    * En este ejemplo hemos creado un grupo `servidores`, donde hemos definido nuestra máquina.
    * A la máquina la hemos llamado `nodo1` (**cambia el nombre y pon el de tu máquina**), además **debes rellenar la siguiente información del nodo**:
        * `ansible_ssh_host`: Dirección IP del equipo que queremos configurar.
        * `ansible_ssh_user`: Usuario sin privilegios con el que vamos a acceder por ssh.
        * `ansible_ssh_private_key_file`: Fichero con la clave privada que vamos a usar para el acceso.

4. Crea un **fichero de configuración** llamado `ansible.cfg` en el directorio del proyecto, con el siguiente contenido:

    ```
    [defaults]
    inventory = hosts
    host_key_checking = False
    ```

5. Comprueba la conectividad con el nodo usando el módulo `ping`:

    * `ansible all -m ping`: Comprueba la conectividad con **todos** los equipos del inventario.
    * `ansible servidores -m ping`: Comprueba la conectividad con los equipos del **grupo servidores**.
    * `ansible nodo1 -m ping`: Comprueba la conectividad con el equipo **nodo1**.

    Debe salir el mensaje "pong" en verde.

6. Practica con los siguientes módulos de ansible:

    * **command**: Ejecuta comandos en el nodo remoto. Con `-a` indicamos los parámetros del módulo.

        ```
        ansible all -m command -a "uptime"
        ansible all -m shell -a "echo $HOME | wc -c"
        ```

    * **copy**: Permite copiar ficheros desde nuestro ordenador al nodo remoto.

        ```
        ansible all -m copy -a "src=./index.html dest=/tmp/index.html mode=0644"
        ```

    * **file**: Gestiona archivos, directorios y permisos.

        ```
        ansible all -m file -a "path=/tmp/ansible_demo state=directory mode=0755"
        ```

    * **apt**: Instala, actualiza o elimina paquetes.

        ```
        ansible nodo1 -m apt -a "name=apache2 state=present" --become
        ```

    * **service**: Gestiona servicios del sistema.

        ```
        ansible nodo1 -m service -a "name=apache2 state=started enabled=yes" --become
        ```

    * **user**: Crea, modifica o elimina usuarios.

        ```
        ansible all -m user -a "name=demo shell=/bin/bash groups=sudo state=present" --become
        ```

:::tip[¿Qué tienes que entregar?]
1. Entrega el contenido del fichero de inventario y la configuración de tu proyecto ansible.
2. Prueba la conectividad con el servidor remoto y muestra la salida.
3. Ejecuta en el servidor remoto la instrucción `hostname`.
4. Responde: ¿Cómo se llama la propiedad que permite que las tareas que ya se han realizado no se vuelvan a ejecutar?
5. Copia un fichero desde tu ordenador al servidor remoto. ¿Qué pone la primera línea de la salida de la ejecución del comando? ¿De qué color se muestra la salida?
6. Vuelve a ejecutar la copia del fichero. ¿Qué pone la primera línea de la salida de la ejecución del comando? ¿De qué color se muestra la salida? ¿Por qué?
7. Modifica el fichero en tu ordenador o en el servidor remoto y vuelve a ejecutar la copia. ¿Qué sucede ahora?
8. Crea un directorio en el servidor remoto y comprueba que se ha creado.
9. Instala el servidor nginx en el servidor remoto. Comprueba que se ha realizado la instalación.
10. Intenta volver a ejecutar nginx en el servidor remoto. ¿Qué ocurre?
11. ¿Qué módulo de ansible tienes que usar para gestionar el servicio que acabas de instalar? Para el servicio nginx. Comprueba que has parado el servicio.
12. Desinstala el servidor nginx. Comprueba la desinstalación.
13. Crea un usuario en el servicio remoto. Comprueba que el usuario se ha creado.
14. Elimina el usuario que has creado. Comprueba que se ha eliminado de forma correcta.
:::
