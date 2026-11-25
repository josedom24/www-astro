---
title: "Ejercicio 4: Redes privadas en OpenStack"
---

En este ejercicio vas a crear tu propia infraestructura de red: un router, redes privadas conectadas a él e instancias en esas redes. Además vas a montar el esquema más habitual en una nube: una máquina accesible desde fuera y otra que solo es accesible a través de la primera.

## Las redes en OpenStack

El componente de OpenStack que gestiona las redes se llama **Neutron**. Estos son sus conceptos:

* **Red**: dominio aislado de capa 2, el equivalente a un conmutador o una VLAN.
* **Subred**: bloque de direcciones IP asociado a una red. Define el direccionamiento, la puerta de enlace, el DNS y si hay servidor DHCP.
* **Router**: dispositivo de capa 3 que conecta redes.
* **Puerto**: punto de conexión a una red. Cada interfaz de una instancia o de un router es un puerto, con su dirección MAC y su IP.
* **IP fija**: dirección de una instancia en una red privada.
* **IP flotante**: dirección de la red externa asociada a una instancia para acceder a ella desde fuera.

Vamos a distinguir dos clases de redes:

* La **red externa** (`ext-net`): la crea el administrador y es la que da acceso al exterior. De ella salen las IP flotantes.
* Las **redes privadas**: las crea cada usuario en su proyecto. Podemos tener todas las que necesitemos.

Una red privada puede ser de dos tipos, según a qué esté conectada:

* **Red privada con salida**: está conectada a un router que a su vez está conectado a la red externa. Sus instancias tienen acceso a Internet y se les puede asociar una IP flotante. Es el equivalente a lo que en libvirt llamábamos *red NAT*.
* **Red privada aislada**: no está conectada a ningún router con salida. Sus instancias solo se comunican entre ellas. La veremos en el ejercicio 5.

## El router

Un router conectado a la red externa hace dos trabajos para las redes privadas que tiene conectadas:

* **SNAT**: las instancias salen a Internet con la dirección del router.
* **DNAT**: cuando asociamos una IP flotante a una instancia, el router redirige a su IP fija el tráfico que llega a la IP flotante. Por eso dentro de la instancia no aparece la IP flotante.

Las operaciones con routers:

* Listar los routers: `openstack router list`
* Crear un router: `openstack router create mi_router`
* Conectarlo a la red externa: `openstack router set mi_router --external-gateway ext-net`
* Ver su información: `openstack router show mi_router`
* Ver sus puertos: `openstack port list --router mi_router`
* Eliminarlo: `openstack router delete mi_router`

:::caution[Ejercicio]
Tu proyecto ya tiene una red privada con salida. Antes de crear nada, examínala:

1. Lista las redes, las subredes y los routers de tu proyecto.
2. Muestra la información de la subred de tu red: ¿qué direccionamiento tiene?, ¿cuál es la puerta de enlace?, ¿tiene DHCP?
3. Lista los puertos del router. ¿Qué dirección tiene en tu red? ¿Con qué coincide?
:::

## Creación de una red privada con salida

Primero se crea la red:

```
openstack network create red1
```

Después se crea su subred. Los parámetros más importantes son:

* `--network`: la red a la que pertenece la subred.
* `--subnet-range`: el direccionamiento.
* `--dns-nameserver`: el servidor DNS que se configura en las instancias.
* `--gateway`: la puerta de enlace que se configura en las instancias. Si no se indica, es la primera dirección del rango.
* `--allocation-pool start=<ip>,end=<ip>`: el rango de direcciones que se reparten. Si no se indica, todo el rango.
* `--no-dhcp`: desactiva el servidor DHCP, que por defecto está activo.

```
openstack subnet create --network red1 --subnet-range 192.168.0.0/24 --dns-nameserver 172.22.0.1 subred1
```

Por último se conecta la subred al router. El router toma en esa red la dirección de la puerta de enlace:

```
openstack router add subnet mi_router subred1
```

Al crear una instancia indicamos la red a la que se conecta:

```
openstack server create --flavor m1.mini \
    --image "Debian 13 Trixie" \
    --security-group default \
    --key-name jdmr \
    --network red1 \
    maquina1
```

:::caution[Ejercicio]
1. Crea un router llamado `mi_router` y conéctalo a la red externa.
2. Crea la red `red1` con la subred `subred1`: direccionamiento `192.168.0.0/24`, con DHCP y DNS `172.22.0.1`. Conéctala a `mi_router`.
3. Crea la instancia `maquina1` conectada a `red1` y asóciale una IP flotante.
4. Accede a `maquina1`. Comprueba su IP, su puerta de enlace y que tiene acceso a Internet.
5. Mira en Horizon la **Topología de red**.
:::

## Puertos e IP fijas

Cuando conectamos una instancia a una red con `--network`, OpenStack crea un puerto y le asigna una dirección libre. Si queremos que la instancia tenga **una dirección concreta**, creamos antes el puerto con esa dirección:

```
openstack port create --network red1 --fixed-ip ip-address=192.168.0.100 puerto_maquina
```

Y creamos la instancia indicando el puerto en lugar de la red:

```
openstack server create --flavor m1.mini \
    --image "Debian 13 Trixie" \
    --key-name jdmr \
    --port puerto_maquina \
    maquina_ip_fija
```

En una red con DHCP esto funciona como una **reserva**: la instancia sigue configurándose por DHCP, pero siempre recibe esa dirección.

El grupo de seguridad pertenece al puerto. Por eso, cuando usamos un puerto ya creado, el grupo de seguridad se indica al crear el puerto (`--security-group`) y no al crear la instancia. Si no se indica, el puerto usa el grupo `default`.

Otras operaciones con puertos:

* Puertos de una red: `openstack port list --network red1`
* Puertos de una instancia: `openstack port list --server maquina1`
* Eliminar un puerto: `openstack port delete puerto_maquina`

## Una máquina sin acceso desde fuera

No todas las instancias necesitan una IP flotante. Lo habitual es que solo la tengan las que ofrecen un servicio al exterior, y que el resto (bases de datos, servidores de aplicaciones…) no sean accesibles desde fuera.

Una instancia **sin IP flotante** en una red privada con salida:

* **Tiene acceso a Internet**, porque el router hace SNAT. Puede actualizarse e instalar paquetes.
* **No es accesible desde fuera**, porque no hay ninguna dirección externa que lleve a ella.

Para administrarla se entra a través de otra instancia que sí tiene IP flotante, usando la opción `-J` de SSH:

```
ssh -J debian@<IP flotante de maquina1> debian@<IP fija de la otra máquina>
```

Un mismo router puede tener conectadas varias redes privadas. El router enruta el tráfico entre ellas, así que las instancias de una red pueden comunicarse con las de otra.

:::caution[Ejercicio]
1. Crea la red `red_back` con la subred `subred_back`: direccionamiento `192.168.20.0/24`, con DHCP y DNS `172.22.0.1`. Conéctala también a `mi_router`.
2. Crea un puerto en `red_back` con la dirección `192.168.20.100` y crea la instancia `backend` usando ese puerto. No le asocies IP flotante.
3. Accede a `backend` desde tu ordenador a través de `maquina1`.
4. Comprueba que `backend` tiene la dirección que has reservado y que tiene acceso a Internet.
5. Mira de nuevo la Topología de red en Horizon.
:::

## Grupos de seguridad por función

Hasta ahora hemos abierto puertos en el grupo `default`, que se aplica a todas las instancias. Lo habitual es crear **un grupo de seguridad para cada función** y dar a cada instancia solo lo que necesita.

Un grupo nuevo no permite ninguna conexión entrante y permite todas las salientes:

```
openstack security group create sg_acceso
openstack security group rule create --protocol tcp --dst-port 22 --remote-ip 0.0.0.0/0 sg_acceso
```

El origen de una regla puede ser un rango de direcciones (`--remote-ip`) o **otro grupo de seguridad** (`--remote-group`). En el segundo caso la regla permite el tráfico que viene de las instancias que pertenecen a ese grupo, tengan la IP que tengan:

```
openstack security group create sg_backend
openstack security group rule create --protocol tcp --dst-port 22 --remote-group sg_acceso sg_backend
openstack security group rule create --protocol icmp --remote-group sg_acceso sg_backend
```

Para cambiar el grupo de una instancia que ya existe:

```
openstack server add security group maquina1 sg_acceso
openstack server remove security group maquina1 default
```

:::caution[Ejercicio]
1. Crea el grupo `sg_acceso`, que permita SSH desde cualquier dirección, y asígnalo a `maquina1` en lugar de `default`.
2. Crea el grupo `sg_backend`, que permita SSH e ICMP solo desde las instancias del grupo `sg_acceso`, y asígnalo a `backend` en lugar de `default`.
3. Comprueba que sigues pudiendo entrar en `backend` a través de `maquina1`, y que desde `maquina1` puedes hacerle ping.
4. Crea otra instancia en `red1` con el grupo `default` e intenta hacer ping a `backend` desde ella. ¿Funciona? ¿Por qué?
:::

## Eliminación de la infraestructura de red

Los recursos de red hay que eliminarlos en orden, porque no se puede eliminar un recurso que otro está usando:

1. Eliminar las instancias conectadas a la red.
2. Eliminar los puertos que hayamos creado a mano y que hayan quedado sin usar.
3. Desconectar la subred del router: `openstack router remove subnet mi_router subred_back`
4. Eliminar la red (la subred se elimina con ella): `openstack network delete red_back`
5. Eliminar el router, si ya no tiene redes conectadas.

:::caution[Ejercicio]
1. Elimina la instancia `backend`, la instancia de prueba del apartado anterior y la red `red_back`.
2. **No elimines** `mi_router`, `red1` ni `maquina1`: los vas a usar en el ejercicio 5.
:::

:::tip[En la práctica]
Con lo que acabas de aprender ya puedes hacer la **Fase 3** de la [práctica](../practica/): crear el router `RouterProyecto` y la red `Red_Proyecto`. No interfiere con lo que has creado en este ejercicio, porque usan otros nombres y otro direccionamiento.

No elimines todavía `mi_router`, `red1` ni `maquina1`: los necesitas en el ejercicio 5.
:::
