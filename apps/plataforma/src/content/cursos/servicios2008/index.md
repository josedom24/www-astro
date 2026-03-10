---
title: Introducción a los Servicios en GNU/Linux (2008)
toc: false
---

## Contenidos

1. Introducción a los servicios en GNU/Linux
2. DNS con Bind9
3. DHCPv3
4. OpenLDAP
5. Correo electrónico
6. FTP
7. Puesta en marcha de un servidor LAMP: Linux, Apache, MySQL y PHP
8. Acceso compartido a Internet: proxy y NAT
9. Ficheros en red: NFS, CIFS y mDNS
10. Cortafuegos con iptables

![](img/plantilla0.jpg)


[![](http://i.creativecommons.org/l/by-sa/3.0/88x31.png)](http://creativecommons.org/licenses/by-sa/3.0/)

Introducción a los servicios en GNU/Linux de Alberto Molina Coballes y José Domingo Muñoz Rodríguez tiene licencia [Creative Commons Reconocimiento-Compartir bajo la misma licencia 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/). La versión inicial de este trabajo está en [www.loracep.org](http://www.loracep.org/moodle/course/view.php?id=27).

* [Guia General](files/GuiaGeneral.pdf)
* [Contenido del curso](doc/contenido_del_curso/)
* [Solicitud ayuda por desplazamiento](files/BOLSA_DE_AYUDA.pdf)
* [Actividad no presencial](doc/actividad_no_presencial/)
* [Curso completo comprimido para exportar a plataforma Moodle](http://www.josedomingo.org/web/file.php/1/cursos_comprimidos/Introduccion_a_los_Servicios_en_GNULinux.zip)

![](img/plantilla1.jpg)

## Introdución

* [Índice de introducción](doc/indice_de_introduccion/)

### Documentación

* [Manejar paquetes en Debian](doc/manejar_paquetes_en_debian/)
* [Estructura básica del paquete "servicio"](doc/estructura_basica_del_paquete_servicio/)

### Enlaces recomendados

* [APT HOWTO](http://www.debian.org/doc/manuals/apt-howto/index.es.html#contents)
* [Manual de APTITUDE](http://www.esdebian.org/foro/22093/tutorial-aptitude)
* [All about Linux - A concise apt-get/dpkg primer for new Debian users](http://linuxhelp.blogspot.com/2005/12/concise-apt-get-dpkg-primer-for-new.html)
* [Debian-administration - An introduction to run-levels](http://www.debian-administration.org/articles/212)
* [LinuxTotal - Manual básico de administración de procesos](http://www.linuxtotal.com.mx/index.php?cont=info_admon_012)
* [Configuración de la red Ethernet en Debian](http://ftp.cl.debian.org/man-es/ethernet.html)

### Prácticas

* [Uso básico de APT](doc/uso_basico_de_apt/)
* [Trabajando con los repositorios](doc/trabajando_con_los_repositorios/)
* [Más opciones de APT](doc/mas_opciones_de_apt/)
* [Trabajando con paquetes. Instalando servicios](doc/trabajando_con_paquetes_instalando_servicios/)
* [Niveles de ejecución. Arranque y parada de los servicios](doc/niveles_de_ejecucion_arranque_y_parada_de_los_servicios/)
* [Logs: obteniendo información del sistema](doc/logs_obteniendo_informacion_del_sistema/)
* [Configuración básica de red](doc/configuracion_basica_de_red/)

![](img/plantilla2.jpg)

## Servidor DNS

* [Índice de DNS](doc/indice_de_dns/)

### Documentación

* [dns.pdf](files/dns.pdf)

### Enlaces recomendados

* [Javier Smaldone - Cómo funciona el DNS](http://blog.smaldone.com.ar/2006/12/05/como-funciona-el-dns/)

### Prácticas

* [Ficheros importantes en la resolución de nombres](doc/ficheros_importantes_en_la_resolucion_de_nombres/)
* [Consultas a un servidor DNS con dig](doc/consultas_a_un_servidor_dns_con_dig/)
* [Instalación y configuración de DNSmasq como DNS cache/forward en una red local](doc/instalacion_y_configuracion_de_dnsmasq_como_dns_cache_forward_en_una_red_local/)
* [Instalación y configuración de Bind9 como servidor DNS master en una red local](doc/instalacion_y_configuracion_de_bind9_como_servidor_dns_master_en_una_red_local/)

![](img/plantilla3.jpg)

## Servidor DHCP

* [Indice de DHCP](doc/indice_de_dhcp/)

### Documentación

* [Desde lo alto del Cerro - dns dinámico](http://albertomolina.wordpress.com/dns-dinamico/)

### Enlaces recomendados

* [Servidor DHCP](files/DHCP.pdf)
* [Wikipedia - APIPA](http://es.wikipedia.org/wiki/APIPA)

### Prácticas

* [Instalación del servidor DHCP](doc/instalacion_del_servidor_dhcp/)
* [Configuración del servidor DHCP](doc/configuracion_del_servidor_dhcp/)
* [DNS dinámico](doc/dns_dinamico/)
* [Configuración de un servidor PXE para instalación por red](doc/configuracion_de_un_servidor_pxe_para_instalacion_por_red/)
* [postfix_ldap_ou.ldif](doc/postfix_ldap_ou_ldif/)

![](img/plantilla4.jpg)

## Servidor LDAP

* [Índice de OpenLDAP](doc/indice_de_openldap/)

### Documentación

* [Autenticación LDAP en GNU/Linux](files/autenticacion_ldap.pdf)

### Enlaces recomendados

* [Wikipedia - Listado de servidores LDAP](http://en.wikipedia.org/wiki/List_of_LDAP_software#Server_software)
* [Zytrax.com - LDAP - Object Classes and Attributes](http://www.zytrax.com/books/ldap/ape/)
* [Esquemas de LDAP](http://technology.artifact-software.com/LDAPSchema/ldapschema.html)

### Prácticas

* [Crear manualmente un usuario en UNIX](doc/crear_manualmente_un_usuario_en_unix/)
* [Crear la estructura básica de un directorio para la autenticación de usuarios](doc/crear_la_estructura_basica_de_un_directorio_para_la_autenticacion_de_usuarios/)
* [Configurar un equipo cliente para autenticación mediante LDAP](doc/configurar_un_equipo_cliente_para_autenticacion_mediante_ldap/)

![](img/plantilla5.jpg)

## Servidor de Correo Electrónico

* [Índice de correo electrónico](doc/indice_de_correo_electronico/)

### Documentación 

* [Servidor de correo en GNU/Linux con postfix](files/correo-e.pdf)

### Enlaces recomendados

* [Ejemplo de una comunicación SMTP (wikipedia)](doc/ejemplo_de_una_comunicacion_smtp_wikipedia/)
* [Appendix E: OpenLDAP authldap.schema](http://www.zytrax.com/books/ldap/ape/courier.html)

### Prácticas

* [Instalación y confuguración básica de postfix](doc/instalacion_y_confuguracion_basica_de_postfix/)
* [Alias y redirecciones](doc/alias_y_redirecciones/)
* [Servidor IMAP y POP](doc/servidor_imap_y_pop/)
* [webmail](doc/webmail/)
* [Configuración de postfix para el uso de usuarios virtuales de un directorio LDAP](doc/configuracion_de_postfix_para_el_uso_de_usuarios_virtuales_de_un_directorio_ldap/)
* [Configurar postfix para enviar a través de un relay host autenticado](doc/configurar_postfix_para_enviar_a_traves_de_un_relay_host_autenticado/)

![](img/plantilla6.jpg)

# Servidor FTP

* [Indice de servidor FTP](doc/indice_de_servidor_ftp/)

### Documentación

* [Servidor FTP: proFTPd](files/proftp2.pdf)

### Enlaces recomendados

* [Instalar proFTPd anónimo bajo Debian](http://null-lab.hacklabs.org/mediaw/index.php/Instalar_Proftp_anonimo_bajo_Debian_en_3,56_minutos)

### Prácticas

* [Instalación y puesta en marcha del servidor proFTPd](doc/instalacion_y_puesta_en_marcha_del_servidor_proftpd/)
* [Servidor proFTPd: Usuarios virtuales con LDAP](doc/servidor_proftpd_usuarios_virtuales_con_ldap/)
* [Creación de un FTP Anónimo](doc/creacion_de_un_ftp_anonimo/)

![](img/plantilla7.jpg)

## LAMP: Linux, Apache, mySql, PHP

* [Indice de LAMP](doc/indice_de_lamp/)

### Documentación

* [Presentación Servidor Web](files/pres_apache.pdf)
* [Servidor Apache2. Virtual Hosting. Awstats y webalizer.](files/apache.pdf)
* [Instalación de Apache+PHP+MySQL](doc/instalacion_de_apache_php_mysql/)
* [Presentación: Introducción a la programación de páginas Web dinámicas](files/pressphp.ppt)
* [Instalación de un CMS: Moodle, Joomla](files/web_dinamica2.pdf)

### Enlaces recomendados

* [Qué significa LAMP...](http://es.wikipedia.org/wiki/LAMP)
* [Guía básica sobre Apache](http://dns.bdat.net/documentos/apache/)
* [Manual de referencia de PHP](http://es2.php.net/manual/es/index.php)
* [Manual de referencia de MySql](http://dev.mysql.com/doc/refman/5.0/es/index.html)
* [Instalación de moodle](http://www.cepazahar.org/recursos/file.php/2/tema6/cap06/moodle.html)
* [moodle.org - LDAP authentication](http://docs.moodle.org/en/LDAP_authentication)

### Prácticas

* [Virtual Hosting: Creación y gestión de dos subdominios](doc/virtual_hosting_creacion_y_gestion_de_dos_subdominios/)
* [Uso de módulos en Apache2: userdir.mod](doc/uso_de_modulos_en_apache2_userdir_mod/)
* [Configuración de awstats para virtual hosting](doc/configuracion_de_awstats_para_virtual_hosting/)
* [Instalación de un CMS: Moodle](doc/instalacion_de_un_cms_moodle/)
* [Autenticación mediante LDAP en moodle](doc/autenticacion_mediante_ldap_en_moodle/)

### Practicas adicionales

* [Instalación de phpmyadmin](doc/instalacion_de_phpmyadmin/)
* [Instalación de phpldapadmin](doc/instalacion_de_phpldapadmin/)
* [Instalación de squirrelmail](doc/instalacion_de_squirrelmail/)

![](img/plantilla8.jpg)

## NAT y Proxy

* [Índice de NAT y proxy](doc/indice_de_nat_y_proxy/)

### Documentación

* [Desde lo alto del Cerro - NAT con iptables](http://albertomolina.wordpress.com/2009/01/09/nat-con-iptables/)
* [Squid, un proxy caché para GNU/Linux](files/squid.pdf)

### Enlaces recomendados

* [Infosofía - Servidor proxy de archivos Debian, Approx](http://infosofia.blogdns.com:8089/2008/01/24/servidor-proxy-de-archivos-debian-approx/)

### Prácticas

* [Configuración de SNAT para la red virtual](doc/configuracion_de_snat_para_la_red_virtual/)
* [Instalación y configuración de squid](doc/instalacion_y_configuracion_de_squid/)
* [Proxy transparente con squid e iptables](doc/proxy_transparente_con_squid_e_iptables/)
* [Configuración de un proxy APT con approx](doc/configuracion_de_un_proxy_apt_con_approx/)

![](img/plantilla9.jpg)

## NFS, SAMBA y Mdns

* [Índice de ficheros en red: NFS, SAMBA y Mdns](doc/indice_de_ficheros_en_red_nfs_samba_y_mdns/)

### Documentación

* [Desde lo alto del Cerro - Utilizando mdns en una red local](http://albertomolina.wordpress.com/2008/07/07/utilizando-mdns-en-una-red-local/)
* [Desde lo alto del Cerro - Compartir ficheros con avahi](http://albertomolina.wordpress.com/2008/07/09/compartir-ficheros-con-avahi/)

### Enlaces recomendados

* [wikipedia.org - Portmap](http://en.wikipedia.org/wiki/Portmap)
* [Como compartir directorios NFS con Debian](http://usuarios.lycos.es/caralbornozc/nfs.pdf)
* [Usando SAMBA](http://es.tldp.org/Manuales-LuCAS/USANDO-SAMBA/usando-samba.pdf)
* [Samba HOWTO](http://us1.samba.org/samba/docs/man/Samba-HOWTO-Collection/)

### Prácticas

* [Compartir ficheros usando NFS](doc/compartir_ficheros_usando_nfs/)
* [Centralización de usuarios usando LDAP y NFS](doc/centralizacion_de_usuarios_usando_ldap_y_nfs/)
* [Compartir ficheros usando SAMBA](doc/compartir_ficheros_usando_samba/)
* [Compartir fichero con Mdns y avahi](doc/compartir_fichero_con_mdns_y_avahi/)

![](img/plantilla10.jpg)

## Cortafuegos con iptables

* [Índice de cortafuegos: iptables](doc/indice_de_cortafuegos_iptables/)

### Documentación

* [Script de iptables con política por defecto DROP](files/firewall.sh)

### Enlaces recomendados

* [Pello Altadill - iptables. Manual práctico](http://es.tldp.org/Manuales-LuCAS/doc-iptables-firewall/doc-iptables-firewall-html/)

### Prácticas

* [Cortafuegos elemental con política por defecto ACCEPT](doc/cortafuegos_elemental_con_politica_por_defecto_accept/)
* [Cortafuegos con política por defecto DROP](doc/cortafuegos_con_politica_por_defecto_drop/)
