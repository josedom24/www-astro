---
title: "Escritorio remoto con Debian GNOME"
date: 2026-05-03
slug: "blog/2026/05/escritorio-remoto-con-debian-gnome"
tags:
  - "Linux"
  - "RDP"
---

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp.png)

GNOME incluye desde hace tiempo soporte nativo para RDP, lo que permite acceder de forma remota a un escritorio Debian sin necesidad de instalar servidores adicionales como xrdp o configurar VNC manualmente. Sin embargo, GNOME ofrece **dos modos de acceso distintos** que es importante diferenciar antes de empezar, porque funcionan de forma muy diferente y la confusión entre ambos suele ser la causa de la mayoría de los problemas de configuración.

En este post vamos a ver qué son, en qué se diferencian y cómo configurarlos paso a paso. Para que funcione el acceso remoto es necesario que tengamos instalado el siguiente paquete:

```bash
sudo apt install gnome-remote-desktop
```

## Los dos modos: compartición frente a sesión remota

Si vamos a **Configuración → Sistema → Escritorio remoto**, encontramos dos pestañas:

- **Compartición de escritorio**
- **Inicio de sesión remoto**

A primera vista parecen lo mismo, pero hacen cosas distintas:

<!--more-->

* **Compartición de escritorio**: Comparte la sesión que ya está activa en la pantalla del equipo. Lo que se ve en remoto es exactamente lo mismo que se ve (o se vería) en el monitor físico de la máquina. **Requisito imprescindible:** debe haber un usuario con sesión gráfica iniciada. Si nadie está logueado, no hay nada que compartir.
* **Inicio de sesión remoto**: Funciona como el RDP de Windows: al conectar se crea una **sesión nueva e independiente**. No requiere que haya nadie logueado previamente, lo que lo hace ideal para servidores sin monitor.

## Detalle clave: usuario vs sistema

Aquí viene la diferencia técnica más importante, y la que explica la mayoría de los comportamientos extraños:

| Modo | Servicio | Comando para gestionarlo |
|------|----------|-------------------------|
| Compartición de escritorio | Daemon de **usuario** | `systemctl --user ...` |
| Inicio de sesión remoto | Daemon de **sistema** | `sudo systemctl ...` |

Es decir, ambos usan el binario `gnome-remote-desktop-daemon`, pero se ejecutan en contextos distintos:

- El de **compartición** corre dentro de la sesión del usuario, por eso necesita que esa sesión exista.
- El de **sesión remota** corre como servicio del sistema (con el flag `--system`), independiente de cualquier sesión de usuario.

Esto tiene implicaciones prácticas importantes a la hora de comprobar el estado o leer los logs:

```bash
# Para Compartición de escritorio
systemctl --user status gnome-remote-desktop
journalctl --user -u gnome-remote-desktop -f

# Para Inicio de sesión remoto
sudo systemctl status gnome-remote-desktop
sudo journalctl -u gnome-remote-desktop -f
```

## Configurando Compartición de escritorio

En **Configuración → Sistema → Escritorio remoto → Compartición de escritorio**:

1. Activamos **Compartición de escritorio**
2. Activamos **Control remoto** (si queremos poder mover el ratón y teclear)
3. Establecemos un **nombre de usuario** y una **contraseña**: las credenciales que pongamos aquí **no tienen nada que ver con los usuarios del sistema**. Son credenciales arbitrarias que solo sirven para autenticar la conexión RDP. 

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp1.png)

Para verificar que el servicio está activo y escuchando:

```bash
systemctl --user status gnome-remote-desktop
● gnome-remote-desktop.service - GNOME Remote Desktop
     Loaded: loaded (/usr/lib/systemd/user/gnome-remote-desktop.service; enabled)
     Active: active (running)
```

Y para confirmar que el puerto está abierto:

```bash
sudo ss -tlnp | grep 3389
```

## Configurando Inicio de sesión remoto

En la pestaña **Inicio de sesión remoto** del mismo apartado, desbloqueamos con la contraseña del administrador y:

1. Activamos **Inicio de sesión remoto**
2. Establecemos un usuario y contraseña RDP

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp2.png)

En este modo, al conectar desde el cliente RDP nos aparecerá la pantalla de login de GDM, donde tendremos que introducir las credenciales **reales del sistema** para iniciar una sesión nueva. Es decir, hay **dos pasos de autenticación**:

1. Las credenciales RDP (las que configuramos en GNOME Settings)
2. Las credenciales del usuario de Linux (en GDM, ya dentro de la sesión RDP)

Para verificar el estado del servicio del sistema:

```bash
sudo systemctl status gnome-remote-desktop
```

Es posible activar las dos opciones al mismo tiempo. En ese caso, cuando los dos servicios están activos, GNOME automáticamente asigna a cada uno un puerto distinto para que no entren en conflicto.

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp3.png)

Lo podemos verificar con:

```bash
sudo ss -tlnp 
...
LISTEN  0  10  *:3389  *:*  users:(("gnome-remote-de",pid=8487,fd=9))
LISTEN  0  10  *:3390  *:*  users:(("gnome-remote-de",pid=11562,fd=10))
```

Como podemos ver:

- El **3389** lo escucha el daemon de **sistema** (Inicio de sesión remoto)
- El **3390** lo escucha el daemon de **usuario** (Compartición de escritorio)

Si solo activamos uno, ese ocupará el 3389 por defecto.


## Conectando desde el cliente

Podemos usar cualquier cliente RDP: Remmina, GNOME Connections, KRDC, FreeRDP por línea de comandos, e incluso el cliente nativo de Microsoft Remote Desktop en Windows, macOS, Android o iOS. El protocolo es estándar.

A modo de ejemplo, con **Remmina**:

1. Creamos una nueva conexión RDP
2. En **Servidor** ponemos la IP y, si hace falta, el puerto: `172.22.11.23` o `172.22.11.23:3390`
3. Introducimos las credenciales que configuramos en GNOME

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp4.png)

Si conectamos al puerto del **Inicio de sesión remoto**, tras autenticarnos por RDP aparecerá GDM y deberemos iniciar sesión como un usuario del sistema. Si conectamos al puerto de **Compartición**, veremos directamente la sesión que está activa en la máquina.

![Escritorio remoto con Debian GNOME](/pledin/assets/2026/05/rdp5.png)

## Resumen

| | Compartición de escritorio | Inicio de sesión remoto |
|---|---|---|
| Tipo de sesión | Comparte la sesión activa | Crea sesión nueva |
| Requiere usuario logueado | Sí | No |
| Servicio | `systemctl --user` | `sudo systemctl` |
| Casos de uso | Soporte remoto, mostrar pantalla | Servidores headless, VMs |
| Análogo en Windows | Asistencia remota | Escritorio remoto (RDP) |

Lo más importante a recordar: **el servicio se ejecuta como `--user` o como sistema según el modo que usemos**, y eso determina cómo gestionarlo, dónde mirar los logs y qué requisitos tiene para funcionar.
