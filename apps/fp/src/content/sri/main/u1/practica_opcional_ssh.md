---
title: "Práctica optativa 1: SSH hardening y fail2ban"
---

Sobre el escenario ya montado en la [Práctica: Configuración de un router (SNAT, DNAT y DHCP)](practica/), vamos a reforzar la seguridad del acceso SSH y a proteger el servicio frente a ataques de fuerza bruta.

Esta práctica es **optativa**: solo puede mejorar tu nota, nunca perjudicarla.

## Hardening de SSH

Sobre `router.tunombre.org` (o la máquina Linux del escenario que prefieras, siempre que tenga acceso SSH desde el exterior):

* Desactiva el acceso por SSH del usuario `root`.
* Desactiva por completo la autenticación por contraseña, dejando solo el acceso por clave pública.
* Cambia el puerto SSH por defecto a uno distinto de 22.
* Reinicia el servicio y comprueba que sigues pudiendo acceder con tu usuario y tu clave, en el nuevo puerto.

## fail2ban

* Instala `fail2ban` y configura una jail para el servicio SSH, adaptada al nuevo puerto.
* Ajusta los parámetros de baneo a valores bajos para poder hacer la demostración en poco tiempo.
* Provoca varios intentos fallidos de conexión desde otra máquina del escenario y comprueba que la IP queda baneada.
* Comprueba que la IP aparece en la lista de baneadas, y que tras el tiempo de baneo vuelve a poder conectar.

:::tip[Entrega]
1. Configuración de `sshd_config` con los tres cambios aplicados (`PermitRootLogin`, `PasswordAuthentication`, `Port`).
2. Configuración de la jail de `fail2ban` para SSH.
3. Captura de `fail2ban-client status sshd` mostrando una IP baneada.
4. Explica, para cada medida (desactivar root, desactivar contraseña, cambiar puerto, fail2ban), qué tipo de ataque mitiga y por qué.
:::

## Vídeo de demostración

Además de las capturas y la configuración, graba un **vídeo de 2 a 4 minutos** mostrando `fail2ban` funcionando en directo, con **narración en voz** explicando qué está pasando y por qué.

:::tip[Qué debe mostrar el vídeo]
1. Varios intentos de conexión SSH fallidos desde una máquina externa al nuevo puerto.
2. El momento en que `fail2ban` banea la IP.
3. Un intento de conexión mientras el baneo sigue activo, mostrando que se rechaza.
4. Una explicación breve de por qué cada medida (sin root, sin contraseña, puerto distinto, fail2ban) protege el servidor.
:::

Se valorará que la explicación hablada demuestre que entiendes por qué cada medida protege el servidor, no solo que el bloqueo ocurra en pantalla. Sube el vídeo a YouTube (puede ser como **oculto** / **no listado**) y añade la URL en la incidencia de Redmine junto con el resto de la entrega.
