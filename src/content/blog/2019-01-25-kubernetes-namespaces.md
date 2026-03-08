---
date: 2019-01-25
title: 'Recursos de Kubernetes: Namespaces'
slug: 2019/01/kubernetes-namespaces
tags:
  - Cloud Computing
  - kubernetes
---

Los [`Namespaces`](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) nos permiten aislar recursos para el uso por los distintos usuarios del cluster, para trabajar en distintos proyectos. A cada `namespace` se le puede asignar una cuota y definirle reglas y políticas de acceso.

## Trabajando con Namespaces

Para obtener la lista de `Namespaces` ejecutamos:

    kubectl get namespaces
    NAME          STATUS    AGE
    default       Active    1d
    kube-public   Active    1d
    kube-system   Active    1d

* `default`: Espacio de nombres por defecto.
* `kube-system`: Espacio de nombres creado y gestionado por Kubernetes.
* `kube-public`: Espacio de nombres accesible por todos los usuarios, reservado para uso interno del cluster.

Para crear un nuevo `Namespace`:

    kubectl create ns proyecto1
    namespace "proyecto1" created

<!--more-->

Otra forma de crear un `Namespace` es a partir de un fichero yaml con su definición:

    apiVersion: v1
    kind: Namespace
    metadata:
      name: proyecto1

Podemos ver las características del nuevo espacio de nombres:

    kubectl describe ns proyecto1
    Name:         proyecto1
    Labels:       <none>
    Annotations:  <none>
    Status:       Active

    No resource quota.

    No resource limits.

Y su definición yaml:

    kubectl get ns proyecto1 -o yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      creationTimestamp: 2018-05-23T16:19:58Z
      name: proyecto1
      resourceVersion: "152566"
      selfLink: /api/v1/namespaces/proyecto1
      uid: 2306825c-5ea5-11e8-ab66-fa163e99cb75
    spec:
      finalizers:
      - kubernetes
    status:
      phase: Active

## Crear recursos en un namespace

Para crear un recurso en un `namespace` debemos indicar el nombre del espacio de nombres en la etiqueta `namespace` en su definición:

    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: nginx
      namespace: proyecto1
      ...

También podemos crearlos sin el fichero yaml:

    kubectl run nginx --image=nginx -n proyecto1
    deployment.apps "nginx" created

    kubectl get deploy -n proyecto1
    NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx     1         1         1            1           15s

Y creamos el servicio asociado:

    kubectl expose deployment/nginx --port=80 --type=NodePort -n proyecto1
    service "nginx" exposed
    
    kubectl get services -n proyecto1
    NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
    nginx     NodePort   10.107.121.169   <none>        80:30352/TCP   10s

## Configurando un namespace por defecto

Podemos indicar en un determinado contexto (un contexto determina el cluter y el usuario que podemos utilizar) un `namespace`, de tal manera que cuando utilicemos dicho contexto se va a utilizar el `namespace` indicado, y no será necesario indicarlo con la opción `-n`. Para ello es necesario determinar el contexto en el que estamos trabajando:

    kubectl config current-context
    kubernetes-admin@kubernetes

Y a continuación modifico el contexto añadiendo el namespace que quiero usar por defecto.

    kubectl config set-context kubernetes-admin@kubernetes --namespace=proyecto1
    Context "kubernetes-admin@kubernetes" modified.

## Eliminando un namespace

Al eliminar un `namespace` se borran todos los recursos que hemos creado en él. 

    kubectl delete ns proyecto1
    namespace "proyecto1" deleted

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
