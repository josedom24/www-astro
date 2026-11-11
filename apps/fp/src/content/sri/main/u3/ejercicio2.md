---
title: "Ejercicio 2: Instalación y configuración de un servidor DNS esclavo"
---

Un **servidor DNS esclavo** contiene una réplica de las zonas del servidor maestro. Se debe producir una **transferencia de zona** (el esclavo hace una solicitud de la zona completa al maestro) para que se sincronicen los servidores.

### Configuración del servidor maestro y esclavo

Crea otra **instancia de OpenStack** con su **IP flotante**, que tendrá el rol de **servidor DNS esclavo**. Instala bind9 y nómbrala de manera adecuada para que tenga el nombre `dns2.tunombre.org`. En este ejercicio vamos a usar dos marcadores que debes sustituir por las **IP flotantes** de tus instancias:

* `IP_DNS1`: la IP flotante del servidor maestro (`dns1.tunombre.org`).
* `IP_DNS2`: la IP flotante del servidor esclavo (`dns2.tunombre.org`).

En el grupo de seguridad de la nueva instancia abre el puerto **53 en UDP y en TCP**: la transferencia de zona usa el 53/tcp y el aviso de cambios (`notify`) llega al esclavo por el 53/udp.

En el esclavo configura también `/etc/default/named` (`OPTIONS="-4 -u bind"`) y `allow-query` en `/etc/bind/named.conf.options`, igual que en el ejercicio 1.

Por seguridad, sólo debemos aceptar transferencias de zonas hacia los esclavos autorizados, para ello en el fichero `/etc/bind/named.conf.options`, deshabilitamos las transferencias:

	options {
		...
		allow-transfer { none; };
		...

### Configuración de la definición de las zonas

Modificamos la definición de las zona en el servidor DNS maestro. Modificamos el fichero `/etc/bind/named.conf.local`:

	zone "tunombre.org" {
		type master;
		file "db.tunombre.org";
		allow-transfer { IP_DNS2; };
		notify yes;
	};
	zone "22.172.in-addr.arpa" {
		type master;
		file "db.172.22.0.0";
		allow-transfer { IP_DNS2; };
		notify yes;
	};

* `allow-transfer`: Se permite las transferencias de zonas al servidor DNS esclavo (`IP_DNS2`).
* `notify yes`: Cuando se reinicie el servidor DNS maestro se notificará al esclavo que ha habido cambios para que solicite una transferencia de zona.

Modificamos la definición de las zona en el servidor DNS esclavo. Modificamos el fichero `/etc/bind/named.conf.local`:

	zone "tunombre.org" {
		type slave;
		file "db.tunombre.org";
		masters { IP_DNS1; };
	};
	zone "22.172.in-addr.arpa" {
		type slave;
		file "db.172.22.0.0";
		masters { IP_DNS1; };
	};	

* `type slave`: Se indica que este servidor será esclavo para estas zonas.
* `masters`: Se indica cuál es el maestro, para saber a que servidor hay que solicitar la transferencia de zona.

## Configuración de las zonas

En el servidor DNS maestro añadimos la información del servidor DNS esclavo en las zonas. En la zona de resolución directa, en el fichero `/var/cache/bind/db.tunombre.org` añadimos un nuevo registro `NS` y su correspondiente registro `A`:

	$TTL    86400
	@       IN      SOA     dns1.tunombre.org. root.tunombre.org. (
	                              1         ; Serial
	                         604800         ; Refresh
	                          86400         ; Retry
	                        2419200         ; Expire
	                          86400 )       ; Negative Cache TTL
	;
	@	IN	NS		dns1.tunombre.org.
	@	IN	NS		dns2.tunombre.org.
	@	IN	MX	10	correo.tunombre.org.
	$ORIGIN tunombre.org.
	dns1		IN	A	IP_DNS1
	dns2		IN	A	IP_DNS2
	...

La zona de resolución inversa quedaría de la siguiente forma, modificando el fichero `/var/cache/bind/db.172.22.0.0`:

	$TTL    86400
	@       IN      SOA     dns1.tunombre.org. root.tunombre.org. (
	                              1         ; Serial
	                         604800         ; Refresh
	                          86400         ; Retry
	                        2419200         ; Expire
	                          86400 )       ; Negative Cache TTL
	;
	@	IN	NS		dns1.tunombre.org.
	@	IN	NS		dns2.tunombre.org.

	$ORIGIN 22.172.in-addr.arpa.
	XX.XX		IN	PTR		dns1.tunombre.org.
	YY.YY		IN	PTR		dns2.tunombre.org.
	...

* En los registros `PTR`, `XX.XX` e `YY.YY` son los dos últimos números de `IP_DNS1` y de `IP_DNS2` **en orden inverso** (como en el ejercicio 1).

**Nota: La información de los registros de las zonas sólo se modifican en el servidor DNS maestro. Estas modificaciones se copian en el esclavo por medio de una transferencia de zona**.

## Comprobación de errores

Reinicia el servidor DNS maestro y esclavo. Puedes ver en el esclavo que se han producidos las transferencias de zonas:


	root@dns2:~# systemctl restart bind9
	root@dns2:~# journalctl -u named
	... dns2 named[1179]: zone tunombre.org/IN: Transfer started.
	... dns2 named[1179]: zone 22.172.in-addr.arpa/IN: Transfer started.
	... dns2 named[1179]: transfer of 'tunombre.org/IN' from IP_DNS1#53: connected using IP_DNS1#53
	... dns2 named[1179]: transfer of '22.172.in-addr.arpa/IN' from IP_DNS1#53: connected using IP_DNS1#53
	... dns2 named[1179]: zone 22.172.in-addr.arpa/IN: transferred serial 1
	... dns2 named[1179]: transfer of '22.172.in-addr.arpa/IN' from IP_DNS1#53: Transfer status: success
	... dns2 named[1179]: transfer of '22.172.in-addr.arpa/IN' from IP_DNS1#53: Transfer completed: 1 messages, 9 records, ...
	... dns2 named[1179]: zone tunombre.org/IN: transferred serial 1
	... dns2 named[1179]: transfer of 'tunombre.org/IN' from IP_DNS1#53: Transfer status: success
	... dns2 named[1179]: transfer of 'tunombre.org/IN' from IP_DNS1#53: Transfer completed: 1 messages, 13 records, ...

Si no ves las transferencias, puedes filtrar el registro con `journalctl -u named | grep -E "transfer|zone"`.

Si al reiniciar los servidores DNS tienes algún error, puedes detectar errores de sintaxis usando los siguientes comandos:

* `named-checkzone tunombre.org /var/cache/bind/db.tunombre.org`: Para comprobar la configuración de la zona directa.
* `named-checkzone 22.172.in-addr.arpa /var/cache/bind/db.172.22.0.0`: Para comprobar la configuración de la zona inversa.
* Para detectar errores de configuración en `named.conf`, podemos usar: `named-checkconf`.


## ¿Cuándo se hacen las copias?

* Los esclavos interrogan al maestro periódicamente, esto es el "**Intervalo de actualización" (refresh interval)**, para obtener actualizaciones.
* El maestro también puede notificar a los esclavos cuando hay cambios (**`notify yes;`**), pero como puede haber pérdida de paquetes sigue siendo necesario interrogar periódicamente.
* El esclavo sólo iniciará la copia cuando el número de serie, configurado en el registro SOA de la zona, **AUMENTE**.
* Formato recomendado: **YYMMDDNN**
* Si se decrementa el número de serie, los esclavos nunca se actualizarán hasta que el número sea mayor que el valor anterior.

## Información en el registro SOA

	@       IN      SOA     dns1.tunombre.org. root.tunombre.org. (
	                              1         ; Serial
	                         604800         ; Refresh
	                          86400         ; Retry
	                        2419200         ; Expire
	                          86400 )       ; Negative Cache TTL

* El **intervalo de actualización (refresh)**: frecuencia con la que el esclavo debe revisar el número de serie del maestro para hacer una transferencia de zona.
* **Intervalo de reintento (retry)**: frecuencia con la que reintenta si el servidor maestro no responde.
* **Tiempo de caducidad (expiry)**: Si el esclavo no puede comunicarse con el maestro durante este intervalo, debe borrar su copia de la zona.
* **TTL negativo (negative)**: Significa tiempo de vida negativo, el tiempo durante el cual se debe almacenar en la cache de cualquier otro servidor DNS una respuesta negativa. Eso significa que si otro servidor DNS preguntas por `no-existe.example.com` y esa entrada no existe, ese servidor DNS considerará como válida esa respuesta (no existe) durante el tiempo indicado.

## Algunos trucos adicionales

* Puedes manejar el servidor DNS con el comando `rndc`. Por ejemplo `rndc reload`: reinicia el servicio; `rndc reload tunombre.org`: Reinicia sólo esa zona; `rndc flush`: Borra la caché de resoluciones guardadas en el servidor.
* Realiza una consulta al servidor maestro y el esclavo para comprobar que las respuestas son autorizadas (bit `AA`), además asegúrate que coinciden los números de serie:

	dig +norec @x.x.x.x tunombre.org. soa
		
* Solicita una copia completa de la zona y comprueba que sólo se puede hacer desde el esclavo:

	dig @x.x.x.x tunombre.org. axfr

* **Cada vez que realices una modificación en el servidor DNS maestro recuerda incrementar el número de serie**.

:::caution[¿Qué tienes que hacer?]
* Configura el cliente con los dos servidores DNS. En las instancias de OpenStack el fichero `/etc/resolv.conf` lo gestiona `systemd-resolved` (apunta a `127.0.0.53`) y **si lo editas se pierde** cuando se reinicia el servicio. Por eso se configura con `resolvectl` (cambia `ens3` por el nombre de tu interfaz, que ves con `ip -br a`):
	```
	sudo resolvectl dns ens3 IP_DNS1 IP_DNS2
	resolvectl status ens3
	```
	La configuración es temporal: se pierde al reiniciar la máquina (`sudo resolvectl revert ens3` la quita).
* Si hacemos una consulta desde un cliente, y el dns maestro no responde, responderá el esclavo. Prueba a realizar una consulta con `resolvectl query nombre.tunombre.org`. ¿Quién ha respondido? (míralo en `Current DNS Server` de `resolvectl status ens3`). Apaga el servidor maestro, y vuelve a hacer la misma consulta. ¿Ha respondido el servidor DNS esclavo? La primera consulta tardará unos segundos, hasta que el cliente dé por caído al maestro.
* `systemd-resolved` guarda las respuestas en caché: antes de repetir una consulta ejecuta `sudo resolvectl flush-caches`.
* Vamos a modificar la información de la zona. Para ello vamos a modificar en el servidor DNS maestro y en su fichero `/var/cache/bind/db.tunombre.org` vamos a añadir un nuevo registro:
``` 
	...
		prueba		IN	A	172.22.200.120
```
* **Recuerda incrementar el número de serie, para que al reiniciar el servidor DNS maestro se produzca la transferencia de zona.**
* Desde el cliente realiza una consulta para preguntar por la dirección IP de `prueba.tunombre.org` (con `resolvectl query`). ¿Quién ha respondido?. Apaga el servidor maestro, vacía la caché y vuelve a hacer la misma consulta. ¿Ha respondido el servidor DNS esclavo?. Comprueba en el esclavo que se ha producido la transferencia.
:::

 

:::tip[Importante]
* Realiza el ejercicio que te va a proponer el profesor.
:::
