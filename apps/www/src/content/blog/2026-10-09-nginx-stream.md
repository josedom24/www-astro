---
date: 2026-10-09
title: 'Repartir el tráfico HTTPS por nombre sin descifrarlo: el módulo stream de nginx'
slug: 2026/10/nginx-stream
tags:
  - Redes
  - Linux
  - nginx
---

![El módulo stream de nginx](/pledin/assets/2026/10/nginx_stream.png)

En muchas ocasiones me he encontrado con la necesidad de configurar iptables o nftables con reglas **DNAT** para redirigir el tráfico web entrante a un servidor interno. Funciona bien mientras haya un único destino, pero tiene una limitación: el kernel solo ve direcciones y puertos, así que **todo el tráfico al puerto 443 va a parar al mismo servidor**. ¿Y si tengo varios servidores web detrás y quiero repartir las conexiones según el nombre de dominio?

La solución habitual sería instalar un **proxy inverso**, pero eso obliga a **descifrar el tráfico TLS** en esa máquina y, por lo tanto, a tener allí los certificados de todos los servicios, algo que no siempre es posible ni deseable. Para estos casos, nginx nos ofrece el módulo **`stream`**, que nos permite repartir las conexiones por nombre **sin descifrarlas**.

<!--more-->

## ¿Qué es el módulo stream?

Normalmente usamos nginx con el bloque `http`, es decir, trabajando con **peticiones HTTP** (capa 7): nginx entiende la petición, ve la URL, las cabeceras, el nombre del servidor... y para ello, si la conexión es HTTPS, tiene que descifrarla.

El módulo `stream` trabaja con **conexiones TCP/UDP en bruto** (capa 4). Recibe una conexión, decide adónde mandarla y pasa los bytes de un lado a otro, **sin entender lo que viaja dentro**.

Tenemos, por lo tanto, tres formas de publicar un servicio web que está en otra máquina:

| | **DNAT** | **nginx `stream`** | **nginx `http`** (proxy inverso) |
|---|---|---|---|
| Capa | 3/4 (kernel, iptables/nftables) | 4 (nginx) | 7 (nginx) |
| Decide por | IP y puerto | IP y puerto **+ nombre (SNI)** | Nombre, URL, cabeceras... |
| ¿Descifra TLS? | No | **No** | Sí, necesita los certificados |
| IP de origen de la conexión en el destino | La del cliente | La del proxy | La del proxy |
| ¿Cómo conoce el destino la IP del cliente? | Directamente, es la IP de origen | Con *proxy protocol* | Con una cabecera HTTP (`X-Forwarded-For`) |

* Con DNAT solo podemos decir «todo el puerto 443 → servidor A», porque el kernel solo ve puertos. 
* Un proxy inverso `http` podría repartir por nombre o por URL, pero tendría que descifrar. 
* `stream` es el **punto intermedio**: reparte **por nombre**, pero **sin descifrar**.

## ¿Cómo sabe el nombre sin descifrar? El SNI

Al abrir una conexión TLS, el primer mensaje que envía el cliente (*ClientHello*) incluye **en claro** el nombre del servidor al que quiere conectarse: es el **SNI** (*Server Name Indication*). Existe precisamente para que un servidor que tiene varios certificados sepa cuál tiene que presentar.

La directiva `ssl_preread on` hace que nginx **eche un vistazo a ese primer mensaje sin quitarlo de la conexión**: lo lee para conocer el nombre, pero lo deja intacto para poder reenviarlo después. nginx guarda el nombre en la variable `$ssl_preread_server_name`.

Para decidir el destino a partir de ese nombre usamos la directiva **`map`**. Un `map` es una **tabla de correspondencias**: toma el valor de una variable de entrada (en nuestro caso, el nombre del servidor) y, según ese valor, asigna un valor a una variable de salida (en nuestro caso, el servidor al que hay que mandar la conexión). Es como una lista de reglas del tipo «si el nombre es `www.example.org`, el destino es el servidor A; si es `app.example.org`, el servidor B», con un valor `default` para los nombres que no aparezcan en la lista.

Una vez decidido el destino, nginx reenvía la conexión completa, *ClientHello* incluido. La negociación TLS la hace el servidor de destino, como si el cliente se hubiera conectado directamente a él:

```
navegador ──TLS (SNI: www.example.org)──► proxy:443 [stream]
                                              │ lee el SNI, no descifra
                                              ├─ blog.example.org ─► 127.0.0.1:8443 (nginx local, descifra aquí)
                                              ├─ www.example.org  ─► servidor A:443 (descifra aquí)
                                              └─ app.example.org  ─► servidor B:443 (descifra aquí)
```

Cada certificado se queda en el servidor que descifra el tráfico de su servicio. La máquina de entrada solo necesita los certificados de los servicios que sirve ella misma.

## ¿Es parecido a un DNAT?

Se parece en el resultado, pero no en cómo funciona.

En qué se parecen:

* Los dos reenvían la conexión a otra máquina **sin descifrar**. La negociación TLS la hace el destino, que es quien tiene el certificado.
* Para el cliente es transparente en los dos casos: cree que está hablando directamente con el servicio.

En qué se diferencian:

| | DNAT | `stream` |
|---|---|---|
| Quién lo hace | El **kernel**, reescribiendo la IP de destino de cada paquete | Un **proceso** (nginx) que acepta la conexión |
| Conexiones | **Una sola**, de extremo a extremo: los paquetes solo cambian de dirección | **Dos**: cliente ↔ nginx y nginx ↔ destino. nginx copia los bytes de una a otra |
| Decide por | IP y puerto (lo que hay en las cabeceras del paquete) | Además, **lo que hay dentro**: el SNI del primer mensaje |
| IP de origen en el destino | **La del cliente**: el paquete la conserva | **La de nginx**. La del cliente solo llega si usamos **proxy protocol** |
| Vuelta de las respuestas | Tienen que volver **por la misma máquina** para deshacer el NAT | Vuelven solas a nginx, porque es quien abrió la conexión |
| Coste | Casi nulo (lo hace el kernel) | Algo de CPU y memoria, normalmente insignificante |

Dicho de otra forma: el DNAT es un **cartero que cambia la dirección del sobre**. `stream` es un **recepcionista**: recibe al visitante, le pregunta a quién busca (el SNI) y le abre una línea con esa persona.

Esta diferencia tiene una consecuencia interesante. Con DNAT, si el servidor de destino tiene una ruta por defecto que no pasa por la máquina que hace el NAT, las respuestas se pierden y nos encontramos con el problema del **enrutamiento asimétrico**, que hay que resolver con SNAT o con políticas de enrutamiento, como ya expliqué en el artículo [El problema del enrutamiento asimétrico](https://www.josedomingo.org/pledin/2025/06/enrutamiento-asimetrico/). Con `stream` este problema desaparece: el destino responde a nginx, que es quien abrió la conexión.

## Proxy protocol: recuperando la IP del cliente

Como `stream` abre una conexión nueva hacia el destino, el servidor de destino verá como origen la **IP de la máquina que hace de proxy**, y no la del cliente. Esto es un problema si queremos tener las IP reales en los logs o aplicar restricciones por dirección de origen.

**Proxy protocol** lo resuelve: `stream` añade al principio de la conexión una línea con los datos originales:

```
PROXY TCP4 <ip cliente> <ip destino> <puerto origen> <puerto destino>
```

El servidor de destino lee esa línea, la quita y sigue con la conexión normal. Para configurarlo:

* En el bloque `stream`: `proxy_protocol on;` para **enviarla**.
* En el virtualhost de destino: `listen ... proxy_protocol;` para **esperarla**, y `real_ip_header proxy_protocol;` junto con `set_real_ip_from <ip del proxy>;` para **usarla** como IP del cliente.

Hay que tener en cuenta que **los dos lados tienen que estar de acuerdo**: si uno la envía y el otro no la espera (o al revés), la conexión falla.

Conviene tener claro que el proxy protocol **no cambia la IP de origen de la conexión**: el servidor de destino sigue recibiendo una conexión TCP que viene del proxy. Lo que hace es **comunicarle** la IP del cliente, y es nginx, gracias a `real_ip_header`, quien la usa en lugar de la de la conexión (en los logs, en las reglas `allow`/`deny`...). Podemos distinguir tres casos:

* **IP de la conexión**: la dirección de origen que ve el servidor en los paquetes. Solo es la del cliente con DNAT.
* **IP comunicada en una cabecera HTTP** (`X-Forwarded-For`): la añade un proxy inverso `http` a cada petición. Solo existe en HTTP, y el servidor la ve después de descifrar.
* **IP comunicada con proxy protocol**: se envía una vez al principio de la conexión, antes incluso del TLS. Por eso sirve aunque el proxy no descifre, y para cualquier protocolo sobre TCP, no solo HTTP.

En los dos últimos casos el servidor solo debe fiarse de esa información cuando llega del proxy, y por eso indicamos su IP con `set_real_ip_from`. Si no, cualquier cliente podría enviar una IP falsa.

## Ejemplo de configuración

Supongamos que tenemos una máquina de entrada con IP pública, cuya IP en la red interna es `192.168.1.1`, y tres servicios web:

* `blog.example.org` lo sirve **el nginx de la propia máquina de entrada**.
* `www.example.org` está en el servidor interno `192.168.1.10`.
* `app.example.org` está en el servidor interno `192.168.1.20`.

Es decir, la máquina de entrada recibe todas las conexiones al puerto 443: una se la queda para su propio nginx, y las otras dos las reparte entre los servidores internos.

El bloque `stream` va al **nivel principal** de `nginx.conf`, no dentro del bloque `http`. En Debian/Ubuntu el módulo viene en el paquete `libnginx-mod-stream`:

```
apt install libnginx-mod-stream
```

En el fichero `/etc/nginx/nginx.conf` añadimos al final:

```nginx
stream {
    include /etc/nginx/stream.d/*.conf;
}
```

Y creamos el fichero `/etc/nginx/stream.d/https.conf`:

```nginx
map $ssl_preread_server_name $destino {
    blog.example.org    local;
    www.example.org     servidor_www;
    app.example.org     servidor_app;
    default             local;
}

upstream local {
    server 127.0.0.1:8443;
}

upstream servidor_www {
    server 192.168.1.10:443;
}

upstream servidor_app {
    server 192.168.1.20:443;
}

server {
    listen 443;
    ssl_preread on;
    proxy_pass $destino;
    proxy_protocol on;
}
```

Como el puerto 443 ya lo ocupa `stream`, el nginx `http` de la máquina de entrada no puede escuchar en él. Por eso el virtualhost de `blog.example.org` escucha en otro puerto, `8443`, y solo en `127.0.0.1`, para que no sea accesible directamente desde fuera. Recibe las conexiones del bloque `stream` de la misma máquina, así que se fía del proxy protocol que viene de `127.0.0.1`:

```nginx
server {
    listen 127.0.0.1:8443 ssl proxy_protocol;
    server_name blog.example.org;

    set_real_ip_from 127.0.0.1;
    real_ip_header proxy_protocol;

    ssl_certificate     /etc/letsencrypt/live/blog.example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.example.org/privkey.pem;
    ...
}
```

En los servidores internos, el virtualhost también tiene que esperar el proxy protocol, pero en este caso se fía de la IP interna de la máquina de entrada, `192.168.1.1`. Por ejemplo, en el servidor `192.168.1.10`:

```nginx
server {
    listen 443 ssl proxy_protocol;
    server_name www.example.org;

    set_real_ip_from 192.168.1.1;
    real_ip_header proxy_protocol;

    ssl_certificate     /etc/letsencrypt/live/www.example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.example.org/privkey.pem;
    ...
}
```

Y lo mismo para `app.example.org` en el servidor `192.168.1.20`.

Fíjate en que cada certificado está **donde se descifra el tráfico**: la máquina de entrada solo tiene el de `blog.example.org`, que es el servicio que sirve ella misma. Los certificados de `www` y `app` están en sus servidores, y la máquina de entrada nunca los necesita.

## ¿Y el puerto 80?

El tráfico HTTP sin cifrar no lleva SNI, así que `stream` no puede repartirlo por nombre. El puerto 80 lo gestionamos con un bloque `http` normal en la máquina de entrada, que **sí** puede ver la cabecera `Host` porque no hay nada que descifrar. Con ella podemos, por ejemplo, redirigir todas las peticiones a HTTPS o hacer `proxy_pass` hacia el servidor que corresponda.

## Limitaciones

* No puede repartir por **URL** (`/algo`) ni por cabeceras HTTP, solo por **nombre**. Si necesitamos eso, no queda más remedio que descifrar con un proxy inverso `http`.
* El reparto por SNI solo sirve para **TLS**. El puerto 80 hay que tratarlo aparte, como hemos visto.
* Los servidores de destino pueden ser máquinas físicas, máquinas virtuales o contenedores: a `stream` solo le importa poder conectarse a una IP y un puerto. Pero lo que escuche en ese puerto tiene que **encargarse del TLS** (tener el certificado) y **entender el proxy protocol**. Si tenemos una aplicación que solo sirve HTTP, podemos tratarla como `blog.example.org`: `stream` manda la conexión al nginx local, que descifra y hace de proxy inverso hacia la aplicación.
* Todo el mecanismo se basa en que el SNI viaja **en claro**, y eso tiene un inconveniente de privacidad: cualquiera que vea pasar la conexión sabe a qué sitio web nos conectamos, aunque el resto esté cifrado. Para evitarlo existe **ECH** (*Encrypted Client Hello*), una extensión de TLS que **cifra el *ClientHello***, SNI incluido. Para usarlo, el servidor publica en su DNS una clave pública con la que el navegador cifra ese primer mensaje. Si activáramos ECH en nuestros dominios, nginx ya no podría leer el nombre real y no sabría adónde mandar la conexión. Mientras no publiquemos una configuración ECH para nuestros dominios, los navegadores seguirán enviando el SNI en claro, así que no nos afecta.

## Conclusión

El módulo `stream` de nginx es una herramienta muy útil cuando tenemos **una única IP pública** y **varios servidores web** detrás. Nos ofrece lo mejor de los dos mundos:

* Como el **DNAT**, no descifra el tráfico: cada servidor mantiene sus certificados y negocia su propio TLS.
* Como el **proxy inverso**, puede repartir las conexiones **por nombre de dominio**, gracias al SNI.

Además, nos evita los problemas de enrutamiento asimétrico del DNAT y, con **proxy protocol**, el servidor de destino sigue conociendo la IP real del cliente. A cambio, tenemos que configurar los dos extremos de forma coherente y asumir que el reparto solo puede hacerse por nombre, nunca por URL.
