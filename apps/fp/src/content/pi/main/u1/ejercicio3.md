---
title: "Ejercicio 3: Introducción a ansible"
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

:::tip[Comprueba que...]
1. Tienes el inventario y la configuración de tu proyecto ansible bien definidos, y puedes probar la conectividad con el servidor remoto.
2. Sabes ejecutar comandos en el nodo remoto con `command`/`shell` (por ejemplo `hostname`).
3. Sabes cómo se llama la propiedad que hace que una tarea ya realizada no se repita al volver a ejecutarla (idempotencia).
4. Sabes copiar un fichero al servidor remoto con `copy`, y puedes explicar qué color de salida aparece la primera vez y cuál la segunda, y por qué.
5. Entiendes qué ocurre si modificas el fichero de origen y vuelves a copiarlo.
6. Sabes crear un directorio remoto con `file` y comprobar que se ha creado.
7. Sabes instalar, comprobar y volver a instalar un paquete (nginx) con `apt`, y entiendes qué ocurre al repetir la instalación.
8. Sabes qué módulo gestiona un servicio, y sabes pararlo y comprobarlo.
9. Sabes desinstalar el paquete y comprobar la desinstalación.
10. Sabes crear y eliminar un usuario remoto con `user`, comprobando cada paso.
:::
