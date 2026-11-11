---
title: "Ejercicio 4: Vistas en bind"
---

Antes de explicar las vistas, vamos a repasar como se controla el acceso a nuestro DNS.

## Control de acceso

Por defecto podemos consultar a un servidor DNS desde clientes que están en la misma red privada. Si preguntamos desde otra red tenemos que configurar en el fichero `/etc/bind/named.conf.options`, los siguientes parámetros:

* **allow-query**: Especifica cuáles hosts tienen permitido consultar este servidor de nombres.
* **allow-recursion**: Parecida a la anterior, salvo que se aplica a las peticiones recursivas. 

En ambos parámetros se puede poner **any;** para indicar todas las direcciones.

## Vistas en bind9

En alguna circunstancia nos puede interesar **que un mismo nombre que resuelve nuestro DNS devuelve direcciones IP distintas según en qué red esté conectada** el cliente que realiza la consulta.

**Ejemplo**
Una instancia de OpenStack conectada a una red interna con direccionamiento 10.0.0.0/24 y a una red externa 172.22.0.0/16 (a la que llega con su IP flotante). Vamos a configurar bind9 para que cuando se consulte el nombre del servidor desde la red externa devuelva la IP flotante (`IP_FLOTANTE`) y cuando la consulta se realice desde la red interna se devuelva la IP fija (`IP_FIJA`, de la red 10.0.0.0/24).

En este ejemplo tenemos dos vistas: 

* Vista interna 
* Vista externa

## Definición de las vistas. Vista interna.

La regla principal es que deben declararse **todas** las zonas en todas las vistas. Para ello, editamos el fichero `/etc/bind/named.conf` y comentamos la última línea:

```
include "/etc/bind/named.conf.options";
include "/etc/bind/named.conf.local";
//include "/etc/bind/named.conf.root-hints";
```
Si no la comentas, bind no arranca: `when using 'view' statements, all zones must be in views`. No hace falta incluir esa línea en las vistas, porque bind9 ya trae integradas las pistas de los servidores raíz.

Fichero `/etc/bind/named.conf.local`:

```
view interna {
    match-clients { 10.0.0.0/24; 127.0.0.1; };
    allow-recursion { any; };   

        zone "example.org"
        {
                type master;
                file "db.interna.example.org";
        };
        zone "0.0.10.in-addr.arpa"
        {
                type master;
                file "db.0.0.10";
        };
};
```
## Definición de las vistas. Vista externa.
Fichero `/etc/bind/named.conf.local` (a continuación de la vista interna):

```
view externa {
    match-clients { 172.22.0.0/16; 100.64.0.0/10; };
    allow-recursion { any; };   

        zone "example.org"
        {
                type master;
                file "db.externa.example.org";
        };
        zone "22.172.in-addr.arpa"
        {
                type master;
                file "db.22.172";
        };  
};
```

* En la zona definida en **db.interna.example.org** y **db.0.0.10** se define el direccionamiento **10.0.0.0/24**.
* En la zona definida en **db.externa.example.org** y **db.22.172** se define el direccionamiento **172.22.0.0/16**.
* El parámetro **match-clients** nos permite diferenciar la vista que se va a ofrecer según la ip de la petición de la consulta. Si un cliente no coincide con ninguna vista, el servidor le responde `REFUSED`: por eso en la vista externa incluimos también `100.64.0.0/10`, la red de los clientes de la VPN Tailscale.
* En las zonas de este ejemplo (`example.org`) el servidor es `dns` y el nombre `www` apunta a `IP_FIJA` en la vista interna y a `IP_FLOTANTE` en la externa.

:::caution[¿Qué tienes que hacer?]
* Configura las dos vistas en una de tus instancias de OpenStack, con sus cuatro ficheros de zona. En cada zona de resolución inversa pon el registro `PTR` de `www`.
* Comprueba con `named-checkconf` y reinicia el servidor.
* Desde **tu ordenador** (red externa) consulta `dig @IP_FLOTANTE www.example.org` y `dig @IP_FLOTANTE -x IP_FLOTANTE`. ¿Qué IP devuelve?
* Desde **la propia instancia** (red interna) consulta `dig @127.0.0.1 www.example.org` y `dig @IP_FIJA -x IP_FIJA`. ¿Qué IP devuelve ahora? ¿Por qué es distinta?
* Comprueba que las dos vistas siguen resolviendo nombres de Internet, por ejemplo `dig @IP_FLOTANTE www.debian.org`.
:::
