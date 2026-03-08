---
date: 2018-11-07
title: 'Recursos de Kubernetes: Services'
slug: 2018/11/recursos-de-kubernetes-services
tags:
  - Cloud Computing
  - kubernetes
---
Los servicios ([`services`](https://kubernetes.io/docs/concepts/services-networking/service/)) nos permiten acceder a nuestra aplicaciones.

* Un servicio es una abstracción que define un conjunto de pods que implementan un micro-servicio. (Por ejemplo el *servicio frontend*).
* Ofrecen una dirección virtual (CLUSTER-IP) y un nombre que identifica al conjunto de pods que representa, al cual nos podemos conectar.
* La conexión al servicio se puede realizar desde otros pods o desde el exterior (mediante la generación aleatoria de un puerto).

![services](/pledin/assets/2018/11/services.png)

Los servicios se implementan con *iptables*. El componente *kube-proxy* de Kubernetes se comunica con el servidor de API para comprobar si se han creado nuevos servicios. 

Cuando se crea un nuevo servicio, se le asigna una nueva ip interna virtual (IP-CLUSTER) que permite conexiones desde otros pods. Además podemos habilitar el acceso desde el exterior, se abre un puerto aleatorio que permite que accediendo a la IP del cluster y a ese puerto se acceda al conjunto de pods. Si tenemos más de un pod el acceso se hará siguiendo una política *round-robin*.

<!--more-->

## Tipos de servicios

* **ClusterIP**: Solo permite el acceso interno entre distintos servicios. Es el tipo por defecto. Podemos acceder desde el exterior con la instrucción `kubectl proxy`, puede de ser gran ayuda para los desarrolladores.

![service](/pledin/assets/2018/11/clusterip.png)

* **NodePort**: Abre un puerto, para que el servicio sea accesible desde el exterior. Por defecto el puerto generado está en el rango de 30000:40000. Para acceder usamos la ip del servidor master del cluster y el puerto asignado.

![service](/pledin/assets/2018/11/nodeport.png)

* **LoadBalancer**: Este tipo sólo esta soportado en servicios de cloud público (GKE, AKS o AWS). El proveedor asignara un recurso de balanceo ed carga para el acceso a los servicios. si usamos un cloud privado, como OpenSatck necesitaremos un plugin para configurar el funcionamiento.

![service](/pledin/assets/2018/11/loadbalancer.png)

## Creación de un recurso services del tipo ClusterIP

Para crear un servicio, podemos utilizar la definición del recurso en un fichero yaml, por ejemplo:

    apiVersion: v1
    kind: Service
    metadata:
      name: nginx
      namespace: default
    spec:
      type: ClusterIP
      ports:
      - name: http
        port: 80
        targetPort: http
      selector:
        app: nginx

En este caso vamos a crear un servicio del tipo *ClusterIP*. Con el parámetro `selector` hemos seleccionado los pods a los que vamos a ofrecer acceso. Por último definimos el puerto que va exponer el servicio.

    kubectl create -f ../ejemplos/nginx/nginx-srv.yaml 
    service "nginx" created

También podríamos haber creado el servicio sin usar el fichero yaml, de la siguiente manera:

    kubectl expose deployment/nginx --port=80 --type=ClusterIP

Podemos ver el servicio que hemos creado:

    kubectl get svc
    NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
    kubernetes   ClusterIP   10.96.0.1     <none>        443/TCP   3d
    nginx        ClusterIP   10.99.21.74   <none>        80/TCP    10s

Como vemos también tenemos un servicio llamado `kubernetes` que nos ofrece acceso interno al cluster.

## Acceso a un servicio ClusterIP

Como hemos comentado con un servicio del tipo *ClusterIP* no podemos acceder desde el exterior. Cualquier pod si podría acceder a ese servicio. 

Sin embargo, puede ser bueno acceder desde exterior, por ejemplo en la fase de desarrollo de una aplicación para probarla. Para realizar el acceso vamos a crear un proxy al cluster de Kubernetes para poder acceder directamente a la API, para ello:

    kubectl proxy

Y podemos acceder desde el navegador a una URL de este tipo:

    http://localhost:8001/api/v1/namespaces/<NAMESPACE>/services/<SERVICE NAME>:<PORT NAME>/proxy/

En nuestro caso, en el que estamos trabajando en el espacio de nombres `default`, sería:

![clusterip](/pledin/assets/2018/11/acceso_clusterip.png)

## Creación de un recurso services del tipo NodePort

Podríamos modificar el servicio que anteriormente hemos creado, y cambiarle el tipo, utilizando:

    kubectl edit service/nginx

O también podemos borrar el servicio que tenemos y crear uno nuevo indicando el tipo de servicio:

    kubectl delete service nginx

    kubectl expose deployment/nginx --port=80 --type=NodePort

O utilizar la definición del servicio en un fichero yaml, por ejemplo tenemos el fichero [`nginx-srv.yam`](https://github.com/josedom24/kubernetes/blob/master/ejemplos/nginx/nginx-srv.yaml):

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

Creamos el servicio:

    kubectl create -f ../ejemplos/nginx/nginx-srv.yaml 
    service "nginx" created

Podemos ver el servicio que hemos creado:

    kubectl get svc
    NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
    kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        3d
    nginx        NodePort    10.111.102.186   <none>        80:30305/TCP   3h

## Acceso a un servicio NodePort

Ahora podemos acceder a nuestra aplicación utilizando la IP del cluster de Kubernetes y el puerto que se ha asignado al servicio, en nuestro caso el 30305.

![clusterip](/pledin/assets/2018/11/acceso_nodeport.png)

## Índice de entradas sobre Kubernetes

Este artículo corresponde a una serie de entradas donde he hablado sobre Kubernetes:

* [Instalación de kubernetes con kubeadm](https://www.josedomingo.org/pledin/2018/05/instalacion-de-kubernetes-con-kubeadm/)
* [Desplegando una aplicación en Kubernetes](https://www.josedomingo.org/pledin/2018/05/desplegando-una-aplicacion-en-kubernetes/)
* [Recursos de Kubernetes: Pods](https://www.josedomingo.org/pledin/2018/06/recursos-de-kubernetes-pods/)
* [Recursos de Kubernetes: ReplicaSet](https://www.josedomingo.org/pledin/2018/07/recursos-de-kubernetes-replicaset/)
* [Recursos de Kubernetes: Deployment](https://www.josedomingo.org/pledin/2018/07/recursos-de-kubernetes-deployment/)
* [Kubernetes: Desplegando la aplicación Mediawiki](https://www.josedomingo.org/pledin/2018/10/kubernetes-desplegando-mediawiki/)
* [Kubernetes: Desplegando la aplicación GuestBook (Parte 1)](https://www.josedomingo.org/pledin/2018/10/kubernetes-desplegando-guestbook1/)
* [Recursos de Kubernetes: Services](https://www.josedomingo.org/pledin/2018/11/recursos-de-kubernetes-services/)
* [El servicio DNS en Kubernetes](https://www.josedomingo.org/pledin/2018/11/sercicio-dns-kubernetes)
* [Kubernetes: Desplegando la aplicación GuestBook (Parte 2)](https://www.josedomingo.org/pledin/2018/11/kubernetes-desplegando-guestbook2/)
* [Kubernetes: Desplegando la aplicación LetsChat](https://www.josedomingo.org/pledin/2018/12/kubernetes-letschat/)
* [Recursos de Kubernetes: Ingress](https://www.josedomingo.org/pledin/2018/12/kubernetes-ingress/)
* [Accediendo a nuestras aplicaciones Kubernetes con Ingress](https://www.josedomingo.org/pledin/2018/12/kubernetes-acceso-ingress/)
* [Recursos de Kubernetes: Namespaces](https://www.josedomingo.org/pledin/2019/01/kubernetes-namespaces/)
* [Kubernetes. Configurando nuestras aplicaciones: variables de entornos, ConfigMap, Secrets](https://www.josedomingo.org/pledin/2019/02/kubernetes-config-app/)
* [Kubernetes. Desplegando WordPress con MariaDB](https://www.josedomingo.org/pledin/2019/03/kubernetes-wordpress/)
* [Almacenamiento en Kubernetes. PersistentVolumen. PersistentVolumenClaims](https://www.josedomingo.org/pledin/2019/03/almacenamiento-kubernetes/)
* [Kubernetes. Desplegando WordPress con MariaDB con almacenamiento persistente](https://www.josedomingo.org/pledin/2019/04/kubernetes-wordpress-almacenamiento-persistente/)
* [Integración de Kubernetes con OpenStack](https://www.josedomingo.org/pledin/2019/05/kubernetes-openstack/)
