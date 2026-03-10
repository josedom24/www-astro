---
title: Servicios en GNU/Linux (Nivel Intermedio) (2011)
toc: false
---
## Objetivos

* Instalar y configurar servicios en GNU/Linux. (NIVEL INTERMEDIO)
* Configurar los componentes de un servidor de correo completo.
* Profundizar en el manejo del servidor web apache.
* Administrar de forma desatendida las zonas DNS mediante actualizaciones DHCP.
* Profundizar en el conocimiento de servicios en sistemas GNU/Linux, tratando aplicaciones habituales como Kerberos, LDAP o NFS4.
* Monitorizar el servidor y realizar tareas de actualización y copias de seguridad.

## Contenidos

* Servidor de correo con postfix, dovecot, spamassasin, clamav, amavis y squirrelmail.
* Servidor apache: Módulos. HTTPS
* Sincronización de ISC DHCP3 y Bind9: DNS dinámico.
* Sistema centralizado de cuentas: Kerberos, OpenLDAP y NFS4.
* Estado del sistema, actualizaciones, copias de seguridad.

[![](http://i.creativecommons.org/l/by-sa/3.0/88x31.png)](http://creativecommons.org/licenses/by-sa/3.0/)

Servicios en GNU/Linux (Nivel intermedio) de Alberto Molina Coballes, José Domingo Muñoz Rodríguez y José Luis Rodríguez Rodríguez tiene licencia [Creative Commons Reconocimiento-Compartir bajo la misma licencia 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/).

## 0.- Puesta en marcha

* [Preguntas y respuestas](doc/preguntas_y_respuestas/)
* [Instalación del sistema operativo](doc/instalacion_del_sistema_operativo/)

## 1.- Sincronización de ISC DHCP3 y Bind9: DNS dinámico

* [Índice: DNS dinámico](doc/indice_dns_dinamico/)
    * [Utilización de DNS dinámico en una red local](doc/utilizacion_de_dns_dinamico_en_una_red_local/)
    * [DNS dinámico](files/ddns.pdf)
    * [Tarea: DNS dinámico](doc/tarea_dns_dinamico/)

### Recursos de interés 

* [Documentación: Instalacion y configuración del servidor DHCP [dhcp.pdf]](http://www.josedomingo.org/web/mod/resource/view.php?id=2057)
* [Documentación: Servidor de Nombres de Dominio: bind9 [pdf]](http://www.josedomingo.org/web/mod/resource/view.php?id=2062)
* [Consultas a un servidor DNS con dig](doc/consultas_a_un_servidor_dns_con_dig/)
* [Esquema: Proceso [jpeg]](files/EsquemaProceso.jpeg)
* [Esquema: Servidor DHCP [jpeg]](files/EsquemaFicherosDHCP.jpeg)
* [Esquema: Servidor DNS [jpeg]](files/EsquemaFicherosDNS.jpeg)

## 2.- Sistema centralizado de cuentas: Kerberos, OpenLDAP y NFS4

* [Índice de Sistema centralizado de cuentas: Kerberos, OpenLDAP y NFS4](doc/indice_de_sistema_centralizado_de_cuentas_kerberos_openldap_y_nfs4/)
    * [Sistema de cuentas de usuario centralizadas con Kerberos 5, OpenLDAP y NFS4](files/krb_ldap.pdf)
    * [Tarea: Sistema de cuentas centralizadas](doc/tarea_sistema_de_cuentas_centralizadas/)

### Recursos de interés

* [Apache Directory Studio. The Eclipse based LDAP browser and directory client](http://directory.apache.org/studio/)
* [Wikipedia - Kerberos](http://es.wikipedia.org/wiki/Kerberos)

## 3.- Servidor apache: Módulos. HTTPS

* [Índice de Servidor apache: Módulos. HTTPS](doc/indice_de_servidor_apache_modulos_https/)
    * [Utilización de módulos en Apache](files/apache-modular.pdf)
    * [HTTPS en Apache2](files/https.pdf)
    * [Acceso cifrado en Joomla](files/joomla-cifrado.pdf)
    * [Tarea Servidor apache](doc/tarea_servidor_apache/)

### Recursos de interés

* [Esquema: Ficheros HTTPS](files/EsquemaFicherosHTTPS.jpeg)

## 4.- Servidor de correo

* [Índice](doc/indice/)
    * [Correo electrónico](files/correo-e.pdf)
    * [Tarea Correo](doc/tarea_correo/)

### Recursos de interés

* [Sitios recomendados](doc/sitios_recomendados/)
* [Esquema: Ficheros Postfix](files/1-estructuraficheros.jpg)
* [Esquema: Ficheros Postfix con smarthost](files/16-FicherosSmarthost.jpeg)
* [Esquema: Ficheros Postfix + Dovecot (y smarthost)](files/18-FicherosDovecot.jpeg)

## 5.- Gestión remota, estado del sistema, actualizaciones y copias de seguridad

* [Índice de gestión remota, estado del sistema, actualizaciones y copias de seguridad](doc/indice_de_gestion_remota_estado_del_sistema_actualizaciones_y_copias_de_seguridad/)
    * [Utilización elemental de ssh](files/ssh.pdf)
    * [Ejercicio: Gestión remota usando SSH](doc/ejercicio_gestion_remota_usando_ssh/)
    * [Ejercicio: Registro de actividades del sistema: logcheck](doc/ejercicio_registro_de_actividades_del_sistema_logcheck/)
    * [Ejercicio: Herramientas para gestionar las actualización de paquetes](doc/ejercicio_herramientas_para_gestionar_las_actualizacion_de_paquetes/)
    * [Ejercicio: Planificación y realización de copias de seguridad del servidor](doc/ejercicio_planificacion_y_realizacion_de_copias_de_seguridad_del_servidor/)
    * [Ejercicio: Sincronización de directorios con Unison](doc/ejercicio_sincronizacion_de_directorios_con_unison/)
    * [Tarea: Gestión remota, estado del sistema, actualizaciones y copias de seguridad](doc/tarea_gestion_remota_estado_del_sistema_actualizaciones_y_copias_de_seguridad/)

### Recursos de interés

* [Configuración de una tarea Cron](http://www.linuca.org/body.phtml?nIdNoticia=256)
* [Programación en BASH](http://xinfo.sourceforge.net/documentos/bash-scripting/bash-script-2.0.html)
