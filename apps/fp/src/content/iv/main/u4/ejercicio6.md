---
title: "Ejercicio 6: Almacenamiento en Kubernetes"
---

Al final del ejercicio anterior, al eliminar el Pod de Nextcloud se perdía su configuración: el nuevo Pod se creaba desde la imagen, con el directorio de la aplicación vacío. Sin embargo, la base de datos seguía teniendo la cuenta de administración, por lo que al repetir la instalación aparecía el error **The Login is already being used**. Si se hubiera eliminado el Pod de MariaDB, se habría perdido la base de datos.

En este ejercicio vamos a usar **volúmenes persistentes** para que la información de las aplicaciones no se pierda al eliminar los Pods. Usaremos **aprovisionamiento dinámico**: al crear un PersistentVolumeClaim (PVC), la StorageClass `standard` de minikube crea automáticamente el PersistentVolume (PV) y lo asocia a la solicitud.

## Ejercicio 1: Desplegando un servidor web persistente

Vamos a desplegar un servidor web que ejecute scripts PHP, con la imagen `php:8.5-apache`, guardando el contenido de su *DocumentRoot* (`/var/www/html`) en un volumen persistente.

### La solicitud del volumen

Crea un fichero `pvc-webserver.yaml` a partir de la siguiente plantilla, sustituyendo cada `<...>` por el valor que corresponda:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-webserver
spec:
  accessModes:
    - <modo-de-acceso>
  resources:
    requests:
      storage: <tamaño>
```

Solicita un volumen de 2 GiB (`2Gi`) con el modo de acceso `ReadWriteOnce`. Como no indicamos `storageClassName`, se usará la StorageClass por defecto.

### El despliegue del servidor web

Crea un fichero `webserver-deployment.yaml` a partir de la siguiente plantilla:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webserver
  labels:
    app: webserver
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webserver
  template:
    metadata:
      labels:
        app: webserver
    spec:
      volumes:
        - name: volumen-webserver
          persistentVolumeClaim:
            claimName: <nombre-del-pvc>
      containers:
        - name: contenedor-php
          image: php:8.5-apache
          ports:
            - name: http-server
              containerPort: 80
          volumeMounts:
            - name: volumen-webserver
              mountPath: <punto-de-montaje>
```

* En `volumes` se define un volumen llamado `volumen-webserver` que usa el PVC que has creado (`claimName`).
* En `volumeMounts` se monta ese volumen en el directorio del contenedor que indiques en `mountPath`: el *DocumentRoot* del servidor.

Realiza los siguientes pasos:

1. Crea el PVC. Comprueba que su estado es `Bound` y que se ha creado de forma dinámica un PV asociado a él: `kubectl get pv,pvc`. ¿Qué política de reciclaje (`RECLAIM POLICY`) tiene el PV?
2. Crea el Deployment y comprueba que el Pod está funcionando. Lista el contenido del directorio `/var/www/html` del contenedor (`kubectl exec deploy/webserver -- ls -l /var/www/html`). ¿Qué contiene? ¿Por qué?
3. Crea en el volumen un fichero `info.php`:

    ```bash
    kubectl exec deploy/webserver -- sh -c 'echo "<?php phpinfo(); ?>" > /var/www/html/info.php'
    ```

4. Crea un Service de tipo `NodePort` llamado `webserver`, con el puerto 80 y el nombre de puerto `http-server`, que seleccione los Pods con la etiqueta `app: webserver`. Obtén la URL con `minikube service webserver --url` y accede desde un navegador a `info.php`. Comprueba que se muestra la información de PHP.
5. Comprobemos la persistencia: elimina el Deployment, comprueba que el PVC sigue existiendo y vuelve a crear el Deployment. Accede de nuevo a `info.php`. ¿Se sigue mostrando? ¿Por qué?
6. Elimina el Deployment, el Service y el PVC. Comprueba que también se ha eliminado el PV. ¿Qué habría pasado con el fichero `info.php` si hubieras eliminado el PVC en el paso 5?

## Ejercicio 2: Haciendo persistente la aplicación GuestBook

Vamos a volver a desplegar la aplicación GuestBook de los ejercicios 3 y 4, añadiendo persistencia a la base de datos Redis.

### Redis con almacenamiento persistente

Según la documentación de la imagen `redis`, para que la base de datos guarde cada cambio en el directorio `/data` del contenedor hay que ejecutar el proceso `redis-server` con los argumentos `--appendonly yes`.

Crea un fichero `redis-deployment.yaml` a partir de la siguiente plantilla:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    app: redis
    tier: backend
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: redis
      tier: backend
  template:
    metadata:
      labels:
        app: redis
        tier: backend
    spec:
      volumes:
        - name: volumen-redis
          persistentVolumeClaim:
            claimName: <nombre-del-pvc>
      containers:
        - name: contenedor-redis
          image: redis:8.12
          command: ["redis-server"]
          args: ["--appendonly", "yes"]
          ports:
            - name: redis-server
              containerPort: 6379
          volumeMounts:
            - name: volumen-redis
              mountPath: <punto-de-montaje>
```

* Con `command` indicamos el proceso que ejecuta el contenedor y con `args`, sus argumentos.
* Con `strategy: Recreate`, al actualizar el Deployment se elimina el Pod antiguo **antes** de crear el nuevo. Así nunca hay dos servidores Redis usando los mismos ficheros, algo que sí ocurriría con la estrategia `RollingUpdate`.

Realiza los siguientes pasos:

1. Crea un fichero `pvc-redis.yaml` con un PVC llamado `pvc-redis` que solicite un volumen de 3 GiB, y créalo. Comprueba que se ha asociado un PV de forma dinámica.
2. Completa el fichero `redis-deployment.yaml`: el nombre del PVC y el punto de montaje (`/data`).
3. Crea el Deployment de Redis. El Deployment `guestbook` y los Services `guestbook` y `redis` son los mismos de los ejercicios 3 y 4: créalos también.
4. Accede a la aplicación y escribe algunos mensajes.
5. Comprueba que Redis ha guardado los datos en el volumen: `kubectl exec deploy/redis -- ls -l /data`.
6. Comprobemos la persistencia: elimina el Deployment de Redis y vuelve a crearlo. Accede de nuevo a la aplicación y comprueba que los mensajes no se han perdido.
7. Elimina los recursos que has creado en este ejercicio, incluido el PVC.

## Ejercicio 3: Haciendo persistente la aplicación Nextcloud

Vamos a modificar el despliegue de Nextcloud y MariaDB del ejercicio anterior para que use dos volúmenes persistentes: uno para la aplicación y otro para la base de datos.

**Antes de empezar**, elimina los Deployments de Nextcloud y MariaDB del ejercicio anterior, si todavía existen: su base de datos no estaba en un volumen y queremos empezar con una instalación limpia. Puedes mantener (o volver a crear) el ConfigMap, el Secret, los Services y el Ingress.

Según la documentación de las imágenes:

* Nextcloud guarda la aplicación, su configuración y los ficheros de los usuarios en `/var/www/html`. Si al arrancar encuentra el directorio vacío, copia en él la aplicación.
* MariaDB guarda las bases de datos en `/var/lib/mysql`.

### Los volúmenes en los Deployments

Copia los ficheros `mariadb-deployment.yaml` y `nextcloud-deployment.yaml` del ejercicio anterior y añade a cada uno:

* La estrategia `Recreate`, en `spec`.
* El volumen, en `spec.template.spec`.
* El punto de montaje, en la definición del contenedor, al mismo nivel que `image` y `ports`.

Por ejemplo, para MariaDB:

```yaml
spec:
  replicas: 1
  strategy:
    type: Recreate
  ...
  template:
    ...
    spec:
      volumes:
        - name: volumen-mariadb
          persistentVolumeClaim:
            claimName: <nombre-del-pvc>
      containers:
        - name: contenedor-mariadb
          image: mariadb:11.8
          ports:
            - name: db-port
              containerPort: 3306
          volumeMounts:
            - name: volumen-mariadb
              mountPath: <punto-de-montaje>
          env:
            ...
```

Realiza los siguientes pasos:

1. Crea los ficheros `pvc-nextcloud.yaml` y `pvc-mariadb.yaml` con dos PVC llamados `pvc-nextcloud` y `pvc-mariadb`, que soliciten 4 GiB cada uno. Créalos y comprueba que se ha asociado un PV de forma dinámica a cada uno.
2. Modifica los dos Deployments como se ha indicado y créalos. Crea también el ConfigMap, el Secret, los Services y el Ingress del ejercicio anterior, si no existen.
3. Comprueba que Nextcloud ha copiado la aplicación en su volumen: `kubectl exec deploy/nextcloud -- ls /var/www/html`.
4. Accede a Nextcloud con el navegador usando el nombre del Ingress, completa el asistente de instalación y sube algún fichero.
5. Comprobemos la persistencia: elimina los dos Deployments y vuelve a crearlos. Accede de nuevo a la aplicación y comprueba que no tienes que instalarla otra vez, que puedes entrar con tu cuenta y que el fichero que subiste sigue ahí.
6. ¿Por qué ahora no aparece el error **The Login is already being used**?
7. Elimina los recursos que has creado en este ejercicio, incluidos los PVC.
