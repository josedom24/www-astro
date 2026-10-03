---
title: "Proyecto 1: Infraestructura como código"
---

En este proyecto vas a crear **desde cero** un escenario con OpenTofu y a configurarlo con Ansible, para poner en producción una aplicación web con base de datos. Después le harás **tres modificaciones** que eliges tú. El proyecto es **individual**.

La idea fundamental es que el escenario sea **reproducible**: en cualquier momento se tiene que poder destruir y volver a levantar, funcionando, con solo dos comandos.

## Normas generales

* **Repositorio.** Trabaja en un repositorio de GitHub propio, con dos directorios: `opentofu/` (el escenario) y `ansible/` (la configuración), y un `README.md` que explique cómo se despliega.
* **Commits.** Haz un commit cada vez que termines un cambio de una misma temática, con un mensaje que diga qué has hecho. No hagas un único commit al final: el historial forma parte de la evaluación. Antes de cada fecha de entrega, el repositorio tiene que tener todos los cambios de esa entrega.
* **Qué no se sube.** Usa un `.gitignore` para no subir lo que genera OpenTofu (`terraform.tfstate`, `.terraform/`, el inventario generado). Tampoco se suben imágenes de disco, bases de datos ni ficheros grandes.
* **Desde cero.** Puedes consultar los ejemplos de las tareas, pero el escenario y la receta los escribes tú. Todo lo que necesite el escenario tiene que salir del repositorio: nada configurado a mano en las máquinas ni copiado de otro equipo.
* **Dos comandos.** Con el repositorio recién clonado, el escenario se levanta con `tofu apply` (en `opentofu/`) y `ansible-playbook site.yaml` (en `ansible/`).
* **Entregas.** Cada entrega es una tarea de Redmine distinta, con su fecha, y lleva su documentación y su vídeo.

## Entrega 1: escenario base

### El escenario (OpenTofu)

* Dos máquinas virtuales Debian 13: `web` (servidor web) y `bd` (servidor de base de datos), creadas como clones ligeros de la imagen base.
* Una **red NAT con DHCP**, a la que se conectan las dos máquinas: por ella accedes al servidor web desde tu equipo y las máquinas tienen salida a internet.
* Una **red de datos muy aislada**, con direcciones estáticas, por la que se comunican `web` y `bd`.
* Variables, al menos, para la imagen base y la memoria de las máquinas.
* Un `output` con las IP de las máquinas.
* El **inventario de Ansible lo genera OpenTofu** (como en el ejemplo 5 de la tarea 5), con los grupos `servidores_web` y `servidores_bd`.

### La configuración (Ansible)

Un `site.yaml` con tres roles:

* `commons`, para todas las máquinas: actualiza el sistema e instala los paquetes comunes que necesites.
* `bd`: instala MariaDB, hace que escuche **solo en la red de datos**, crea la base de datos y un usuario que **solo puede conectarse desde la IP del servidor web** en esa red, y crea las tablas de la aplicación.
* `web`: instala Apache con PHP, crea un virtual host con un nombre tuyo (por ejemplo, `www.tunombre.org`) y despliega la aplicación.

Las variables (nombres, IP, usuarios, contraseñas) van en `group_vars`, no escritas en las tareas.

### La aplicación

La aplicación es un libro de visitas en PHP con MariaDB: [guestbook_php](https://github.com/josedom24/guestbook_php). En su README tienes lo que necesita. Ten en cuenta:

* El fichero `config.php` tiene los datos de conexión a la base de datos: genéralo con una plantilla.
* `schema.sql` crea las tablas. **La receta tiene que ser idempotente**: piensa cómo conseguir que la segunda ejecución del playbook no falle ni cambie nada.

### Comprobaciones

* Desde tu equipo, accedes a la aplicación por su nombre y publicas un mensaje.
* Una segunda ejecución de `ansible-playbook site.yaml` termina con `changed=0`.
* Con `tofu destroy`, `tofu apply` y `ansible-playbook site.yaml`, el escenario vuelve a funcionar.

:::tip[¿Qué tienes que entregar?]
1. La URL de tu repositorio.
2. Un esquema del escenario: máquinas, redes y direcciones IP.
3. La salida del `output` de OpenTofu y el inventario que ha generado.
4. El `PLAY RECAP` de la primera ejecución del playbook y la segunda ejecución completa, con `changed=0`.
5. La comprobación de que la base de datos solo acepta conexiones desde el servidor web: una conexión desde `web` que funciona y otra desde otro sitio que se rechaza.
6. Captura de pantalla de la aplicación con un mensaje publicado.
7. Un vídeo de 2 a 4 minutos (ver más abajo) mostrando el despliegue desde cero.
:::

## Modificaciones 1, 2 y 3

Sobre el escenario base vas a hacer tres modificaciones. Las eliges tú:

1. **Propuesta.** Antes de empezar, escribe en la tarea de Redmine de la modificación qué vas a cambiar, por qué y qué recursos de OpenTofu y qué roles de Ansible se van a ver afectados. **Espera a que el profesor la valide** antes de empezar.
2. **Implementación.** Haz el cambio en el repositorio, con sus commits.
3. **Entrega.** Documenta el cambio en la tarea y sube el vídeo.

Reglas:

* Cada modificación tiene que tener entidad: un rol nuevo o un cambio en la infraestructura. Cambiar un nombre o una variable no es una modificación.
* **Al menos una de las tres modificaciones tiene que cambiar la infraestructura** (OpenTofu), no solo la configuración.
* Después de cada modificación, el escenario se sigue levantando desde cero con los dos comandos, y la receta sigue siendo idempotente.
* Las modificaciones se acumulan: cada una parte del escenario que dejó la anterior.

### Modificaciones posibles

Las marcadas con ★ son más difíciles. Algunas son incompatibles entre sí.

Cambian la infraestructura:

* El servidor web hace de router/NAT y la base de datos deja de estar conectada a la red NAT.
* Dos servidores web con un balanceador de carga (HAProxy) delante. ★
* Un disco adicional para los datos de MariaDB, formateado y montado con Ansible. Comprueba que los datos sobreviven a recrear la máquina.
* Un servidor NAS (NFS) en otra máquina, donde se guardan los ficheros de la aplicación. ★
* PHP-FPM en otra máquina. ★
* Otra distribución (Ubuntu 26.04, Rocky Linux…) para una de las máquinas, con una receta que funcione con las dos. ★
* El servidor web conectado a `br0`, para acceder a él desde toda la red.

Cambian la configuración:

* Nginx con PHP-FPM en lugar de Apache.
* Otra aplicación o un CMS (WordPress, Drupal…) en otro virtual host.
* phpMyAdmin para gestionar la base de datos.
* Las contraseñas cifradas con Ansible Vault.
* Copias de seguridad automáticas de la base de datos, con la restauración probada.
* Otra modificación que propongas tú.

:::tip[¿Qué tienes que entregar en cada modificación?]
1. La propuesta validada (en la tarea de Redmine).
2. La documentación del cambio (ver más abajo), con el enlace a sus commits.
3. Un vídeo de 2 a 4 minutos con el cambio funcionando.
:::

## Cómo documentar cada entrega

En la tarea de Redmine, y siguiendo las [normas de formato](https://fp.josedomingo.org/formato.html):

1. **Qué se cambia y por qué.**
2. **Qué ficheros, recursos y roles se han modificado**, con el enlace a los commits.
3. **Cómo se despliega**, si cambia algo respecto a los dos comandos.
4. **Pruebas de funcionamiento**: los comandos y su salida (no capturas del terminal), y las capturas del navegador que hagan falta.

No basta con la lista de ficheros: tienen que verse las pruebas de que funciona.

## El vídeo

Un vídeo de **2 a 4 minutos**, con **explicación hablada**, que demuestre que entiendes lo que has hecho. No repitas el contenido de los ficheros, que ya están en el repositorio. Súbelo a YouTube (puede ser **oculto** / **no listado**) y añade la URL en la tarea de Redmine.

* **Entrega 1**: el escenario levantándose desde cero (puedes cortar las esperas) y la aplicación funcionando.
* **Modificaciones**: el cambio funcionando, explicando qué has modificado.
