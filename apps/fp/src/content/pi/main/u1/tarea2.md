---
title: "Tarea 2: Ejecución de Playbooks"
---

1. Haz un fork del repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi) y realiza una clonación en el ordenador donde has instalado ansible. Vamos a trabajar en el directorio **ansible/ejercicio4**.

2. Rellena de manera adecuada el inventario y la configuración de ansible.

3. Contesta estas preguntas: ¿Qué variables están definidas a nivel de nodo? ¿Qué variables están definidas a nivel de grupos de nodos? ¿Qué fichero has consultado?

4. Ejecuta el método necesario para obtener las variables del nodo (**Gathering Facts**).

5. Estudia el playbook que se encuentra en el fichero `site.yaml`:

    * Primera línea: `hosts: all`. Significa que las tareas se van a ejecutar en todos los nodos definidos en el inventario.
    * `become: true`: En las tareas que necesiten ejecutarse como administrador se utilizará `sudo`.
    * `tasks`: Lista de tareas. Todas las tareas tienen un mensaje en el parámetro `name` y el uso de un módulo.

6. Ejecuta el playbook:

    ```
    ansible-playbook site.yaml
    ```

    * **Si tienes errores, repasa las modificaciones que has realizado para corregirlos.**
    * **Cuando funcione la ejecución de la receta, cambia el fichero `foo.conf` y ejecuta de nuevo la receta. ¿Se ejecutan todas las tareas?**
    * **¿Cómo se llama la propiedad que permite que las tareas que ya se han realizado no se vuelvan a ejecutar?**
    * **Comprobación del funcionamiento: Comprueba que se ha copiado un fichero `foo.conf` en el servidor, accede desde un navegador al servidor y comprueba que aparece el fichero `index.html` que hemos creado.**

    Debes completar las siguientes tareas del playbook:

    1. **Actualizamos el sistema**: Se utiliza el módulo [apt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html) para actualizar los paquetes del sistema.
    2. **Instalar paquetes con apt**: **Busca en la documentación del módulo [apt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html) y termina la segunda tarea para hacer la instalación del paquete `git` y `apache2`.**
    3. **Copiar fichero a la máquina remota**: **Modifica la tarea para guardar el fichero `foo.conf` al directorio `/etc` de la máquina remota**.
    4. **Copiar un template a un fichero de la máquina remota**:
        * **Modifica la plantilla `index.j2` para indicar los nombres correctos de las variables. Tienes que cambiar las variables `modifica_el_nombre` por el nombre correcto de las variables.**
        * **Modifica la tarea para guardar el template en el directorio `/var/www/html/index.html` de la máquina que estamos configurando.**

:::tip[¿Qué tienes que entregar?]
1. Entrega los ficheros `site.yaml`, `hosts` y `templates/index.j2` con las cuatro tareas completadas.
2. Captura de pantalla de la ejecución del playbook sin errores.
3. Vuelve a ejecutar el playbook. Entrega la captura y explica por qué no se repiten las tareas ya hechas (idempotencia).
4. Modifica o borra `foo.conf` en el servidor y vuelve a ejecutar el playbook. Entrega la captura y explica qué ha ocurrido.
5. Captura de pantalla del acceso desde el navegador al servidor, donde se vea el contenido de `index.html`.
6. Entrega la URL de tu repositorio (fork) con el que has trabajado.
:::
