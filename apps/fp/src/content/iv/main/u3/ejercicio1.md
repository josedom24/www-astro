---
title: "Ejercicio 1: Primeros pasos con OpenStack"
---

En este ejercicio vas a usar OpenStack por primera vez desde su aplicación web, **Horizon**: vas a preparar tu proyecto, crear una instancia y acceder a ella desde tu ordenador. **No hay que entregar nada**: el objetivo es que conozcas los conceptos con los que vamos a trabajar el resto de la unidad.

## Conceptos previos

* **Proyecto**: el espacio de trabajo de cada usuario. Todos los recursos que crees (instancias, redes, volúmenes…) pertenecen a tu proyecto y están aislados de los de tus compañeros.
* **Imagen**: fichero con un disco virtual que contiene un sistema operativo con la configuración mínima para funcionar en la nube.
* **Instancia**: servidor virtual que se ejecuta en la nube y que se basa en una imagen. Al principio es un clon de la imagen.
* **Sabor** (*flavor*): define el tamaño de la instancia: número de vCPU, memoria RAM y tamaño del disco. Partiendo de la misma imagen se obtienen instancias con distintas características según el sabor.
* **Par de claves**: tu clave pública SSH, guardada en OpenStack. Se inyecta en la instancia al crearla, y por eso se accede con clave y no con contraseña.
* **Grupo de seguridad**: conjunto de reglas de cortafuegos que se aplican a las interfaces de red de la instancia.
* **IP fija**: dirección de la instancia en la red privada a la que está conectada. No cambia durante la vida de la instancia.
* **IP flotante**: dirección de la red externa que se asocia a una instancia después de crearla, para acceder a ella desde fuera. No todas las instancias tienen por qué tener una.

Al entrar en tu proyecto ya tienes creada **una red privada conectada a un router**. En el ejercicio 4 veremos cómo funciona y crearemos otras.

## Acceso a Horizon

Se accede con un navegador a la dirección `https://openstack.gonzalonazareno.org`. Hay que indicar tu nombre de usuario, tu contraseña y, como dominio, **iesgn**.

## Configuración de las claves SSH

El acceso a las instancias se hace con un par de claves SSH. Lo primero es subir a OpenStack tu **clave pública**, que se inyectará en la instancia cuando se cree. Puedes subir varias y elegir cuál inyectar en cada instancia.

Dentro de **Proyecto → Instancias → Pares de claves** hay dos opciones:

* **Importar clave pública**: es la opción recomendada si ya usas tu propio par de claves. Indicas un nombre, eliges el tipo *Clave SSH* y pegas el contenido de tu fichero de clave pública (o lo subes).
* **Crear par de claves**: OpenStack genera el par, guarda la clave pública y te deja descargar la clave privada. OpenStack no guarda la privada: si la pierdes tendrás que crear otro par.

## Grupos de seguridad

Cada interfaz de red de una instancia tiene su propio cortafuegos, y sus reglas se definen en **grupos de seguridad**. Puedes crear varios grupos y asignar a cada instancia los que necesite; así cada servicio tiene sus reglas agrupadas. Existe un grupo por defecto llamado **default**.

Los grupos están en **Proyecto → Red → Grupos de seguridad**. Con **Administrar reglas** ves las reglas de un grupo, y con **Agregar regla** añades otras: puedes indicar el puerto, o elegir un servicio de una lista (por ejemplo, SSH). Las reglas que permiten el acceso por SSH y hacer ping a las máquinas desde cualquier origen son:

| Dirección | Protocolo | Puerto | Origen |
|:--|:--|:--|:--|
| Entrada | TCP | 22 (SSH) | `0.0.0.0/0` |
| Entrada | ICMP | — | `0.0.0.0/0` |

:::caution[Ejercicio]
1. Accede a **Horizon** con tu usuario.
2. Importa tu **clave pública** SSH a OpenStack.
3. En el grupo de seguridad `default`, abre el puerto 22 (SSH) y permite el ping (ICMP).
:::

## Creación de una instancia

En **Proyecto → Instancias → Lanzar instancia** hay que rellenar un asistente con varios apartados:

* **Detalles**: el nombre de la instancia, una descripción, la zona de disponibilidad (`nova`) y el número de instancias que se crean.
* **Origen**: de dónde sale el sistema de la instancia. Puede ser una **imagen** (es la opción que vamos a usar ahora), una instantánea de instancia, una instantánea de volumen o un volumen. Elegimos la imagen de la lista.
* **Sabor**: el tamaño de la instancia. En el instituto hay tres familias: **m1**, para máquinas Linux sin entorno gráfico; **vol**, que se usan cuando el disco de la instancia es un volumen (su disco es de 0 GB porque el tamaño lo da el volumen), y **win**, para máquinas Windows.
* **Redes**: la red del proyecto a la que se conecta la instancia. Si solo hay una, se elige sola.
* **Puertos de red**: si hemos creado algún puerto, se puede elegir aquí. Lo veremos en el ejercicio 4.
* **Grupos de seguridad**: los que forman el cortafuegos de la instancia. Si solo hay uno, se elige solo.
* **Par de claves**: la clave pública, de las que hemos subido, que se inyecta en la instancia.
* **Configuración**: permite pasar un script de **cloud-init** para configurar la instancia en el arranque. Lo veremos en el ejercicio 2.

El resto de opciones no las usamos por ahora.

## Asignación de una IP flotante

Cuando la instancia está creada tiene una IP del direccionamiento de la red privada, a la que no se puede acceder desde fuera. Para entrar necesitamos una **IP flotante**: una dirección de la red externa que el router de la red privada redirige a la instancia (mediante **DNAT**).

1. En **Proyecto → Red → IPs flotantes**, reserva una IP con **Asignar IP al proyecto**.
2. En la IP reservada, elige **Asociar** y selecciona la instancia. También se puede hacer desde las acciones de la instancia, con **Asociar IP flotante**.
3. Cuando una IP flotante no está asociada a ninguna instancia, se puede liberar.

Con la IP flotante ya puedes acceder por SSH con tu clave privada. El usuario es `debian` en las imágenes de Debian y `ubuntu` en las de Ubuntu:

```
$ ssh debian@172.22.201.49
```

Si tu fichero de clave privada no se llama `id_rsa` o `id_ed25519`, indícalo con la opción `-i`: `ssh -i clave debian@172.22.201.49`.

:::caution[Ejercicio]
1. Crea una instancia a partir de una imagen de Debian o de Ubuntu. No uses volúmenes.
2. Elige un sabor cuyo nombre empiece por **m1**.
3. Conecta la instancia a la red de tu proyecto y elige tu par de claves.
4. Asocia una **IP flotante** a la instancia.
5. Accede a la instancia por SSH desde tu ordenador.
6. Dentro de la instancia, comprueba cuál es su dirección IP. ¿Es la IP fija o la flotante? ¿Dónde está configurada la IP flotante?
:::

## Operaciones sobre la instancia

En una infraestructura clásica se espera que un servidor se encienda, se configure y no se apague casi nunca. En la nube se habla del **ciclo de vida** de una instancia: se crean, se paran, se reinician y se destruyen según la demanda. Las acciones se encuentran en el menú desplegable de cada instancia:

**Red**

* **Asociar IP flotante**: asocia una de las IP flotantes que tengas reservadas.
* **Conectar interfaz** y **Desconectar interfaz**: conecta la instancia a otra red, o la desconecta.

**Almacenamiento**

* **Asociar volumen** y **Desasociar volumen**: conecta o desconecta un volumen, que aparece como un disco nuevo en la máquina.
* **Crear instantánea**: crea una imagen nueva a partir del estado de la instancia.

**Seguridad**

* **Editar grupos de seguridad**: añade o quita grupos de seguridad de la instancia.
* **Editar grupos de seguridad de puerto**: configura la seguridad de un puerto. Se usa, por ejemplo, para desactivar el cortafuegos de una interfaz con la opción *Seguridad del puerto*.

**Información**

* **Editar instancia**: cambia el nombre.
* **Ver registro**: muestra el log de arranque de la instancia.
* **Consola**: abre una consola VNC, como si fuera una máquina virtual. Para entrar hay que haber definido antes una contraseña de usuario.

**Ciclo de vida**

* **Pausar instancia**: detiene la ejecución guardando el estado en la memoria RAM.
* **Suspender instancia**: detiene la ejecución guardando el estado en disco.
* **Apagar instancia** y **Encender instancia**: apaga la máquina virtual, que sigue definida, y la vuelve a arrancar.
* **Reanudar instancia**: continúa una instancia pausada o suspendida.
* **Reiniciar instancia**: ejecuta un *reboot*. El reinicio **suave** apaga la máquina de forma normal y la arranca; el **duro** se usa si la instancia tiene algún problema.
* **Eliminar instancia**: la destruye y libera los recursos que ocupaba.

**Avanzadas**

* **Redimensionar instancia**: cambia el sabor de la instancia.
* **Reconstruir instancia / Rescatar instancia**: permite acceder al disco de una instancia con problemas para repararla.
* **Aislar instancia** (*shelve*): detiene la instancia y libera sus recursos (vCPU, RAM y disco) sin eliminarla. Se conserva una instantánea, y se puede recuperar cuando se quiera.

:::caution[Ejercicio]
1. Pausa y reanuda la instancia.
2. Apaga y enciende la instancia.
3. Redimensiona la instancia a un sabor diferente.
4. Crea una instantánea (*snapshot*) de la instancia. ¿Dónde aparece la instantánea creada?
5. Elimina la instancia.
:::
