---
title: "Práctica optativa 2: Router en red pública"
---

Sobre el escenario ya montado en la [Práctica: QEMU/KVM + libvirt](practica/), vamos a dar acceso al `router` desde la red física del aula, además de las redes virtuales que ya tenía.

Esta práctica es **optativa**: solo puede mejorar tu nota, nunca perjudicarla.

## Bridge externo

* En el host, configura un bridge externo `br0` uniendo tu interfaz de red **cableada** (evita Wi-Fi: suele dar problemas para conectarse a bridges virtuales).
* Crea con `virsh` una red de tipo puente (*bridge*) conectada a `br0`.

## Conexión del router

* Conecta una interfaz de red adicional del `router` a esa red puente, manteniendo las conexiones que ya tenía a `default` y `red_intra`.
* Configura el direccionamiento de esa nueva interfaz en el mismo rango que el resto de equipos del aula (DHCP o estática, según corresponda).
* Añade la clave pública del profesor a `~/.ssh/authorized_keys` del usuario `user` en el `router`.

## Comprobación

* Desde otro equipo del aula (no el tuyo), comprueba que puedes acceder por SSH al `router` usando su nueva IP de la red pública.

:::tip[Entrega]
1. Configuración del bridge externo `br0` en el host (`ip a` o `bridge link`).
2. Definición de la red puente con `virsh net-dumpxml`.
3. Salida de `virsh domiflist router` mostrando la interfaz conectada al bridge.
4. Comprobación del acceso SSH al `router` desde otro equipo del aula distinto al tuyo, con la clave pública del profesor ya añadida.
:::
