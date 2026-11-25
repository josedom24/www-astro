---
title: "Ejercicio 4: Acceso a las aplicaciones"
---

## Ejercicio 1: Despliegue y acceso de la aplicación GuestBook

Una vez que tenemos creados los Deployments de la aplicación GuestBook, que realizamos en el ejercicio anterior (`guestbook` y `redis`), vamos a crear los Services correspondientes para acceder a ella. Comprueba que los tienes creados:

```bash
kubectl get deployments
```

### Service para acceder a la aplicación

El primer Service que vamos a crear nos va a permitir acceder a la aplicación GuestBook desde el exterior. Crea un fichero yaml con la definición del Service a partir de la siguiente plantilla, sustituyendo cada `<...>` por el valor que corresponda:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: guestbook
  labels:
    app: guestbook
    tier: frontend
spec:
  type: <tipo>
  ports:
  - port: <puerto-del-service>
    targetPort: <nombre-del-puerto>
  selector:
    app: guestbook
    tier: frontend
```

Tienes que poner un tipo de Service que permita el acceso desde el exterior, el puerto del Service será el 80 y el nombre del puerto de la aplicación que hemos asignado en el Deployment es `http-server`.

Realiza los siguientes pasos:

1. Elabora el fichero yaml con la definición del Service, y créalo.
2. Comprueba el puerto que le han asignado al Service para acceder desde el exterior. ¿Qué indica el valor `80:3xxxx`?
3. Obtén la URL de acceso con `minikube service guestbook --url` y accede a ella desde un navegador web para ver la aplicación.
4. Responde la siguiente pregunta: ¿Por qué aparece el mensaje de error **Waiting for database connection...**?

### Service para acceder a la base de datos

A continuación vamos a crear el Service para acceder a la base de datos. Crea el fichero yaml para su definición a partir de la siguiente plantilla:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
    tier: backend
spec:
  type: <tipo>
  ports:
  - port: <puerto-del-service>
    targetPort: <nombre-del-puerto>
  selector:
    app: redis
    tier: backend
```

La base de datos no necesita ser accesible desde el exterior, por lo que tienes que elegir el tipo de Service adecuado. El puerto del Service será el 6379 y el nombre del puerto de la base de datos que hemos asignado en el Deployment es `redis-server`.

**Nota: No cambies el nombre del Service, ya que la aplicación guestbook va a acceder por defecto a la base de datos usando el nombre `redis`.**

Realiza los siguientes pasos:

1. Elabora el fichero yaml con la definición del Service, y créalo.
2. Lista los Services que has creado.
3. Obtén información detallada del Service `guestbook` y localiza los *Endpoints*. Compáralos con las direcciones IP de los Pods (`kubectl get pods -o wide`).
4. Accede de nuevo a la aplicación desde el navegador. Comprueba que funciona sin ningún problema.

### Resolución de nombres

Vamos a comprobar cómo accede la aplicación a la base de datos usando el nombre del Service. Para ello crearemos un Pod de pruebas:

```bash
kubectl run busybox --image=busybox:1.37 --command -- sleep 3600
```

Realiza los siguientes pasos:

1. Resuelve el nombre completo del Service de la base de datos desde el Pod: `kubectl exec busybox -- nslookup redis.default.svc.cluster.local`. Comprueba que la dirección IP devuelta es la `CLUSTER-IP` del Service `redis`.
2. Muestra el fichero `/etc/resolv.conf` del Pod (`kubectl exec busybox -- cat /etc/resolv.conf`) e identifica el servidor DNS y los dominios de búsqueda. ¿Por qué la aplicación puede usar simplemente el nombre `redis` para conectar?
3. Accede a la aplicación desde el Pod usando el nombre del Service: `kubectl exec busybox -- wget -qO- http://guestbook`.
4. Elimina el Pod de pruebas.

### Acceso a la aplicación usando Ingress

Vamos a acceder a la aplicación usando un nombre en lugar de una dirección IP y un puerto. Para ello necesitamos un Ingress Controller: usaremos Traefik, que podemos instalar como *addon* de minikube.

Crea el fichero yaml de definición del recurso Ingress a partir de la siguiente plantilla:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: guestbook
spec:
  ingressClassName: traefik
  rules:
  - host: <nombre-de-host>
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: <nombre-del-service>
            port:
              number: <puerto-del-service>
```

Indica un host del tipo *www.tunombre.org*, indica el nombre del Service que creaste para acceder a la aplicación guestbook y ten en cuenta que el puerto de dicho Service era el 80.

Realiza los siguientes pasos:

1. Activa el *addon* `traefik` en minikube para instalar el Ingress Controller. Comprueba que el Pod está corriendo en el espacio de nombres `kube-system` y muestra la `IngressClass` que se ha creado.
2. Crea el recurso Ingress con los datos sugeridos.
3. Obtén información detallada del Ingress y localiza los Pods a los que redirige el tráfico.
4. Modifica el fichero `/etc/hosts` de tu ordenador para que el nombre que has elegido resuelva a la dirección IP de minikube (`minikube ip`).
5. Accede a la aplicación usando el nombre que has asignado.
6. Modifica el fichero yaml del Service `guestbook` para cambiar su tipo a `ClusterIP` y aplica el cambio. Comprueba que el Service ya no tiene un puerto asignado en el nodo y que sigue siendo posible acceder a la aplicación usando el nombre. ¿Por qué no es necesario el NodePort?

### Parte optativa: Service de tipo LoadBalancer

Vamos a crear un Service de tipo LoadBalancer para la aplicación GuestBook. Crea un fichero `guestbook-lb.yaml` con el siguiente contenido:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: guestbook-lb
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: http-server
  selector:
    app: guestbook
    tier: frontend
```

* El tipo `LoadBalancer` solicita al proveedor de la infraestructura un balanceador de carga con una dirección IP externa para el Service.
* El resto de campos son los mismos que en el Service `guestbook` que hemos creado: el puerto del Service, el nombre del puerto de los contenedores y el selector que identifica los Pods.

Realiza los siguientes pasos:

1. Crea el Service y lista los Services. ¿Qué valor aparece en la columna `EXTERNAL-IP`? ¿Por qué?
2. En **otra terminal**, ejecuta `minikube tunnel` (te pedirá la contraseña de administrador) y déjala abierta.
3. Vuelve a listar los Services y comprueba la dirección IP que se ha asignado.
4. Accede a la aplicación desde el navegador usando esa dirección IP (puerto 80).
5. Cierra el túnel con `Ctrl-C` y elimina el Service `guestbook-lb`.

## Ejercicio 2: Despliegue y acceso de la aplicación Temperaturas

Vamos a desplegar una aplicación llamada **Temperaturas**, que nos permite consultar la temperatura mínima y máxima de los municipios de España. Está formada por dos microservicios:

* `frontend`: es una aplicación escrita en Python que ofrece una página web para hacer las búsquedas y visualizar los resultados. Escucha en el puerto 3000/tcp y hace peticiones HTTP al segundo microservicio para obtener la información. Usaremos la imagen `iesgn/temperaturas_frontend`.
* `backend`: ofrece un servicio web de tipo API RESTful en el puerto 5000/tcp, al que se hacen consultas sobre los municipios y sus temperaturas. Usaremos la imagen `iesgn/temperaturas_backend`.

Algunas consideraciones sobre el despliegue:

* Como la aplicación está formada por dos microservicios, tendremos dos recursos Deployment, que se podrán escalar de forma independiente.
* Al `frontend` accederemos desde el exterior, usando un Ingress. Por lo tanto su Service puede ser de tipo `ClusterIP`.
* Al `backend` no es necesario acceder desde el exterior, por lo que su Service también será de tipo `ClusterIP`.
* Por defecto, el `frontend` hace las peticiones al `backend` utilizando el nombre `temperaturas-backend`, por lo que ese será el nombre del Service del `backend`.

Los ficheros de definición de los Deployments son los siguientes. El primero, `frontend-deployment.yaml`, despliega el componente `frontend`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temperaturas-frontend
  labels:
    app: temperaturas
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: temperaturas
      tier: frontend
  template:
    metadata:
      labels:
        app: temperaturas
        tier: frontend
    spec:
      containers:
      - name: contenedor-temperaturas
        image: iesgn/temperaturas_frontend
        ports:
          - name: http-server
            containerPort: 3000
```

* Se crean **3 réplicas** del `frontend`, ya que es el componente que recibe las peticiones de los usuarios.
* Las etiquetas `app` y `tier` identifican la aplicación y el componente. El selector y las etiquetas de los Pods deben coincidir.
* El contenedor ofrece el servicio en el puerto 3000, al que damos el nombre `http-server`.

El segundo, `backend-deployment.yaml`, despliega el componente `backend`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temperaturas-backend
  labels:
    app: temperaturas
    tier: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: temperaturas
      tier: backend
  template:
    metadata:
      labels:
        app: temperaturas
        tier: backend
    spec:
      containers:
      - name: contenedor-servidor-temperaturas
        image: iesgn/temperaturas_backend
        ports:
          - name: api-server
            containerPort: 5000
```

* Se crea **una sola réplica** del `backend`.
* La etiqueta `tier` toma el valor `backend`, que será la que use su Service para seleccionar los Pods.
* El contenedor ofrece la API en el puerto 5000, al que damos el nombre `api-server`.

Realiza los siguientes pasos:

1. Crea el fichero `frontend-deployment.yaml` y crea el Deployment del `frontend`. Todavía no despliegues el `backend`.
2. Crea el Service para acceder al `frontend`, tomando como modelo el Service de GuestBook: de tipo `ClusterIP`, con el puerto 3000 y el nombre de puerto `http-server`, y seleccionando los Pods con las etiquetas `app: temperaturas` y `tier: frontend`.
3. Crea un recurso Ingress para acceder al `frontend` usando un nombre del tipo *www.temperaturas-tunombre.org*, tomando como modelo el Ingress de GuestBook, y añade el nombre a tu fichero `/etc/hosts`.
4. Accede a la aplicación con el navegador. Aparece el mensaje **No puedo conectar con el servidor de temperaturas...**. ¿Por qué?
5. Crea el fichero `backend-deployment.yaml` y crea el Deployment del `backend`.
6. Crea el Service para acceder al `backend`: de tipo `ClusterIP`, con el puerto 5000, el nombre de puerto `api-server`, y seleccionando los Pods con las etiquetas `app: temperaturas` y `tier: backend`. **Nota: el nombre del Service debe ser `temperaturas-backend`.**
7. Refresca la página en el navegador y busca el municipio donde vives. Comprueba que se muestran las temperaturas.
8. Fíjate en el pie de página, donde aparece el nombre del Pod que ha servido la página. Refresca varias veces (F5) y comprueba cómo va cambiando: se está realizando el balanceo de carga entre los Pods del `frontend`.
9. Escala el Deployment del `frontend` a 5 réplicas y el del `backend` a 2, y comprueba que la aplicación sigue funcionando. ¿Qué ventaja tiene haber desplegado cada microservicio por separado?
10. Elimina los recursos que has creado en este ejercicio: el Ingress, los Services y los Deployments.
