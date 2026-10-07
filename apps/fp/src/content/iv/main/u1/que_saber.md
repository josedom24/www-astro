---
title: "Unidad 1: ¿Qué tengo que saber?"
description: "Lista de comprobación de lo que hay que saber y saber hacer en la unidad de virtualización de máquinas virtuales con QEMU/KVM + libvirt."
---

Usa esta lista para repasar la unidad. Ve marcando lo que ya dominas: se guarda en tu navegador, así que lo verás marcado cuando vuelvas desde el mismo equipo. Si no puedes marcar algún punto, vuelve a la presentación o al ejercicio correspondiente.

## Introducción a la virtualización

- [ ] Sé explicar qué es la virtualización, para qué se utiliza y sus ventajas e inconvenientes.
- [ ] Identifico el hipervisor, el anfitrión (*host*) y el invitado (*guest*).
- [ ] Sé explicar qué son las extensiones de virtualización (Intel VT / AMD-V) y qué aporta la virtualización asistida por hardware.
- [ ] ¿Sé diferenciar la emulación, la virtualización completa y la virtualización en contenedores?
- [ ] ¿Sé diferenciar un hipervisor de tipo 1 (nativo) de uno de tipo 2 (alojado), y poner ejemplos de cada uno?
- [ ] ¿Sé diferenciar los contenedores de sistema (LXC) de los de aplicación (Docker)?

## QEMU, KVM y libvirt

- [ ] Sé explicar los dos modos de funcionamiento de QEMU (emulador y virtualización) y qué papel tiene KVM.
- [ ] Sé explicar por qué KVM es un hipervisor de tipo 1 aunque funcione sobre Linux.
- [ ] ¿Sé diferenciar un dispositivo emulado de uno paravirtualizado (`virtIO`), y por qué este rinde más?
- [ ] Sé explicar qué es libvirt y qué aporta frente a usar QEMU/KVM directamente.
- [ ] ¿Sé diferenciar las conexiones `qemu:///session`, `qemu:///system` y `qemu+ssh:///system`?
- [ ] Identifico para qué sirve cada herramienta: `virsh`, `virt-install`, `virt-clone`, `virt-viewer` y `virt-manager`.
- [ ] Sé instalar QEMU/KVM + libvirt y trabajar con `virsh` sin `sudo` (grupo `libvirt` y `LIBVIRT_DEFAULT_URI`).

## Gestión de máquinas virtuales

- [ ] Sé crear una máquina con `virt-install` indicando nombre, memoria, vCPUs, disco, ISO, red y variante de sistema operativo.
- [ ] Sé acceder a la consola de una máquina con `virt-viewer` y con `virsh console`.
- [ ] Sé arrancar, apagar, reiniciar, suspender, reanudar y forzar el apagado (`destroy`) de una máquina, y diferenciar `shutdown` de `destroy`.
- [ ] Sé configurar una máquina para que se inicie con el host (`autostart`).
- [ ] Sé obtener la información de una máquina: estado, IP, interfaces y discos (`dominfo`, `domifaddr`, `domiflist`, `domblklist`).
- [ ] Sé leer la definición XML de una máquina (`dumpxml`) e identificar la memoria, los vCPUs, los discos y las interfaces de red.
- [ ] Sé modificar los recursos de una máquina con los subcomandos de `virsh`, y explicar cuándo hace falta tenerla parada (`--config`) y por qué es mejor que editar el XML con `virsh edit`.
- [ ] Sé explicar por qué Windows no detecta el disco al usar dispositivos `virtIO`, y crear la máquina con los drivers `virtio-win` en un segundo CD-ROM.

## Almacenamiento: pools y volúmenes

- [ ] ¿Sé diferenciar un pool de almacenamiento de un volumen?
- [ ] Identifico el pool `default` y dónde guarda los volúmenes (`/var/lib/libvirt/images`).
- [ ] ¿Sé diferenciar los tipos de pool (`dir`, `logical`, `netfs`, `iSCSI`), qué es un volumen en cada uno y cuáles permiten almacenamiento compartido?
- [ ] ¿Sé diferenciar el almacenamiento NAS (a nivel de archivo) del SAN (a nivel de bloque)?
- [ ] ¿Sé diferenciar los formatos raw y qcow2, y por qué el raw ocupa todo el espacio desde el principio y el qcow2 no (aprovisionamiento ligero)?
- [ ] Sé consultar los pools y sus volúmenes, con su capacidad y el espacio que ocupan en disco (`pool-info`, `vol-list --details`).
- [ ] Sé crear un volumen con `virsh vol-create-as` y con `qemu-img create`, y explicar por qué en el segundo caso hay que hacer `pool-refresh`.
- [ ] Sé crear una máquina usando un volumen que ya existe como disco principal.

## Añadir y redimensionar discos

- [ ] Sé añadir un disco a una máquina de forma persistente (`attach-disk --persistent`) y quitarlo (`detach-disk`).
- [ ] Sé formatear y montar un disco nuevo dentro de la máquina de forma persistente (`/etc/fstab`).
- [ ] Sé redimensionar un volumen con la máquina parada (`vol-resize`, `qemu-img resize`) y en caliente (`blockresize`).
- [ ] Sé explicar por qué después de redimensionar el volumen hay que ampliar el sistema de ficheros dentro de la máquina (`resize2fs`), y comprobar el nuevo tamaño.

## Clonación, imágenes cloud e instantáneas

- [ ] Sé clonar una máquina con `virt-clone` y explicar qué problemas de identidad tiene el clon (hostname, claves SSH del servidor…).
- [ ] Sé dar una identidad propia a una máquina clonada: cambiar el hostname y regenerar las claves SSH del servidor.
- [ ] Sé explicar qué es una plantilla y para qué sirve.
- [ ] ¿Sé diferenciar la clonación completa de la enlazada, y qué es la imagen base (*backing store*)?
- [ ] Sé explicar qué es una imagen cloud y qué hace `cloud-init` en el primer arranque.
- [ ] Sé escribir un fichero `cloud-config` que configure el hostname, los usuarios, las claves SSH y los paquetes.
- [ ] Sé crear una clonación enlazada de una imagen cloud con `qemu-img create -b`, ampliar su tamaño y crear la máquina con `virt-install --import --cloud-init`.
- [ ] Sé explicar la ventaja de la clonación enlazada con `cloud-init` frente a instalar desde una ISO o por red.
- [ ] Sé crear, listar y restaurar una instantánea de una máquina, y explicar por qué necesita el formato qcow2.
- [ ] Sé explicar en qué momento conviene hacer una instantánea.

## Redes

- [ ] ¿Sé diferenciar las redes virtuales (NAT, aislada, muy aislada) de las redes puente (bridge externo, interfaz compartida)?
- [ ] Sé explicar cómo funciona la red `default`: bridge `virbr0`, el host como puerta de enlace, servidor DHCP y DNS, y SNAT al exterior.
- [ ] Sé explicar con qué tiene conectividad una máquina en cada tipo de red: otras máquinas, el host y el exterior.
- [ ] Identifico en el XML de una red qué la hace NAT (`<forward/>`), aislada (sin `<forward>`) o muy aislada (sin `<ip>`).
- [ ] Sé definir una red con `virsh net-define`, activarla y configurarla para que se inicie con el host.
- [ ] Sé conectar una máquina a una red al crearla (`--network`) y añadir o quitar interfaces de una máquina existente (`attach-interface`, `detach-interface`).
- [ ] Sé configurar el direccionamiento dentro de la máquina según el tipo de red: DHCP en la NAT, estático cuando la red no tiene DHCP.
- [ ] Sé explicar qué es un bridge externo (`br0`), por qué la interfaz física pierde su IP y qué direccionamiento toman las máquinas conectadas a él.

## Montar un escenario

- [ ] Sé montar un escenario con varias redes y máquinas, en el que una máquina hace de router entre una red muy aislada y la red `default`.
- [ ] Sé configurar el router para que haga SNAT de forma persistente y para publicar un servicio interno con DNAT.
- [ ] Sé compartir un directorio por NFS desde una máquina y montarlo en otra de forma persistente, y explicar qué ventaja tiene frente a copiar los ficheros.
- [ ] Sé comprobar que todo el escenario sigue funcionando después de reiniciar el host.

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
    const clave = "fp-iv-u1-que-saber";
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
