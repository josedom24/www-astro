---
title: "Unidad 1: ¿Qué tengo que saber?"
description: "Lista de comprobación de lo que hay que saber y saber hacer en la unidad de configuración básica de un servidor y DHCP."
---

Usa esta lista para repasar la unidad. Ve marcando lo que ya dominas: se guarda en tu navegador, así que lo verás marcado cuando vuelvas desde el mismo equipo. Si no puedes marcar algún punto, vuelve a la presentación o a la práctica correspondiente.

## Acceso seguro con SSH

- [ ] ¿Sé diferenciar el cifrado simétrico del asimétrico y para qué usa SSH cada uno?
- [ ] ¿Sé explicar qué es firmar con la clave privada y cómo lo verifica el servidor con la clave pública (el reto criptográfico)?
- [ ] ¿Sé explicar, paso a paso, cómo se autentica un usuario con clave pública?
- [ ] Identifico dónde debe estar cada clave: la privada en el cliente y la pública en el `~/.ssh/authorized_keys` del usuario en el servidor.
- [ ] Sé explicar por qué la clave pública es más segura que la contraseña, aunque el canal SSH ya vaya cifrado.
- [ ] Sé generar un par de claves con `ssh-keygen` e instalar la pública con `ssh-copy-id`.
- [ ] Sé acceder a una máquina interna saltando por el router, y explicar para qué sirve `ssh -A` y por qué es mejor que copiar la clave privada en el router.

## Administración con sudo

- [ ] Sé explicar qué problemas tiene trabajar directamente como root y qué aporta `sudo` (mínimo privilegio, auditoría, control por usuario o grupo).
- [ ] Sé diferenciar `/etc/sudoers` y `/etc/sudoers.d/`, y por qué se edita con `visudo`.
- [ ] Sé configurar un usuario para que use `sudo` sin contraseña.
- [ ] Sé comprobar que `sudo` no pide la contraseña, y no que la recuerda de una ejecución anterior (`sudo -k`).

## Nombre del equipo

- [ ] ¿Sé diferenciar el hostname del FQDN?
- [ ] Identifico qué contiene `/etc/hostname` y qué debe tener la entrada del equipo en `/etc/hosts`.
- [ ] Sé configurar el nombre y el FQDN de una máquina (con `hostnamectl`) y comprobarlo con `hostname` y `hostname -f`.

## Configuración de red

- [ ] Identifico los parámetros que necesita un equipo para comunicarse: interfaz, IP, máscara, puerta de enlace y DNS.
- [ ] ¿Sé diferenciar el direccionamiento estático del dinámico, y cuándo conviene cada uno?
- [ ] Identifico qué mecanismo de red usa cada sistema (ifupdown, NetworkManager, systemd-networkd, Netplan) y dónde está su configuración.
- [ ] Sé configurar una interfaz con IP estática y con DHCP, de forma que se mantenga al reiniciar.
- [ ] Sé consultar la configuración activa: direcciones (`ip a`), rutas (`ip r`) y DNS.

## Resolución de nombres

- [ ] Sé explicar qué es NSS y qué indica la línea `hosts:` de `/etc/nsswitch.conf`.
- [ ] ¿Sé diferenciar `/etc/hosts` de `/etc/resolv.conf`?
- [ ] Sé explicar qué es systemd-resolved y por qué `/etc/resolv.conf` apunta a veces a `127.0.0.53`.
- [ ] ¿Sé diferenciar las herramientas que consultan directamente el DNS (`dig`, `host`) de las que siguen el orden de NSS (`getent hosts`)?
- [ ] Sé usar la resolución estática para acceder a un servicio por su nombre.

## Router Linux: SNAT y DNAT

- [ ] Sé explicar qué es el IP Forwarding y activarlo de forma persistente en Debian 13.
- [ ] ¿Sé diferenciar SNAT de DNAT: qué dirección cambia cada uno, en qué cadena va y en qué sentido va el tráfico?
- [ ] Sé explicar cuándo hay que usar MASQUERADE en lugar de SNAT.
- [ ] Sé explicar la relación entre iptables y nftables (`iptables-nft`).
- [ ] Sé configurar las reglas de SNAT para que las redes internas salgan a Internet, y de DNAT para publicar un servicio interno.
- [ ] Sé hacer que las reglas sean persistentes y comprobar que se aplican al arrancar el router.
- [ ] Sé explicar por qué desde el exterior se llega a un servidor interno a través del router, y no directamente.

## El protocolo DHCP

- [ ] Sé explicar para qué sirve DHCP y en qué puertos trabajan el servidor y el cliente.
- [ ] Identifico los cuatro mensajes del proceso DORA, quién envía cada uno y si va por broadcast o unicast.
- [ ] Sé explicar para qué sirven los pasos REQUEST y ACK cuando hay varios servidores DHCP en la red.
- [ ] Identifico los estados del cliente (INIT, SELECTING, BOUND, RENEWING, REBINDING, INIT-REBOOT).
- [ ] ¿Sé diferenciar T1, T2 y T3, y qué hace el cliente cuando vence cada uno?
- [ ] Sé explicar qué hace el cliente al renovar según la respuesta del servidor: DHCPACK, DHCPNAK o ninguna respuesta.
- [ ] Sé explicar qué pasa cuando un cliente se reinicia con una concesión activa (INIT-REBOOT).
- [ ] ¿Sé diferenciar ámbito, rango, tiempo de concesión y reserva?
- [ ] Identifico qué parámetros, además de la IP, puede enviar el servidor al cliente (máscara, puerta de enlace, broadcast, DNS…).

## Servidor Kea DHCP

- [ ] Identifico los servicios de Kea y sus ficheros de configuración en `/etc/kea/`.
- [ ] Sé explicar la estructura de `kea-dhcp4.conf`: `interfaces-config`, `lease-database`, tiempos de validez, `subnet4`, `pools` y `option-data`.
- [ ] ¿Sé diferenciar la subred del pool, y por qué conviene dejar direcciones fuera del pool?
- [ ] Sé configurar un ámbito con su rango, máscara, puerta de enlace, DNS, broadcast y tiempo de concesión.
- [ ] Sé configurar varios ámbitos en el mismo servidor, uno por red.
- [ ] Sé crear una reserva para que una máquina reciba siempre la misma IP, y explicar por qué la necesita un servidor al que apunta una regla DNAT.
- [ ] Sé consultar la lista de concesiones y los registros del servidor (`journalctl -u kea-dhcp4-server`).
- [ ] Sé capturar con `tcpdump` los mensajes de una concesión e identificar cada uno.

## Comprobar y razonar lo que pasa

- [ ] Sé comprobar qué ocurre en los clientes (Linux y Windows) si se apaga el servidor DHCP con una concesión activa, y explicar por qué.
- [ ] Sé comprobar qué ocurre en los clientes si se cambia la configuración del servidor con una concesión activa, y explicar por qué.
- [ ] Sé configurar la interfaz pública del router por DHCP dejando una sola ruta por defecto.
- [ ] Sé comprobar que todo el escenario sigue funcionando después de reiniciar el router.

<style>
  .task-list-item {
    list-style: none;
    position: relative;
    padding-left: 2rem;
    margin-left: -1.25rem;
  }
  .task-list-item input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0.2em;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    border: 2px solid var(--color-text-muted);
    border-radius: 0.3rem;
    background: var(--color-bg);
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }
  .task-list-item input[type="checkbox"]:hover {
    border-color: var(--color-accent);
  }
  .task-list-item input[type="checkbox"]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .task-list-item input[type="checkbox"]:checked {
    border-color: var(--color-accent);
    background: var(--color-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 85% no-repeat;
  }
  .task-list-item:has(input:checked) {
    color: var(--color-text-muted);
  }
</style>

<script>
  (() => {
    const clave = "fp-sri-u1-que-saber";
    let marcadas = [];
    try { marcadas = JSON.parse(localStorage.getItem(clave)) || []; } catch (e) {}
    const casillas = document.querySelectorAll(".task-list-item input[type=checkbox]");
    casillas.forEach((c, i) => {
      c.disabled = false;
      c.checked = marcadas.includes(i);
      c.addEventListener("change", () => {
        const lista = [];
        casillas.forEach((x, j) => x.checked && lista.push(j));
        try { localStorage.setItem(clave, JSON.stringify(lista)); } catch (e) {}
      });
    });
  })();
</script>
