---
title: "Configurar la VPN (Tailscale/Headscale) — guía para el alumnado"
permalink: /vpn.html
---
# 

La VPN del IES Gonzalo Nazareno permite conectarse de forma segura a la red
interna del centro (NAS, Proxmox, OpenStack, máquinas virtuales,...) desde cualquier sitio.
Está basada en **Tailscale** (cliente) con un servidor de control propio
llamado **Headscale**, accesible en `vpn.gonzalonazareno.org`.

Una vez conectado, el equipo recibe una IP del rango `100.64.0.0/10` y puede
llegar a la red local del centro (`172.22.0.0/16`).

## 1. Solicitar la clave de acceso (auth key)

1. Entra en **Gestiona** con tu usuario.
2. En el menú superior ve a **Utilidades → Acceso VPN**.
3. Pulsa el botón **«Solicitar auth key por correo»**.

Al pulsarlo, Gestiona:

- Comprueba que tu usuario está dado de alta en el servidor VPN.
- Anula cualquier clave anterior que tuvieras sin usar.
- Genera una **clave nueva, de un solo uso y válida durante 24 horas**.
- Te la envía por correo a tu dirección del centro (la que figura en el
  LDAP).

> Si te aparece un mensaje diciendo que tu usuario **no está registrado** en
> el servidor VPN, contacta con el administrador para que te den de alta. La
> solicitud desde Gestiona solo funciona si ya existes en Headscale.

Revisa tu bandeja de entrada (y la carpeta de **spam**). En el correo
encontrarás la *auth key* y las instrucciones de conexión.

## 2. Instalar el cliente Tailscale

Instala Tailscale en tu dispositivo. Hay clientes para **Windows, macOS,
Linux, Android e iOS**:

- Descarga: <https://tailscale.com/download>

En Linux puedes instalarlo directamente con:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

## 3. Conectarte a la VPN

Usa la *auth key* que recibiste por correo. En Linux:

```bash
sudo tailscale up --accept-routes \
  --login-server https://vpn.gonzalonazareno.org \
  --authkey TU_AUTH_KEY
```

En **Windows**, la aplicación gráfica de Tailscale **no permite conectar** con
nuestro servidor `vpn.gonzalonazareno.org`, así que hay que hacerlo desde la
línea de comandos. Abre una **PowerShell** y ejecuta:

```powershell
tailscale up --login-server https://vpn.gonzalonazareno.org --authkey TU_AUTH_KEY --accept-routes
```

En macOS/Android/iOS, al abrir el cliente elige iniciar sesión con un
servidor personalizado e indica `https://vpn.gonzalonazareno.org`, usando la
auth key cuando te la pida.

### Comprobar que funciona

Una vez conectado ya puedes acceder a los recursos internos del centro. Por
ejemplo, prueba a hacer ping al router:

```bash
ping 172.22.0.1
```

También puedes comprobar el acceso a servicios web restringidos a la VPN,
como `https://proxmox.gonzalonazareno.org`  o
`https://openstack.gonzalonazareno.org`; fuera de la VPN y de la red de clase
devuelven **403 Forbidden**; conectado, se sirven con normalidad.

Comprueba que tienes una nueva interfaz de red con el direccionamiento `100.64.0.0/10`.

## 4. Desconectar y volver a conectar

Cuando termines de trabajar, desconéctate con:

```bash
sudo tailscale down
```

Para volver a conectarte más adelante **no necesitas una clave nueva**,
basta con:

```bash
sudo tailscale up
```

* Solo tendrás que pedir otra *auth key* en Gestiona si tu dispositivo deja de
estar registrado o caduca tu sesión.
* Puedes pedir todos los *auth key* que quieras para configurar la VPN en
distintos dispositivos, siempre que uses cada clave antes de solicitar la
siguiente: pedir una nueva anula la anterior si aún no la has usado.

## Importante

- La clave es de **un solo uso** y **caduca a las 24 horas**: úsala pronto
  tras solicitarla.
- **No la compartas** con nadie.
- Cada vez que pides una clave nueva en Gestiona, la anterior queda anulada.
- Cada usuario está aislado del resto de nodos conectados a la VPN: solo se
  puede llegar a la red local del centro, no a otros dispositivos de otros
  alumnos/profesores conectados.
- Si tienes cualquier problema, pregunta al profesor.

## Para saber más

Si quieres profundizar en cómo funciona una VPN mesh con Tailscale/Headscale,
puedes leer estos artículos:

- [VPN mesh con Headscale](https://www.josedomingo.org/pledin/2026/02/vpn-mesh-headscale/)
- [VPN mesh con Headscale: rutas y DNS](https://www.josedomingo.org/pledin/2026/02/vpn-mesh-headscale-rutas-dns/)
- [VPN mesh con Headscale: seguridad y control de acceso](https://www.josedomingo.org/pledin/2026/03/vpn-mesh-headscale-seguridad-control-acceso/)

