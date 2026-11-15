---
title: "Ejercicio 6: DNS en OpenStack (Designate)"
---

En este ejercicio vas a descubrir que OpenStack también puede gestionar nombres de dominio: cuando creas una instancia o una IP flotante, OpenStack puede publicar su nombre en un servidor DNS **sin que tengas que configurar nada**. **No hay que entregar nada**, y no forma parte de la práctica.

:::caution[No lo confundas con el DNS de SRI]
El servicio de DNS de OpenStack se llama **Designate** y lo gestiona la propia nube. **No tiene ninguna relación** con el servidor DNS (bind9) que vas a montar en el módulo de Servicios de Red e Internet: ni la zona que usas aquí, ni los nombres, ni la configuración tienen que ver con los de esa práctica. Por eso el dominio de la práctica de SRI no puede coincidir con tu usuario de OpenStack, que es el nombre que usa Designate.
:::

## Conceptos previos

* **Designate** es el servicio de OpenStack que ofrece **DNS como servicio**: cada proyecto puede tener sus propias zonas y registros, y se gestionan con la API, el cliente de línea de comandos o Horizon.
* **Zona**: un dominio del que el proyecto es responsable. En tu proyecto ya existe una zona con el nombre de tu usuario: `usuario.gonzalonazareno.org.` (si tu usuario tiene puntos, se sustituyen por guiones, porque en DNS el punto separa etiquetas). **Fíjate en el punto final**: en Designate los nombres de zona siempre lo llevan.
* **Registro** (*recordset*): un nombre dentro de la zona con su tipo (`A`, `PTR`…) y su valor.
* **Integración con Neutron**: la red de tu proyecto tiene asignado el dominio de tu zona (`dns_domain`). Gracias a eso, OpenStack puede crear registros solo.
* **DNS inverso (PTR)**: el que traduce una IP en un nombre. Las IP flotantes tienen su propio PTR.

Estos nombres se resuelven desde la red del instituto preguntando al servidor DNS `172.22.0.1`, porque el instituto ha delegado en OpenStack las zonas de los proyectos.

## El cliente de Designate

Los comandos `openstack zone`, `openstack recordset` y `openstack ptr` **no vienen con el cliente de OpenStack**: los aporta un complemento. Instálalo en el mismo entorno donde tienes `openstack`:

```
pip install python-designateclient
```

o, si instalaste el cliente con `apt`:

```
sudo apt install python3-designateclient
```

Si no está instalado, el síntoma es `openstack: 'zone list' is not an openstack command`.

:::caution[Ejercicio]
1. Instala el complemento de Designate y comprueba que `openstack zone list` funciona.
:::

## Tu zona

```
openstack zone list
openstack zone show usuario.gonzalonazareno.org.
openstack recordset list usuario.gonzalonazareno.org.
```

El `recordset list` muestra al menos dos registros que crea Designate: el **SOA** (los datos de la zona, con el servidor primario y el número de serie) y el **NS** (el servidor de nombres de la zona).

:::caution[Ejercicio]
1. Muestra tu zona. ¿Qué servidor de nombres tiene? ¿Quién es el servidor primario del SOA?
2. Lista sus registros. ¿Qué tipos aparecen?
:::

## Registros manuales

Puedes crear tus propios registros dentro de la zona:

```
openstack recordset create usuario.gonzalonazareno.org. miweb --type A --record 172.22.201.50
openstack recordset list usuario.gonzalonazareno.org. --type A
openstack recordset delete usuario.gonzalonazareno.org. miweb.usuario.gonzalonazareno.org.
```

El nombre del registro se completa con el de la zona: `miweb` es `miweb.usuario.gonzalonazareno.org.`. Para comprobar que se resuelve, pregunta al servidor DNS del instituto:

```
dig +short miweb.usuario.gonzalonazareno.org @172.22.0.1
```

Puede tardar unos segundos desde que el registro pasa a `ACTIVE`.

:::caution[Ejercicio]
1. Crea un registro `A` llamado `prueba` con una IP cualquiera. Comprueba que está `ACTIVE` y que se resuelve con `dig`.
2. Elimínalo y comprueba que deja de resolverse.
:::

## Registros automáticos

Aquí está lo interesante. Como tu red tiene el `dns_domain` de tu zona, OpenStack puede crear el registro de una instancia **sin que hagas nada**:

* El nombre del registro es el **nombre de la instancia**.
* Se crea cuando le **asocias una IP flotante**, y apunta a esa IP flotante (no a la IP fija).
* Si le quitas la IP flotante, el registro desaparece.

```
openstack server create --flavor m1.mini --image "Debian 13 Trixie" \
    --key-name clave --network "Red de usuario" miinstancia
openstack floating ip create ext-net
openstack server add floating ip miinstancia 172.22.201.134
openstack recordset list usuario.gonzalonazareno.org. --name miinstancia.usuario.gonzalonazareno.org.
```

La IP fija no se publica: lo que interesa de una instancia es poder encontrarla desde fuera, por su IP pública.

:::caution[Ejercicio]
1. Crea una instancia con el nombre que quieras y asóciale una IP flotante. **Si ya tienes todas tus IP flotantes en uso, libera alguna**: el número de IP flotantes por proyecto es limitado.
2. Comprueba que aparece su registro `A` en tu zona y que `dig` lo resuelve con la IP flotante.
3. Quítale la IP flotante a la instancia. ¿Qué pasa con el registro?
4. Vuelve a asociarle la IP flotante. ¿Reaparece?
:::

## IP flotante con nombre

También puedes ponerle nombre a la IP flotante al crearla, y el nombre **puede ser distinto del de la instancia**:

```
openstack floating ip create --dns-domain usuario.gonzalonazareno.org. --dns-name www ext-net
```

Este registro funciona de otra manera: se crea **una sola vez, en el momento de crear la IP**, y no sigue a la IP cuando la asocias o la quitas de una instancia. Si lo borras a mano, OpenStack no lo vuelve a crear. Por eso, si quieres recuperarlo, hay que crear el registro a mano o borrar la IP flotante y crearla de nuevo.

| IP flotante | ¿Quién pone el nombre? | ¿El registro sigue a la asociación? |
|:--|:--|:--|
| Sin `--dns-name` | La instancia a la que se asocia | **Sí**: se crea al asociar y se borra al quitar |
| Con `--dns-name` | Tú, al crearla | **No**: se crea al crear la IP y ya no cambia |

:::caution[Ejercicio]
1. Libera una IP flotante que no uses y crea una nueva con `--dns-name`. Comprueba que el registro aparece **antes** de asociarla a ninguna instancia.
2. Asóciala a una instancia, quítala y vuelve a asociarla. ¿Qué ha pasado con el registro?
3. ¿Cuál de los dos tipos de IP flotante usarías para una web que va a cambiar de instancia? ¿Y para encontrar una instancia por su nombre?
:::

## DNS inverso

Al crear una IP flotante con registro, OpenStack también crea su **PTR** automáticamente. Para ver el nombre de una IP:

```
dig -x 172.22.201.134 @172.22.0.1
```

Además, el dueño de una IP flotante puede **elegir el nombre de su PTR**:

```
openstack floating ip show 172.22.201.134 -f value -c id
openstack ptr record set RegionOne:<id-de-la-ip> miinstancia.usuario.gonzalonazareno.org.
openstack ptr record show RegionOne:<id-de-la-ip>
```

El PTR pasa de `PENDING` a `ACTIVE` en unos segundos. Pero **el servidor DNS del instituto guarda en caché las respuestas** (una hora), así que puede seguir devolviendo el nombre anterior durante un rato. Para ver el cambio al momento, pregunta directamente a OpenStack:

```
dig -x 172.22.201.134 @172.22.123.100
```

:::caution[Ejercicio]
1. Consulta el PTR de la IP flotante de tu instancia. ¿Qué nombre devuelve?
2. Cambia su PTR a otro nombre de tu zona y compruébalo preguntando directamente a `172.22.123.100`.
3. ¿Qué diferencia hay entre preguntar a `172.22.0.1` y a `172.22.123.100`?
:::

## Limpieza

Antes de pasar a la práctica, elimina lo que has creado en este ejercicio: las instancias, las IP flotantes y los registros que hayas hecho a mano. Las IP flotantes son un recurso limitado y lo vas a necesitar para el escenario.
