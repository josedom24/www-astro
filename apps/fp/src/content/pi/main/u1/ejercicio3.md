---
title: "Ejercicio 3: Playbooks con Roles"
---

En este taller vamos a trabajar con dos servidores. Uno será el servidor web y el otro será el servidor de base de datos.

1. Crear dos máquinas virtuales (con las características indicadas en el ejercicio 1).
2. Vamos a trabajar con el directorio **Taller2** del repositorio.
3. Rellena el inventario de forma adecuada para definir los dos equipos que vamos a configurar. Debes indicar los nombres de tus máquinas y los parámetros de acceso.
4. Prueba de conectividad. Ejecuta el comando `ansible -m ping all` para asegurarte que puedes conectar con las máquinas.
5. Estudia la nueva definición del playbook en el fichero `site.yaml`:

    * El campo `hosts`: es el nombre del grupo o máquina en la que se van a ejecutar las tareas del rol.
    * El campo `roles/role` es el nombre del rol que se va a ejecutar.

    **Modifica el fichero `site.yaml`** para conseguir que se ejecuten los roles como se indica a continuación:

    * El rol `commons` (tareas comunes a todos los nodos) para todos los nodos (grupo `all`).
    * El rol `apache2` (instalación y configuración de apache2) para todos los nodos del grupo `servidores_web`.
    * El rol `mariadb` (instalación y configuración de mariadb) para todos los nodos del grupo `servidores_bd`.

6. Los roles se van a definir en el directorio `roles`. Se creará un directorio para cada rol con las carpetas:

    * `tasks`: Contiene el yaml con las tareas.
    * `files`: Contiene los ficheros que vamos a copiar a los nodos con el módulo `copy`.
    * `templates`: Contiene las plantillas que vamos a copiar a los nodos con el módulo `template`.
    * `handlers`: Contiene los manejadores para gestionar los servicios instalados.

7. El rol `commons` se ejecuta en todos los nodos. **Modifica la tarea que está definida para que se actualice el sistema de todas las máquinas.**

8. El rol `apache2` instala apache2 y copia algunos ficheros al servidor. Uno de los ficheros es un fichero de configuración, por lo que debemos reiniciar apache2 cada vez que se copia. En la tarea **Copiar fichero de configuración y reiniciar el servicio**:

    **Debes poner en el parámetro `notify` el nombre de la tarea que se encuentra en el fichero `main.yaml` del directorio `handlers`, que será el encargado de reiniciar el servicio.**

9. El rol `mariadb` instala el servidor de base de datos mariadb, crea una base de datos y un usuario, y modifica la configuración del servicio.

    * **Modifica las variables `cambia_nombre_variable` por las variables correctas. ¿En qué fichero tienes que buscar el nombre de las variables correctas?**
    * **Debes poner en el parámetro `notify` el nombre de la tarea que se encuentra en el fichero `main.yaml` del directorio `handlers`, que será el encargado de reiniciar el servicio.**

10. Ejecuta el playbook:

    ```
    ansible-playbook site.yaml
    ```

    * **Si tienes errores, repasa las modificaciones que has realizado para corregirlos.**
    * **Cuando funcione la ejecución de la receta, cambia una de las tareas que notifican un reinicio para comprobar que se produce de nuevo el reinicio del servicio.**
    * **Comprobación del funcionamiento: Accede desde el navegador web y comprueba los ficheros que hemos subido al servidor. Accede a la base de datos.**

:::tip[¿Qué tienes que entregar?]
1. Entrega una captura de pantalla donde se vea que se ha finalizado la ejecución del playbook.
2. Captura de pantalla donde se vea el acceso desde el navegador al servidor web, y se vea el contenido del fichero `index.html`.
3. Captura de pantalla donde se vea el acceso a la base de datos.
4. Realiza un cambio en la receta que necesite ejecutar el reinicio del servicio. Ejecuta de nuevo el playbook y comprueba que se ha ejecutado el handler correspondiente.
5. Entrega la URL de tu repositorio con el que estás trabajando.
:::
