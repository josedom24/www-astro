---
date: 2018-07-03
title: 'Recursos de Kubernetes: ReplicaSet'
guid: https://www.josedomingo.org/pledin/?p=2001
slug: 2018/07/recursos-de-kubernetes-replicaset
tags:
  - Cloud Computing
  - kubernetes
---

[`ReplicaSet`](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) es un recurso de Kubernetes que asegura que siempre se ejecute un número de réplicas de un pod determinado. Por lo tanto, nos asegura que un conjunto de pods siempre están funcionando y disponibles. Nos proporciona las siguientes características:

* Que no haya caída del servicio
* Tolerancia a errores
* Escalabilidad dinámica

![rs](/pledin/assets/2018/07/rs.png)

<!--more-->

## Definición yaml de un ReplicaSet

Vamos a ver un ejemplo de definición de ReplicaSet en el fichero `nginx-rs.yaml`:

    apiVersion: extensions/v1beta1
    kind: ReplicaSet
    metadata:
      name: nginx
      namespace: default
    spec:
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
            - image:  nginx
              name:  nginx

* `replicas`: Indicamos el número de pos que siempre se van a estar ejecutando.
* `selector`: Indicamos el pods que vamos a replicar y vamos a controlar con el ReplicaSet. En este caso va a controlar pods que tenga un *label* `app` cuyo valor sea `nginx`. Si no se indica el campo `selector` se seleccionar or defecto los pods cuyos labels sean iguales a los que hemos declarado en la sección siguiente.
* `template`: El recurso `ReplicaSet` contiene la definición de un `pod`.

Al crear el `ReplicaSet` se crearán los pods que hemos indicado como número de replicas:

    kubectl create -f nginx-rs.yaml
    replicaset.extensions "nginx" created

Veamos  el `ReplicaSet` creado y los pods que ha levantado.

    kubectl get rs
    NAME      DESIRED   CURRENT   READY     AGE
    nginx     2         2         2         44s

    kubectl get pods
    NAME          READY     STATUS    RESTARTS   AGE
    nginx-5b2rn   1/1       Running   0          1m
    nginx-6kfzg   1/1       Running   0          1m

¿Qué pasaría si borro uno de los pods que se han creado? Inmediatamente se creará uno nuevo para que siempre estén ejecutándose los pods deseados, en este caso 2:

    kubectl delete pod nginx-5b2rn
    pod "nginx-5b2rn" deleted
    
    kubectl get pods
    NAME          READY     STATUS              RESTARTS   AGE
    nginx-6kfzg   1/1       Running             0          2m
    nginx-lkvzj   0/1       ContainerCreating   0          4s
    
    kubectl get pods
    NAME          READY     STATUS    RESTARTS   AGE
    nginx-6kfzg   1/1       Running   0          2m
    nginx-lkvzj   1/1       Running   0          8s

En cualquier momento puedo escalar el número de pods que queremos que se ejecuten:

    kubectl scale rs nginx --replicas=5
    replicaset.extensions "nginx" scaled
    
    kubectl get pods --watch
    NAME          READY     STATUS    RESTARTS   AGE
    nginx-6kfzg   1/1       Running   0          5m
    nginx-bz2gs   1/1       Running   0          46s
    nginx-lkvzj   1/1       Running   0          3m
    nginx-ssblp   1/1       Running   0          46s
    nginx-xxg4j   1/1       Running   0          46s

Como anteriormente vimos podemos modificar las características de un `ReplicaSet` con la siguiente instrucción:

    kubectl edit rs nginx

Por último si borramos un `ReplicaSet` se borraran todos los pods asociados:

    kubectl delete rs nginx
    replicaset.extensions "nginx" deleted

    kubectl get rs
    No resources found.

    kubectl get pods 
    No resources found.

El uso del recurso `ReplicaSet` sustituye al uso del recurso [`ReplicaController`](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/), más concretamente el uso de `Deployment` que define un `ReplicaSet`.

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

