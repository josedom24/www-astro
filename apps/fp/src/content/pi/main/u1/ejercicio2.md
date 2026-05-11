---
title: "Ejercicio 2: Ejecución de Playbooks"
---

1. Haz un fork del repositorio [ejercicios_pi](https://github.com/josedom24/ejercicios_pi) y realiza una clonación en el ordenador donde has instalado ansible. Vamos a trabajar en el directorio **u1_iac/ejercicio2**.

2. Rellena de manera adecuada el inventario y la configuración de ansible.

3. Contesta estas preguntas: ¿Qué variables están definidas a nivel de nodo? ¿Qué variables están definidas a nivel de grupos de nodos? ¿Qué fichero has consultado?

4. Ejecuta el método necesario para obtener las variables del nodo (**Gathering Facts**).

5. Estudia el playbook que se encuentra en el fichero `site.yml`:

    * Primera línea: `hosts: all`. Significa que las tareas se van a ejecutar en todos los nodos definidos en el inventario.
    * `become: true`: En las tareas que necesiten ejecutarse como administrador se utilizará `sudo`.
    * `tasks`: Lista de tareas. Todas las tareas tienen un mensaje en el parámetro `name` y el uso de un módulo.

6. Ejecuta el playbook:

    ```
    ansible-playbook site.yaml
    ```

    * **Si tienes errores, repasa las modificaciones que has realizado para corregirlos.**
    * **Cuando funcione la ejecución de la receta, cambia el fichero `foo.txt` y ejecuta de nuevo la receta. ¿Se ejecutan todas las tareas?**
    * **¿Cómo se llama la propiedad que permite que las tareas que ya se han realizado no se vuelvan a ejecutar?**
    * **Comprobación del funcionamiento: Comprueba que se ha copiado un fichero `foo.txt` en el servidor, accede desde un navegador al servidor y comprueba que aparece el fichero `index.html` que hemos creado.**

    Debes completar las siguientes tareas del playbook:

    1. **Actualizamos el sistema**: Se utiliza el módulo [apt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html) para actualizar los paquetes del sistema.
    2. **Instalar paquetes con apt**: **Busca en la documentación del módulo [apt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html) y termina la segunda tarea para hacer la instalación del paquete `git` y `apache2`.**
    3. **Copiar fichero a la máquina remota**: **Modifica la tarea para guardar el fichero `foo.txt` al directorio `/etc` de la máquina remota**.
    4. **Copiar un template a un fichero de la máquina remota**:
        * **Modifica la plantilla `index.j2` para indicar los nombres correctos de las variables. Tienes que cambiar las variables `modifica_el_nombre` por el nombre correcto de las variables.**
        * **Modifica la tarea para guardar el template en el directorio `/var/www/html/index.html` de la máquina que estamos configurando.**

:::tip[¿Qué tienes que entregar?]
1. Entrega los ficheros: `site.yaml`, `hosts` y `template/index.j2`.
2. Entrega una captura de pantalla donde se vea que se ha finalizado la ejecución del playbook.
3. Vuelve a ejecutar el playbook, ¿se ejecutan todas las tareas? ¿Cómo se llama la propiedad que permite que las tareas que ya se han realizado no se vuelvan a ejecutar?
4. Comprueba que el fichero `foo.conf` se ha copiado al servidor configurado. Modifica o borra el fichero en el servidor y vuelve a ejecutar el playbook. ¿Qué ocurre?
5. Captura de pantalla donde se vea el acceso desde el navegador al servidor web, y se vea el contenido del fichero `index.html`.
6. Entrega la URL de tu repositorio con el que estás trabajando.
:::
