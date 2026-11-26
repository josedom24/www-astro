---
title: "Ejercicio 5: Despliegues parametrizados"
---

## Ejercicio 1: Configurando la aplicación Temperaturas

En el ejercicio anterior desplegamos la aplicación Temperaturas, formada por dos microservicios. Recuerda que el `frontend` hace las peticiones al `backend` usando el nombre `temperaturas-backend`, que es el nombre que tuvimos que dar al Service del `backend`.

Ese nombre se puede configurar: la imagen `iesgn/temperaturas_frontend` lee la variable de entorno **TEMP_SERVER**, que indica el nombre y el puerto del `backend`. Su valor por defecto es:

```
TEMP_SERVER=temperaturas-backend:5000
```

Vamos a cambiar el nombre del Service del `backend` a `servidor-temperaturas` y a configurar el `frontend` para que lo use. Guardaremos el valor en un ConfigMap.

### El ConfigMap

Crea un fichero `temperaturas-cm.yaml` a partir de la siguiente plantilla, sustituyendo cada `<...>` por el valor que corresponda:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: temperaturas
data:
  <clave>: <valor>
```

La clave será `SERVIDOR_TEMPERATURAS` y el valor, `servidor-temperaturas:5000`.

### El Deployment del frontend

Copia el fichero `frontend-deployment.yaml` del ejercicio anterior y añade al contenedor la variable de entorno `TEMP_SERVER`, que tomará su valor del ConfigMap. Para ello, añade el campo `env` al final de la definición del contenedor, al mismo nivel que `image` y `ports`:

```yaml
      containers:
      - name: contenedor-temperaturas
        image: iesgn/temperaturas_frontend
        ports:
          - name: http-server
            containerPort: 3000
        env:
          - name: <nombre-de-la-variable>
            valueFrom:
              configMapKeyRef:
                name: <nombre-del-configmap>
                key: <clave>
```

Realiza los siguientes pasos:

1. Crea el ConfigMap y comprueba su contenido con `kubectl describe cm temperaturas`.
2. Crea el Deployment del `frontend`, su Service de tipo `ClusterIP` y el Ingress para acceder a él, igual que en el ejercicio anterior.
3. Comprueba que la variable tiene el valor del ConfigMap: `kubectl exec deploy/temperaturas-frontend -- printenv TEMP_SERVER`.
4. Copia el fichero `backend-deployment.yaml` del ejercicio anterior y crea el Deployment del `backend`.
5. Crea el Service del `backend` como en el ejercicio anterior, pero con el nombre **`servidor-temperaturas`**.
6. Accede a la aplicación con el navegador, busca un municipio y comprueba que se muestran las temperaturas.

### Cambiando la configuración

Vamos a ver qué ocurre al cambiar el valor del ConfigMap:

1. Modifica el fichero `temperaturas-cm.yaml` para que el valor sea `otro-servidor:5000` y aplica el cambio.
2. Vuelve a comprobar el valor de la variable `TEMP_SERVER` en el `frontend` y refresca la aplicación en el navegador. ¿Ha cambiado algo? ¿Por qué?
3. Reinicia el Deployment del `frontend` con `kubectl rollout restart deployment temperaturas-frontend`. Comprueba de nuevo el valor de la variable y busca un municipio en la aplicación. ¿Qué mensaje aparece? ¿Por qué?
4. Vuelve a poner el valor `servidor-temperaturas:5000`, aplica el cambio y haz lo necesario para que la aplicación vuelva a funcionar.
5. Elimina los recursos que has creado en este ejercicio: el Ingress, los Services, los Deployments y el ConfigMap.

## Ejercicio 2: Despliegue de Nextcloud con MariaDB

Vamos a desplegar **Nextcloud**, una aplicación web para guardar y compartir ficheros, que guarda su información en una base de datos **MariaDB**. Usaremos las imágenes `nextcloud:35` y `mariadb:11.8`.

Las dos imágenes se configuran con variables de entorno:

| Dato | MariaDB | Nextcloud |
|:--|:--|:--|
| Nombre de la base de datos | `MARIADB_DATABASE` | `MYSQL_DATABASE` |
| Usuario de la base de datos | `MARIADB_USER` | `MYSQL_USER` |
| Contraseña del usuario | `MARIADB_PASSWORD` | `MYSQL_PASSWORD` |
| Contraseña del usuario `root` | `MARIADB_ROOT_PASSWORD` | — |
| Servidor de base de datos | — | `MYSQL_HOST` |

Los datos de configuración los guardaremos en un **ConfigMap**, y las contraseñas, en un **Secret**. Los dos Deployments leerán los valores de esos recursos, de forma que siempre coincidan.

### El ConfigMap y el Secret

Crea los dos recursos con `kubectl create`, eligiendo tú los valores:

* Un ConfigMap llamado `nextcloud` con las claves `bd_nombre` (nombre de la base de datos) y `bd_usuario` (usuario de la base de datos).
* Un Secret de tipo `generic` llamado `nextcloud` con las claves `bd_password` (contraseña del usuario) y `bd_root_password` (contraseña del usuario `root`).

### La base de datos

El fichero `mariadb-deployment.yaml` despliega MariaDB:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
  labels:
    app: nextcloud
    tier: db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nextcloud
      tier: db
  template:
    metadata:
      labels:
        app: nextcloud
        tier: db
    spec:
      containers:
        - name: contenedor-mariadb
          image: mariadb:11.8
          ports:
            - name: db-port
              containerPort: 3306
          env:
            - name: MARIADB_DATABASE
              valueFrom:
                configMapKeyRef:
                  name: nextcloud
                  key: bd_nombre
            - name: MARIADB_USER
              valueFrom:
                configMapKeyRef:
                  name: nextcloud
                  key: bd_usuario
            - name: MARIADB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: nextcloud
                  key: bd_password
            - name: MARIADB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: nextcloud
                  key: bd_root_password
```

* Las variables `MARIADB_DATABASE` y `MARIADB_USER` toman su valor del ConfigMap (`configMapKeyRef`), y las contraseñas, del Secret (`secretKeyRef`).
* Al arrancar por primera vez, el contenedor crea la base de datos y el usuario con esos datos.
* El contenedor ofrece el servicio en el puerto 3306, al que damos el nombre `db-port`.

### Nextcloud

Crea el fichero `nextcloud-deployment.yaml` a partir de la siguiente plantilla:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextcloud
  labels:
    app: nextcloud
    tier: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nextcloud
      tier: frontend
  template:
    metadata:
      labels:
        app: nextcloud
        tier: frontend
    spec:
      containers:
        - name: contenedor-nextcloud
          image: nextcloud:35
          ports:
            - name: http-server
              containerPort: 80
          env:
            - name: MYSQL_HOST
              value: <nombre-del-service-de-mariadb>
            - name: MYSQL_DATABASE
              valueFrom:
                <configMapKeyRef-o-secretKeyRef>:
                  name: nextcloud
                  key: <clave>
            - name: MYSQL_USER
              valueFrom:
                <configMapKeyRef-o-secretKeyRef>:
                  name: nextcloud
                  key: <clave>
            - name: MYSQL_PASSWORD
              valueFrom:
                <configMapKeyRef-o-secretKeyRef>:
                  name: nextcloud
                  key: <clave>
```

* `MYSQL_HOST` es el nombre con el que Nextcloud accede a la base de datos: el nombre del Service de MariaDB, que será `mariadb`.
* Las demás variables deben tomar los **mismos valores** que las de MariaDB.

Realiza los siguientes pasos:

1. Crea el ConfigMap y el Secret. Obtén información detallada de los dos recursos con `kubectl describe`. ¿Qué diferencia observas?
2. Obtén el valor de la clave `bd_password` del Secret con `kubectl get secret nextcloud -o jsonpath='{.data.bd_password}'`. ¿Es la contraseña que pusiste? Decodifícalo con `base64 -d`. ¿Es seguro guardar las contraseñas en un Secret?
3. Crea el Deployment de MariaDB y su Service, que se llamará `mariadb` y será de tipo `ClusterIP`, con el puerto 3306 y el nombre de puerto `db-port`, seleccionando los Pods con las etiquetas `app: nextcloud` y `tier: db`.
4. Crea el Deployment de Nextcloud y su Service, de tipo `ClusterIP`, con el puerto 80 y el nombre de puerto `http-server`, seleccionando los Pods con las etiquetas `app: nextcloud` y `tier: frontend`.
5. Comprueba los valores de las variables de entorno en los dos Pods, por ejemplo: `kubectl exec deploy/nextcloud -- printenv MYSQL_HOST MYSQL_DATABASE MYSQL_USER`.
6. Crea un recurso Ingress para acceder a Nextcloud usando un nombre del tipo *www.nextcloud-tunombre.org*, y añade el nombre a tu fichero `/etc/hosts`.
7. Accede a Nextcloud con el navegador **usando ese nombre** y completa el asistente de instalación creando la cuenta de administración. No tendrás que indicar los datos de la base de datos: Nextcloud los toma de las variables de entorno.
8. Sube algún fichero a Nextcloud.
9. Elimina el Pod de Nextcloud (`kubectl delete pod <nombre-del-pod>`) y, cuando el Deployment haya creado el nuevo, vuelve a acceder a la aplicación. ¿Qué ha ocurrido? Intenta completar de nuevo la instalación con la misma cuenta de administración: ¿qué error aparece? ¿Por qué? Lo solucionaremos en el siguiente ejercicio con el almacenamiento persistente.
10. Elimina los recursos que has creado en este ejercicio.

**Nota:** Nextcloud solo admite el nombre con el que se ha instalado. Si haces la instalación accediendo con la IP y el puerto, al entrar después por el nombre del Ingress aparecerá el error **Access through untrusted domain**.
