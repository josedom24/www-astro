---
title: "Práctica: Servidor de correos"
---

## Parte 1: Servidor de correos en los servidores de clase

### Ejercicio 1: Envío local, entre usuarios del mismo servidor

Instala y configura un servidor de correo en **horus**. El nombre del sistema de correo será tu nombre de dominio `tunombre.gonzalonazareno.org`.

Utilizando la utilidad `mail` (paquete `bsd-mailx`) manda un correo desde un usuario del servidor a otro usuario del servidor. El usuario destinatario debe leer el correo con el mismo programa.

:::tip[¿Qué tienes que entregar?]
1. Muestra el log para asegurarse que se ha enviado el correo.
2. Captura de pantalla donde se vea la lectura del correo.
:::		


### Ejercicio 2: Envío de correo desde usuarios del servidor a correos de internet

Configura tu servidor de correo para que use como relay el servidor de correo de nuestra red `mail.gonzalonazareno.org`. Con la utilidad `mail` envía un correo a tu cuenta personal de gmail, hotmail,... 

Muestra el log del sistema donde se comprueba que el correo se ha enviado con éxito.

Comprueba las cabeceras del correo que has recibido e indica donde vemos los servidores por los que ha pasado el correo.

:::tip[¿Qué tienes que entregar?]
1. Muestra el log para asegurarse que se ha enviado el correo.
2. Captura de pantalla donde se vea la lectura del correo.
:::		


### Ejercicio 3: Recibir correos desde internet a usuarios del servidor

En este ejercicio debes responder desde tu cuenta de correo personal al correo que recibiste en el ejercicio anterior. Recuerda que para que todo funcione debes indicarle al profesor el nombre de tu dominio para que configure de manera adecuada el parámetro `relay_domains` en `macaco.gonzalonazareno.org`. Además debes configurar de manera adecuada el registro MX de tu servidor DNS.


:::tip[¿Qué tienes que entregar?]
1. Muestra el log del sistema donde se comprueba que el correo se ha recibido con éxito.
2. Captura de pantalla donde se vea la lectura del correo.
:::		


### Ejercicio 4: Envío de correo desde otros servidores de nuestra red local 

En la mayoría de las ocasiones cuando trabajamos con servidores, es necesario que estos servidores nos manden correos de notificación. Además nuestras aplicaciones web también pueden enviar correos. En este ejercicio vamos a configurar determinados servicios y aplicaciones web para que nos envíen correo desde los servidores de nuestro escenario de OpenStack.

#### Simulación de cortafuegos

En las infraestructuras locales, normalmente sólo se permite enviar correos desde el servidor de correos "oficial". Para simular este comportamiento añade al cortafuegos de `ra` estas reglas:

```
# Permitir SMTP solo desde 192.168.0.2 (tráfico que pasa por el router)
iptables -A FORWARD -p tcp --dport 25 -s 192.168.0.2 -j ACCEPT
iptables -A FORWARD -p tcp --dport 25 -d 192.168.0.2 -j ACCEPT
# Bloquear SMTP para todas las demás máquinas
iptables -A FORWARD -p tcp --dport 25 -j DROP

# Bloquear intentos de conexión al puerto 25 desde el propio router
iptables -A OUTPUT -p tcp --dport 25 -d 192.168.0.2 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 25 -j DROP
```

Esto evita que cualquier máquina a excepción de nuestro servidor de correos pueda mandar correos.

#### Instalación de un servidor SMTP en nuestro servidores

Muchos de los servicios que podemos instalar en un servidor manda correos a usuarios del servidor, normalmente al `root`. Para que esto ocurra necesitamos instalar un servidor SMTP en nuestro servidor. En nuestro caso vamos a instalar `postfix`. En la instalación de `postfix` tendrás que tener en cuenta los siguientes aspectos:

* Este servidor de correo va a utilizar como relay a nuestro servidor de correo "oficial" `horus.tunombre..gonzalonazareno.org` que es el único servidor que puede mandar correos.
* Este servidor no va a recibir correos desde el exterior.
* Durante la instalación escoge la opción **Satellite system**. En este modo, Postfix **no recibe correo desde la red** y únicamente se encarga de reenviar los mensajes al servidor de correo central.
* Cuando se indica el nombre del sistema de correo en este tipo de servidor se suele poner **el nombre del equipo**. Por un lado porque así diferenciamos correos que vienen de otro servidor SMTP, y además como normalmente no recibe correos no es necesario hacer ninguna configuración adicional para que los correos lleguen a este servidor.
* Durante la configuración os preguntará el servidor relay, para rellenar el parámetro `relay_host`, en nuestro caso, `horus.tunombre..gonzalonazareno.org`.
* Para que podamos usar nuestro servidor de correo `horus` desde otros servidores tenemos que darle permiso. Para ello añade en el parámetro `mynetworks` las redes desde las que podemos mandar correos.

:::tip[¿Qué tienes que entregar?]
1. La configuración del cortafuegos en `ra` donde se vea que sólo puede mandar correos nuestro servidor de correos "oficial".
2. Desde otra máquina, por ejemplo `ra`, con la utilidad `mail` manda un correo al exterior.
3. Captura de pantalla donde se vea que has recibido el correo desde `ra.tunombre.gonzalonazareno.org`.
:::	

### Ejercicio 5: Envío de correos de notificación

En el servidor de correos con el que estamos trabajando y has instalado el nuevo servidor de correos vamos a instalar un servicio que comprueba las actualizaciones y nos manda un correo avisando de los paquetes que tenemos que actualizar. Este servicio se llama `apticron`. Veamos algunas cosas:

* Instala el servicio `apticron`.
* Este programa por defecto manda correos al usuario `root`.
* Este correo crea una tarea cron definida en `/etc/cron.d/apticron`. Todos los días a una determinada hora te manda un correo con las actualizaciones de paquetes que tienes que hacer.
* Si no quieres esperar a que se ejecuta la tarea del cron, puedes ejecutar el servicio manualmente `sudo apticron`.

#### Si apticron no envía correo

Si tienes los paquetes actualizados `apticron` no envía correos. Para simular el envío de correo a `root` vamos a usar el cron. Edita el cron con `sudo crontab -e` y pon lo siguiente:

```
MAILTO="root@localhost"
* * * * * echo "Message from cron"
```

:::tip[¿Qué tienes que entregar?]
1. Ejecuta el servicio manualmente y entrega la captura de pantalla donde se comprueba que el usuario `root` ha recibido el correo.
:::	

#### Redirecciones

Hasta ahora todo funciona muy bien, sin embargo el administrador del servidor debe entrar en el servidor y comprobar manualmente si tiene correo el usuario `root`. Estaría muy bien que ese correo lo recibieramos en una dirección de correo externa. Para ello vamos a usar las **redirecciones**.

Una **redirección** se utiliza para enviar el correo que llegue a un usuario a una cuenta de correo exterior. Para usuarios reales las redirecciones se definen en el fichero `~/.forward` y el formato de este fichero es simplemente un listado de cuentas de correo a las que se quiere redirigir el correo.

Crea un fichero `.forward` en el home del usuario `root` con tu dirección de correo electrónico y comprueba que ahora los correos que recibe el usuario `root` te llegan a tu correo.

:::tip[¿Qué tienes que entregar?]
1. Ejecuta de nuevo el servicio `apticron` y comprueba que has recibido el correo en la dirección que has indicado.
:::	

### Ejercicio 6: Envío de corros desde una aplicación

Tenemos que tener en cuenta que muchas aplicaciones que instalamos en nuestros servidores pueden enviar correos:

* CMS que mandan notificaciones, por ejemplo para recuperar las contraseñas.
* Sistemas de monitorización que mandan correos de alarmas.
* Script de administración que hacen comprobaciones y mandan correos de notificación.

En este ejercicio vamos a instalar dos aplicaciones:

#### Aplicación para analizar los logs

El siguiente script en python comprueba los logs del sistema las últimas 24 horas y mandan un resumen de los logs cuyo nivel de error es de 0 a 4, es decir los errores críticos. Si ejecutamos este script con un cron diario en todos los servidores de nuestra instalación recibiremos un correo diario con los logs de errores del último día.

El script es el siguiente:

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import subprocess
import os

# Variables
TO_EMAIL = ""
FROM_EMAIL = ""
SUBJECT = "Nombre del servidor - Reporte de Logs de las últimas 24 horas"
LOG_FILE = "/tmp/log_report.log"
LOG_FILE_UTF8 = "/tmp/log_report_utf8.log"

# Filtrar los logs de las últimas 24 horas con prioridad entre 0-4
subprocess.run(["journalctl", "--since", "24 hours ago", "-p", "0..4"], stdout=open(LOG_FILE, 'w'))

# Leer el contenido del archivo de log
with open(LOG_FILE, 'r') as file:
    log_content = file.read()

# Configurar el correo
msg = MIMEMultipart()
msg['From'] = FROM_EMAIL
msg['To'] = TO_EMAIL
msg['Subject'] = SUBJECT

# Cuerpo del mensaje con el contenido del log
body = f"Adjunto se encuentra el reporte de logs de las últimas 24 horas:\n\n{log_content}"
msg.attach(MIMEText(body, 'plain'))

# Enviar el correo usando Postfix
try:
    server = smtplib.SMTP('localhost')  # Usar el servidor de correo local (Postfix)
    server.send_message(msg)
    print("Correo enviado correctamente")
except Exception as e:
    print(f"Error al enviar el correo: {e}")
finally:
    server.quit()

# Eliminar el archivo de log temporal
os.remove(LOG_FILE)
```

Tienes que configurar las variables `TO_EMAIL` y `FROM_EMAIL`. Además , pon el nombre del servidor en la variable `SUBJECT`.

A continuación, crea la siguiente tarea en el cron del `root`:

```
crontab -e
...
0 14 * * * /usr/bin/python3 /root/log_report.py > /dev/null 2>&1
```

Y todos los días a las 14:00 recibirás un correo con la monitorización de los servidores.


:::tip[¿Qué tienes que entregar?]
1. Muestra la tarea cron que has realizado.
2. Captura de pantalla de los correos que has recibido de los distintos servidores.
:::	


#### Aplicación check_ssl_expiry


El script lo encontramos en el repositorio [check_ssl_expiry](https://github.com/josedom24/check_ssl_expiry), es un Script Bash que comprueba los días restantes de los certificados de las páginas web listadas en un archivo y envía un correo si faltan 60, 30, 15 o menos de 7 días para su expiración. **Este script lo ejecutas en un solo servidor**.

:::tip[¿Qué tienes que entregar?]
1. Muestra la tarea cron que has realizado.
2. Captura de pantalla el correo que has recibido indicando las urls de tus páginas web en la vps. Si es necesario modifica la variable `THRESHOLDS` para ajustar los periodos.
:::	

## Parte 2: Servidor de correos en el VPS

Instala y configura de manera adecuada el servidor de correos en tu VPS. El nombre del servidor de correo será `nompre_vps.tudominio.algo` (este es el nombre que deberá aparecer en el registro MX).

### Gestión de correos desde el servidor

El envío y recepción se hará desde el servidor usando la herramienta `mail`. Debes realizar las siguientes tareas:


* Configura el registro SPF en tu DNS para autorizar el envío de correos desde tu VPS. Muestra la configuración del registro SPF en tu DNS. 
* Configura de manera adecuada DKIM es tu sistema de correos. Comprueba el registro DKIM en la página [DKIM Record Lookup](https://mxtoolbox.com/dkim.aspx). 
* Configura de manera adecuada el registro DMARC. Muestra la configuración del registro que has realizado. Utiliza la página [DMARC Check Tool](https://mxtoolbox.com/dmarc.aspx) para verificar que el registro es correcto.
* Realiza un envío de correo desde tu servidor al exterior.
* Envía un correo desde el exterior (gmail, hotmail,...) a tu servidor local. 
* Vamos a configurar distintas mediadas para luchar contra el SPAM: Configura de manera adecuada Postfix para que tenga en cuenta el registro SPF de los correos que recibes (no hace falta configurar la comprobación de DKIM porque se hace automáticamente). 

:::tip[Entrega]
1. Realiza una consulta con `dig` para mostrar la configuración de tu registro SPF.
2. Envía un correo desde tu servidor a la dirección de correo que te indica la página [Learn and Test DMARC](https://www.learndmarc.com/) y envía una captura de pantalla de la comprobación de que tu configuración SPF, DKIM y DMARC funcionan (**PASS**).
3. Muestra el log donde se demuestre el envío de correo. Una captura de pantalla donde se vea que el correo ha llegado. Y una comprobación en las cabeceras del correo que muestre que el receptor ha comprobado tus registros SPF, DKIM y DMARC.
4. Muestra el log donde se vea la recpción del correo desde el exterior. Muestra cómo has leído el correo. Muestra el registro MX de tu dominio con una consulta con `dig`.
5. Muestra el log del correo para comprobar que se está haciendo el testeo del registro SPF del correo que recibes.
:::

### Gestión de correos desde un cliente

Ahora vamos a usar un cliente de correo para enviar y recibir correos usando nuestro servidor.

* Configura el buzón de los usuarios de tipo `Maildir`. Envía un correo a tu usuario y comprueba que el correo se ha guardado en el buzón `Maildir` del usuario del sistema correspondiente. Recuerda que ese tipo de buzón no se puede leer con la utilidad `mail`.
* Instala configura dovecot para ofrecer el protocolo IMAP. Configura dovecot de manera adecuada para ofrecer autentificación y cifrado.
    Para realizar el cifrado de la comunicación crea un certificado en LetsEncrypt para tu dominio `mail.tudominio.es`. Recuerda que para el ofrecer el cifrado tiene varias soluciones:
    * **IMAP con STARTTLS**: STARTTLS transforma una conexión insegura en una segura mediante el uso de SSL/TLS. Por lo tanto usando el mismo puerto 143/tcp tenemos cifrada la comunicación.
    * **IMAPS**: Versión segura del protocolo IMAP que usa el puerto 993/tcp.
    * Ofrecer las dos posibilidades.
    Elige una de las opciones anterior para realizar el cifrado. 
*  Configura de manera adecuada postfix para que podamos mandar un correo desde un cliente remoto. La conexión entre cliente y servidor debe estar autentificada con SASL usando dovecot y además debe estar cifrada. Para cifrar esta comunicación puedes usar dos opciones:
    * **ESMTP + STARTTLS**: Usando el puerto 567/tcp enviamos de forma segura el correo al servidor.
    * **SMTPS**: Utiliza un puerto no estándar  (465) para SMTPS (Simple Mail Transfer Protocol Secure). No es una extensión de smtp. Es muy parecido a HTTPS.
    Elige una de las opciones anterior para realizar el cifrado. Y
* Configura un cliente webmail (puedes usar docker) para el envío y recepción de correos. 
* Prueba de envío de correo. En esta [página](https://www.mail-tester.com/) tenemos una herramienta completa y fácil de usar a la que podemos enviar un correo para que verifique y puntúe el correo que enviamos. 
* **Optativo**: 
    * Configura un sistema antispam. 
    * Si tu VPS tiene más de 1Gb de RAM, instala un antivirus.

:::tip[Entrega]
1. Indica qué método has usado para recibir el correo de forma autentificada y cifrada. Detalla la configuración que has realizado. Muestra la configuración de un cliente de correo (evolution, thunderbird, ...) y muestra como puedes leer los correos enviado a tu usuario.
2. Indica que método has usado para enviar correo de forma autentificada y cifrada. Detalla la configuración que has realizado. Muestra la configuración de un cliente de correo (evolution, thunderbird, ...) y muestra como puedes enviar los correos.
3. Muestra el método de instalación del cliente webmail. Realiza una prueba de envío y recepción de correos con el webmail.
4. Captura la pantalla del envío de correo al página mail-tester mostrando la puntuación que has sacado.
5. Si has hecho la parte optativa: Usando el ejemplo de correo SPAM que hemos visto en clase, mándatelo y demuestra que tu servidor lo ha marcado como SPAM.
6. Si has hecho la parte optativa: Usando el ejemplo de correo con virus que hemos visto en clase, mándatelo y demuestra que tu servidor lo ha detectado.
:::
