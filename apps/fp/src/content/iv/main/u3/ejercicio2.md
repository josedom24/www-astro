---
title: "Ejercicio 2: Instancias con OpenStack client (OSC)"
---

A partir de este ejercicio vamos a gestionar OpenStack desde la línea de comandos, con **OpenStack client (OSC)**. Todo lo que hiciste con Horizon en el ejercicio 1 se puede hacer con el comando `openstack`, porque los dos hacen lo mismo: peticiones a la **API** de OpenStack.

En este ejercicio vas a crear instancias desde el CLI, configurarlas con cloud-init y crear instantáneas.

## El cliente de OpenStack

Ya has instalado y usado el cliente en el módulo de SRI, al trabajar con Swift. Si necesitas repasar la instalación y el fichero de credenciales, lo tienes en ese [ejercicio](https://fp.josedomingo.org/sri/main/u2/ejercicio2/). En resumen:

```
$ source os/bin/activate
(os)$ source "Proyecto de usuario-openrc.sh"
Please enter your OpenStack Password ...:
```

Con las credenciales cargadas podemos consultar los recursos del proyecto:

* Instancias: `openstack server list`
* Pares de claves: `openstack keypair list`
* Imágenes: `openstack image list`
* Sabores: `openstack flavor list`
* Redes: `openstack network list`
* Reglas del grupo de seguridad `default`: `openstack security group rule list default`

Casi todos los recursos tienen los mismos subcomandos: `list`, `show`, `create`, `set` y `delete`.

También podemos crear recursos. Por ejemplo, para abrir un puerto en el grupo de seguridad:

```
openstack security group rule create --protocol tcp --remote-ip 0.0.0.0/0 --dst-port 22 default
```

Si añades la opción `--debug` a cualquier comando, verás las peticiones HTTP que el cliente hace a la API.

:::caution[Ejercicio]
1. Carga tus credenciales y muestra las instancias, las claves, las imágenes, los sabores y las redes de tu proyecto.
2. Abre el puerto 80 en el grupo de seguridad `default` y comprueba que la regla se ha creado.
:::

## Creación de instancias

Para crear una instancia hay que indicar lo mismo que en Horizon: sabor, imagen, grupo de seguridad, par de claves y red.

```
openstack server create --flavor m1.normal \
    --image "Debian 13 Trixie" \
    --security-group default \
    --key-name jdmr \
    --network "Red de josedom" \
    instancia_prueba
```

Para acceder desde fuera necesitamos una IP flotante:

* Ver las IP flotantes del proyecto: `openstack floating ip list`
* Solicitar una nueva: `openstack floating ip create ext-net`
* Asociarla a la instancia: `openstack server add floating ip instancia_prueba 172.22.201.111`
* Quitarla de la instancia: `openstack server remove floating ip instancia_prueba 172.22.201.111`

Las operaciones más habituales sobre la instancia:

* Información detallada: `openstack server show instancia_prueba`
* Parar e iniciar: `openstack server stop instancia_prueba` y `openstack server start instancia_prueba`
* Reiniciar: `openstack server reboot instancia_prueba` (con `--hard` para un reinicio forzado)
* Suspender y reanudar: `openstack server suspend instancia_prueba` y `openstack server resume instancia_prueba`
* Ver la salida del arranque: `openstack console log show instancia_prueba`
* Eliminar: `openstack server delete instancia_prueba`

## Configuración de instancias con cloud-init

Ya conoces **cloud-init** de la unidad 1: es el programa que configura la máquina en el primer arranque. En libvirt le pasábamos la configuración al crear la máquina con `virt-install`. En OpenStack la instancia obtiene los datos de dos sitios:

* **Metadatos**: los proporciona OpenStack a través del **servidor de metadatos** (`http://169.254.169.254`). Incluyen el nombre de la instancia, la configuración de red y la clave pública del par de claves. Por eso una instancia tiene nombre y clave SSH aunque no le pasemos ningún fichero.
* **Datos de usuario** (*user-data*): nuestro fichero `cloud-config.yaml`, con la configuración adicional. Es opcional.

Por ejemplo, este fichero actualiza los paquetes, instala Apache2, configura el nombre y crea un usuario:

```yaml
#cloud-config
package_update: true
package_upgrade: true
packages:
  - apache2
fqdn: maquina.example.org
hostname: maquina
manage_etc_hosts: true
users:
  - name: usuario
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2E... usuario@equipo
chpasswd:
  expire: False
  users:
    - name: usuario
      password: asdasd
      type: text
```

Si prefieres no escribir el YAML a mano, puedes generarlo con **openINIT**, un formulario web que produce el `cloud-config` y lo valida con avisos que te ayudan a aprender: [openinit.josedomingo.org](https://openinit.josedomingo.org) (elige «Para: OpenStack»). En **Ejemplos…** hay uno, **«Teclado en español y caché de paquetes del aula»**, que deja la consola de Horizon con el teclado en español y las instalaciones de paquetes usando la caché del aula; te vendrá bien para tus instancias.

El fichero se indica con el parámetro `--user-data`:

```
openstack server create --flavor m1.normal \
    --image "Debian 13 Trixie" \
    --security-group default \
    --key-name jdmr \
    --network "Red de josedom" \
    --user-data cloud-config.yaml \
    instancia_prueba
```

Ten en cuenta dos cosas:

* Si defines la sección `users`, **no se crea el usuario por defecto** de la imagen (`debian`), y la clave del par de claves no se inyecta en tus usuarios: tienes que indicarla en `ssh_authorized_keys`.
* La instancia obtiene los metadatos por la red. Si la conectamos a una red sin DHCP no tendrá red al arrancar y no podrá leerlos. Lo veremos en el ejercicio 5.

:::caution[Ejercicio]
1. Crea un fichero `cloud-config.yaml` que actualice los paquetes, instale Apache2, cree un usuario con tu nombre (con tu clave pública y una contraseña) y configure el FQDN `maquina1.example.org`.
2. Crea una instancia con ese fichero.
3. Solicita una IP flotante y asóciala a la instancia.
4. Accede por SSH con tu usuario y comprueba que la configuración se ha aplicado.
5. Para la instancia y vuelve a iniciarla.
:::

## Instantáneas de instancias

Al hacer una instantánea de una instancia, OpenStack crea una **imagen nueva** con el contenido de su disco. No es una copia incremental: es una imagen más, que aparece junto a las demás y de la que se pueden crear instancias.

* Crear la instantánea: `openstack server image create --name snapshot-instancia instancia_prueba`
* Verla (está lista cuando el estado es `active`): `openstack image list`
* Eliminarla: `openstack image delete snapshot-instancia`

Para crear una instancia a partir de la instantánea se indica como imagen:

```
openstack server create --flavor m1.normal \
    --image snapshot-instancia \
    --security-group default \
    --network "Red de josedom" \
    instancia_prueba2
```

:::caution[Ejercicio]
1. Crea una instantánea de la instancia del apartado anterior.
2. Crea una instancia nueva a partir de la instantánea y asóciale una IP flotante.
3. Comprueba que tiene la misma configuración: Apache2 instalado y tu usuario creado.
4. Elimina las dos instancias y la instantánea.
:::

:::tip[En la práctica]
Con lo que acabas de aprender ya puedes hacer la **Fase 1** de la [práctica](../practica/): preparar la plantilla de cloud-init que usarás en todas las instancias del escenario (usuarios, `profesor`, FQDN, actualización de paquetes y contraseña de `root`).

Recuerda que si defines la sección `users` no se crea el usuario por defecto de la imagen, y que Rocky Linux no se comporta igual que Debian: compruébalo cuando lo necesites.
:::
