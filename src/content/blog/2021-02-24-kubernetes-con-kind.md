---
date: 2021-02-24
title: 'Creando un cluster de kubernetes con kind'
slug: 2021/02/kubernetes-con-kind
tags:
  - kubernetes
  - docker
---

![kind](/pledin/assets/2021/02/logo.png)

kind nos permite crear un cluster kubernetes en nuestra máquina local. Es necesario tener instalador docker, ya que cada nodo del cluster se va a crear en un contenedor.

## Instalación de kind

Vamos a realizar la instalación en un sistema Debian Buster, donde hemos instalado previamente docker:

	$ docker --version
	Docker version 18.09.1, build 4c52b90

La manera más cómoda de instalar kind es bajando el binario, que colocaremos en un directorio accesible desde `$PATH`. Para ello ejecutamos la siguientes instrucciones:

	$ curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.10.0/kind-linux-amd64
	$ chmod +x ./kind
	$ sudo mv ./kind /usr/local/bin

Y comprobamos la versión que hemos descargado:

	$ $ kind version
	kind v0.10.0 go1.15.7 linux/amd64

## Construcción de un cluster kubernetes con kind

Crear un cluster kubernetes con kind es tan simple como ejecutar la siguiente instrucción:

	kind create cluster

<!--more-->

Este comando descargará una imagen docker y creará un contenedor desde la imagen descargada que tendrá el rol de controlador y worker.

Sin embargo es muy sencillo crear cluster más complejos. Para ello simplemente creamos un fichero `config.yaml` donde vamos a declarar los nodos que tiene el cluster y los roles de cada uno de ellos, por ejemplo:

	kind: Cluster
	apiVersion: kind.x-k8s.io/v1alpha4
	nodes:
	- role: control-plane
	- role: worker
	- role: worker

Crearía un cluster con tres nodos: un controlador y dos workers.

Veamos otro ejemplo:

	kind: Cluster
	apiVersion: kind.x-k8s.io/v1alpha4
	nodes:
	- role: control-plane
	- role: control-plane
	- role: control-plane
	- role: worker
	- role: worker
	- role: worker

Crearía un cluster con 6 nodos: 3 controladores en alta disponibilidad y 3 workers.
Vamos a crear un cluster usando la primera configuración, para ello ejecutamos el siguiente comando:

	$ kind create cluster --config=config.yaml
	Creating cluster "kind" ...
	 ✓ Ensuring node image (kindest/node:v1.20.2) 🖼 
	 ✓ Preparing nodes 📦 📦 📦  
	 ✓ Writing configuration 📜 
	 ✓ Starting control-plane 🕹️ 
	 ✓ Installing CNI 🔌 
	 ✓ Installing StorageClass 💾 
	 ✓ Joining worker nodes 🚜 
	Set kubectl context to "kind-kind"
	You can now use your cluster with:

	kubectl cluster-info --context kind-kind

	Thanks for using kind! 😊

Podemos comprobar el cluster que hemos creado y los nodos:

	$ kind get clusters
	kind

	$ kind get nodes
	kind-control-plane
	kind-worker
	kind-worker2

Efectivamente comprobamos que se ha descargado una imagen docker y se han creado 3 contenedores:

	$ docker images
	REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
	kindest/node        <none>              094599011731        4 weeks ago         1.17GB

	$ docker ps
	CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
	f4c2852c0369        kindest/node:v1.20.2   "/usr/local/bin/entr…"   4 minutes ago       Up 4 minutes        127.0.0.1:45509->6443/tcp   kind-control-plane
	6225367892a0        kindest/node:v1.20.2   "/usr/local/bin/entr…"   4 minutes ago       Up 4 minutes                                    kind-worker
	31d1315870c5        kindest/node:v1.20.2   "/usr/local/bin/entr…"   4 minutes ago       Up 4 minutes                                    kind-worker2

Finalmente cuando queramos destruir el cluster, simplemente ejecutaremos:

	$ kind delete cluster

## Interactuando con el cluster kubernetes

Para interactuar con nuestro cluster hemos instalado la utilidad [kubbectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). Además podemos comprobar que cuando se ha creado el cluster, se ha creado el fichero de configuración con nuestras credenciales para el acceso en `~/.kube/config`, por lo que ya podemos empezar a jugar con nuestro cluster, por ejemplo:

	$ kubectl get nodes
	NAME                 STATUS   ROLES                  AGE     VERSION
	kind-control-plane   Ready    control-plane,master   8m54s   v1.20.2
	kind-worker          Ready    <none>                 8m15s   v1.20.2
	kind-worker2         Ready    <none>                 8m15s   v1.20.2

Vamos a crear un despliegue en nuestro cluster a partir del fichero `deployment.yaml`:

	apiVersion: apps/v1
	kind: Deployment
	metadata:
	  name: nginx
	  namespace: default
	  labels:
	    app: nginx
	spec:
	  revisionHistoryLimit: 2
	  strategy:
	    type: RollingUpdate
	  replicas: 2
	  selector:
	    matchLabels:
	      app: nginx
	  template:
	    metadata:
	      labels:
	        app: nginx
	    spec:
	      containers:
	      - image: nginx
	        name: nginx
	        ports:
	        - name: http
	          containerPort: 80

Y un servicio de tipo *NodePort* a partir del fichero `service.yaml`:

	apiVersion: v1
	kind: Service
	metadata:
	  name: nginx
	  namespace: default
	spec:
	  type: NodePort
	  ports:
	  - name: http
	    port: 80
	    targetPort: http
	  selector:
	    app: nginx


Lo creamos y comprobamos los recursos que se han creado:

	$ kubectl apply -f deployment.yaml 
	deployment.apps/nginx created

	$ kubectl create -f service.yaml 
	service/nginx created


	$ kubectl get all
	NAME                        READY   STATUS    RESTARTS   AGE
	pod/nginx-bdc5c7d65-cbz69   1/1     Running   0          2m55s
	pod/nginx-bdc5c7d65-kj7vx   1/1     Running   0          2m18s
	
	NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
	service/kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        16m
	service/nginx        NodePort    10.96.242.80   <none>        80:31684/TCP   15s
	
	NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
	deployment.apps/nginx   2/2     2            2           2m55s
	
	NAME                              DESIRED   CURRENT   READY   AGE
	replicaset.apps/nginx-bdc5c7d65   2         2         2       2m55s

En este ejemplo deberíamos acceder a la ip del nodo controlador y al puerto 31684 para acceder a la aplicación. Para obtener la ip del contenedor podemos ejecutar:
  
  
  ```bash
	$ docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' kind-control-plane
	172.20.0.4
  ```
  
Por lo tanto desde un navegador podemos acceder a esa ip y al puerto asignado por el servicio, para ver la aplicación:

![kind](/pledin/assets/2021/02/kind.png)

## Instalando un controlador ingress a nuestro cluster

Tenemos [varias opciones](https://kind.sigs.k8s.io/docs/user/ingress/#using-ingress) en la documentación para instalar un controlador ingress en nuestro cluster. Nosotrs vamos a intalar un nginx ingres, para ello ejecutamos la siguiente instrucción:

	$ kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/usage.yaml

Esto creará un namespace llamado `ingress-nginx` con todos los recursos necesarios para que funcione el proxy inverso.

Cuando he ejecutado la instrucción anterior, me he dado cuenta que el pod que se debe crear para que funcione nginx se que da en estado **pending**, buscando información he llegado a la conclusión de que no encuentra nodos afines para desplegarse, ya que necesita que los nodos estén etiquetados con la etiqueta `ingress-ready=true`, para etiquetar los nodos del cluster ejecutamos:

	$ kubectl label node --all  ingress-ready=true

Y al cabo de unos segundos ya tenemos el pod ejecutándose.

A continuación podemos hacer una prueba de un recurso ingress usando el fichero `ingress.yaml` con el siguietne contenido:

	apiVersion: networking.k8s.io/v1
	kind: Ingress
	metadata:
	  name: nginx
	  annotations:
	    nginx.ingress.kubernetes.io/rewrite-target: /
	spec:
	  rules:
	  - host: nginx.172.20.0.4.nip.io
	    http:
	      paths:
	      - path: /
	        pathType: Prefix
	        backend:
	          service:
	            name: nginx
	            port:
	              number: 80


Como puedes observar para indicar el nombre del host, he usado el dominio [nip.io](https://nip.io/) para no usar resolución estática. Creamos el ingress, comprobamos que se ha creado y accedemos a la página utilizando el nombre indicado:

	$ kubectl create -f ingress.yaml 
	ingress.networking.k8s.io/nginx created

	$ kubectl get ingress
	NAME    CLASS    HOSTS                     ADDRESS   PORTS   AGE
	nginx   <none>   nginx.172.20.0.4.nip.io             80      7s

![kind](/pledin/assets/2021/02/kind2.png)


## Conclusiones

Si queremos una forma sencilla de construir un cluster de kuberentes en nuestra máquina local de una forma rápida y sencilla, kind es una de las alternativas que tenemos. Evidentemente en ningún momento estamos creando un cluster para producción, pero para "jugar" y aprender a usar kubernetes nos puede venir genial. Una limitación que he encontrado, debido a que los nodos se crean en contenedores docker, es que si instalamos el cluster en una máquina sin entorno gráfico, tendremos que usar un navegador de terminal para acceder a la ip del nodo maestro. He intentando crear reglas DNAT para intentar acceder desde otra máquina externa al cluster pero no he sido capaz de configurarlo, la reglas de cortafuegos que implementan docker son complicadas para mí y no lo he logrado.	

A excepción de esta limitación (que seguro que es porque no tengo conocimientos suficientes para solucionarla, "si alguien por ahí que sepa como hacerlo, que me lo diga para solucionarlo!!!"), kind nos proporciona una manera rápida y fácil de crear cluster de kubernetes que merece la pena probar.

