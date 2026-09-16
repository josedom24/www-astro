---
title: "Tarea 1: Introducción a ansible"
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
1. Entrega el contenido del fichero de inventario y de la configuración (`ansible.cfg`) de tu proyecto ansible.
2. Captura de pantalla probando la conectividad con el servidor remoto (`ping`).
3. Ejecuta en el nodo remoto la instrucción `hostname` con `command`/`shell` y entrega la captura de la salida.
4. Copia un fichero al servidor remoto con `copy`. Entrega la captura de la primera ejecución y de la segunda (sin cambios). ¿De qué color se muestra la salida en cada caso y por qué? ¿Cómo se llama esa propiedad?
5. Modifica el fichero de origen y vuelve a copiarlo. Entrega la captura de la salida y explica qué ha ocurrido.
6. Crea un directorio remoto con `file`. Entrega la captura donde se compruebe que se ha creado.
7. Instala el paquete nginx con `apt`. Entrega la captura de la instalación y de un segundo intento de instalación (¿qué ocurre?).
8. Para el servicio nginx con `service`. Entrega la captura donde se compruebe que se ha parado.
9. Desinstala el paquete nginx. Entrega la captura de la desinstalación.
10. Crea y después elimina un usuario remoto con `user`. Entrega la captura de cada paso.
:::
