---
title: "Ejercicio 3: Trabajando con Deployments"
---

## Tanda 1: Creación y gestión de un Deployment

En esta tanda vamos a crear un Deployment de una aplicación web y a gestionarlo. Realiza los siguientes pasos:

1. Crea un fichero yaml con la descripción del recurso Deployment, teniendo en cuenta los siguientes aspectos:
    * Indica nombres distintos para el Deployment y para el contenedor de los Pods que va a controlar.
    * El Deployment va a crear 2 réplicas.
    * La imagen que debes desplegar es `iesgn/test_web:latest`.
    * Indica de manera adecuada una etiqueta en la especificación del Pod que vas a definir que coincida con el *selector* del Deployment.

    Puedes partir de esta plantilla, sustituyendo cada `<...>` por el valor que corresponda:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: <nombre-del-deployment>
    spec:
      replicas: <número-de-réplicas>
      selector:
        matchLabels:
          <clave>: <valor>
      template:
        metadata:
          labels:
            <clave>: <valor>
        spec:
          containers:
            - image: <imagen>
              name: <nombre-del-contenedor>
              ports:
                - name: http
                  containerPort: 80
    ```

2. Crea el Deployment con `kubectl apply` y comprueba con `kubectl rollout status` que el despliegue ha terminado.
3. Comprueba los recursos que se han creado: Deployment, ReplicaSet y Pods. Fíjate en cómo se construye el nombre del ReplicaSet y de los Pods.
4. Obtén información detallada del Deployment creado. Localiza la estrategia de actualización que utiliza y el ReplicaSet que ha creado.
5. Crea una redirección utilizando `port-forward` sobre el Deployment para acceder a la aplicación, sabiendo que la aplicación ofrece el servicio en el puerto 80, y accede a la aplicación con un navegador web.
6. Accede a los logs del Deployment para comprobar el acceso que has hecho en el punto anterior.
7. Escala el Deployment a 4 réplicas con `kubectl scale` y comprueba los Pods.
8. Vuelve a aplicar el fichero yaml con `kubectl apply` y comprueba cuántas réplicas tiene ahora el Deployment. ¿Por qué?
9. Elimina el Deployment y comprueba que se han borrado todos los recursos creados.

## Tanda 2: Actualización y rollback de nuestra aplicación

El equipo de desarrollo ha creado una primera versión preliminar de una aplicación web y ha creado una imagen de contenedor con el siguiente nombre: `iesgn/test_web:version1`.

### Despliegue de la versión 1

1. Crea un fichero yaml (puedes usar el de la tanda anterior) para desplegar la imagen `iesgn/test_web:version1` con 2 réplicas.
2. Crea el Deployment y comprueba que ha terminado con `kubectl rollout status`. Recuerda realizar una anotación para indicar las características del despliegue.
3. Crea una redirección utilizando `port-forward` para acceder a la aplicación, sabiendo que la aplicación ofrece el servicio en el puerto 80, y accede a ella con un navegador web.

### Actualización a la versión 2

El equipo de desarrollo ya tiene lista la versión 2 de la aplicación, con la imagen `iesgn/test_web:version2`. Vamos a actualizar el despliegue **modificando el fichero yaml**:

1. Cambia la imagen en el fichero yaml y aplica el cambio. Sigue el proceso con `kubectl rollout status` (si quieres, en otra terminal, con `kubectl get pods -w`) y anota la causa del cambio.
2. Comprueba los recursos que se han creado: Deployment, ReplicaSet y Pods. ¿Cuántos ReplicaSets hay? ¿Cuántos Pods tiene cada uno?
3. Visualiza el historial de actualizaciones.
4. Crea una redirección con `port-forward` y comprueba con el navegador que ya se muestra la versión 2.

### Actualización a la versión 3

Finalmente, el equipo de desarrollo ha creado la imagen `iesgn/test_web:version3` con la última versión de la aplicación. Esta vez vamos a actualizar **sin modificar el fichero yaml**, con `kubectl set image`:

1. Actualiza el Deployment con la nueva imagen y anota la causa del cambio.
2. Comprueba los recursos que se han creado y visualiza el historial de actualizaciones.
3. Crea una redirección con `port-forward` y accede a la aplicación con el navegador.

¡Vaya!, parece que esta versión tiene un fallo y no se ve de forma adecuada la hoja de estilos. Tenemos que volver a la versión anterior.

### Rollback

1. Ejecuta la instrucción que nos permite hacer un *rollback* del despliegue.
2. Comprueba la imagen que utiliza ahora el Deployment y visualiza el historial de actualizaciones. ¿Qué número de revisión tiene ahora la versión 2?
3. Comprueba con el navegador que vuelve a mostrarse la versión 2.
4. Comprueba qué versión de la imagen indica tu fichero yaml. ¿Coincide con la que está desplegada? ¿Qué pasaría si volvieras a aplicar el fichero?

### Rollback declarativo

1. Vuelve a la versión 1 modificando el fichero yaml y aplicándolo, en lugar de usar `kubectl rollout undo`.
2. Anota la causa del cambio y visualiza el historial de actualizaciones.
3. Comprueba con el navegador que se muestra la versión 1.

### Un despliegue que falla

1. Actualiza el Deployment a una imagen que no existe: `iesgn/test_web:version99`.
2. Comprueba el estado de los Pods. ¿Qué error aparece en el Pod nuevo? ¿Qué ocurre con los Pods antiguos?
3. Comprueba con `kubectl rollout status --timeout=30s` que la actualización no se completa, y con el navegador que la aplicación sigue funcionando.
4. Vuelve a la versión anterior con `kubectl rollout undo` y comprueba que los Pods vuelven a estar correctos.
5. Elimina el Deployment.

## Despliegue de la aplicación GuestBook

En esta tarea vamos a desplegar una aplicación web que requiere de dos servicios para su ejecución. La aplicación se llama GuestBook y necesita los siguientes servicios:

* La aplicación Guestbook es una aplicación web desarrollada en python que es servida en el puerto 5000/tcp. Utilizaremos la imagen `iesgn/guestbook`.
* Esta aplicación guarda la información en una base de datos no relacional redis, que utiliza el puerto 6379/tcp para recibir las conexiones. Usaremos la imagen `redis`.

Por lo tanto, si tenemos dos servicios distintos, tendremos dos ficheros yaml para crear dos recursos Deployment, uno para cada servicio. Con esta manera de trabajar podemos obtener las siguientes características:

1. Cada conjunto de Pods creado en cada despliegue ejecutará un solo proceso para ofrecer el servicio.
2. Cada conjunto de Pods se puede escalar de manera independiente. Esto es importante: si identificamos que al acceder a alguno de los servicios se crea un cuello de botella, podemos escalarlo para tener más Pods ejecutando el servicio.
3. Las actualizaciones de los distintos servicios no interfieren en el resto.
4. Lo estudiaremos más adelante, pero podremos gestionar el almacenamiento de cada servicio de forma independiente.

Para desplegar la aplicación tendremos dos ficheros yaml. El primero, `guestbook-deployment.yaml`, despliega la aplicación web:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guestbook
  labels:
    app: guestbook
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: guestbook
      tier: frontend
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: contenedor-guestbook
        image: iesgn/guestbook
        ports:
          - name: http-server
            containerPort: 5000
```

* Se crean **3 réplicas** de la aplicación, ya que es el servicio que recibe las peticiones de los usuarios.
* Se utilizan dos etiquetas: `app`, con el nombre de la aplicación, y `tier`, que indica la capa de la arquitectura (`frontend`). El selector y las etiquetas de los Pods deben coincidir.
* El contenedor ofrece el servicio en el puerto 5000, que se indica en `containerPort`.

El segundo, `redis-deployment.yaml`, despliega la base de datos:

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
      containers:
        - name: contenedor-redis
          image: redis
          ports:
            - name: redis-server
              containerPort: 6379
```

* Se crea **una sola réplica**: cada réplica de `redis` sería una base de datos independiente, sin compartir los datos.
* La etiqueta `tier` toma ahora el valor `backend`.
* El contenedor ofrece el servicio en el puerto 6379, el puerto estándar de redis.

Para realizar el despliegue realiza los siguientes pasos:

1. Crea los dos ficheros yaml anteriores y crea los dos Deployments.
2. Comprueba los recursos que se han creado: Deployments, ReplicaSets y Pods.
3. Crea una redirección utilizando `port-forward` para acceder a la aplicación, sabiendo que la aplicación ofrece el servicio en el puerto 5000, y accede a la aplicación con un navegador web.

¿Qué aparece en la página principal de la aplicación? Aparece el siguiente mensaje: **Waiting for database connection...**. Por lo tanto podemos sacar varias conclusiones:

1. Hasta ahora no estamos accediendo de forma "normal" a las aplicaciones. El uso de la opción `port-forward` es un mecanismo que realmente nos posibilita acceder a la aplicación, pero utilizando un proxy. Deberíamos acceder a las aplicaciones usando una ip y un puerto determinado.
2. Parece que tampoco hay acceso entre los Pods de los distintos despliegues. Parece que los Pods de la aplicación guestbook no pueden acceder al Pod donde se está ejecutando la base de datos redis.

En el siguiente ejercicio estudiaremos los recursos que nos ofrece la API de Kubernetes para permitirnos el acceso a las aplicaciones desde el exterior, y para que los distintos Pods de los despliegues puedan acceder entre ellos.
