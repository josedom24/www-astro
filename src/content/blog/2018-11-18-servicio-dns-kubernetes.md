---
date: 2018-11-18
title: 'El servicio DNS en Kubernetes'
slug: 2018/11/sercicio-dns-kubernetes
tags:
  - Cloud Computing
  - kubernetes
---

Existe un componente de Kubernetes llamado *KubeDNS*, que ofrece un servidor DNS para que los pods puedan resolver diferentes nombres de recursos (servicios, pods, ...) a direcciones IP.

El servicio *KubeDNS* se comounica con el servidor de API y comprueba los servicios y pods creado para gestionar los diferentes registros de sus zonas de DNS.

## ¿Qué se puede resolver?

* Cada vez que se crea un nuevo servicio se crea un registro de tipo A con el nombre `servicio.namespace.svc.cluster.local`.
* Para cada puerto nombrado se crea un registro SRV del tipo `_nombre-puerto._nombre-protocolo.my-svc.my-namespace.svc.cluster.local` que resuelve el número del puerto y al CNAME: `servicio.namespace.svc.cluster.local`.
* Para cada pod creado con dirección IP 1.2.3.4, se crea un registro A de la forma `1-2-3-4.default.pod.cluster.local`.

<!--more-->

## Comprobamos el DNS

Creamos un pod con la imagen [`busybox`](https://www.busybox.net/) a partir del fichero [`busybox.yaml`](https://github.com/josedom24/kubernetes/blob/master/ejemplos/busybox/busybox.yaml):

    kubectl create -f busybox.yaml

Si tenemos los siguientes servicios creados:

    kubectl get service
    NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
    kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        5d
    nginx        NodePort    10.111.102.186   <none>        80:30305/TCP   2d

La consulta para resolver la IP de un servicio sería:

    kubectl exec -it busybox -- nslookup nginx
    Server:    10.96.0.10
    Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

    Name:      nginx
    Address 1: 10.111.102.186 nginx.default.svc.cluster.local

De esta manera podemos hacer referencia al servicio por el nombre:

    kubectl exec -it busybox -- wget http://nginx
    Connecting to nginx (10.111.102.186:80)
    index.html           100% |*******************************|   612   0:00:00 ETA

Como podemos observar el servidor DNS se llama `kube-dns.kube-system.svc.cluster.local` y tiene la IP `10.96.0.10`, es un servicio que representa un conjunto de pods que se está ejecutando en el espacio de nombres `kube-config`:

    kubectl get pods --namespace=kube-system -o wide
    NAME                                       READY     STATUS    RESTARTS   AGE
    ...
    kube-dns-86f4d74b45-c4zxz                  3/3       Running   0          6d
    ...

     kubectl get services --namespace=kube-system 
    NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
    ...
    kube-dns      ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP   6d
    ...

Y podemos comprobar el fichero de resolución de los pods de la siguiente forma:

    kubectl exec -it busybox -- cat /etc/resolv.conf
    nameserver 10.96.0.10
    search default.svc.cluster.local svc.cluster.local cluster.local openstacklocal
    options ndots:5

Para terminar veamos la resolución del nombre de un pod:

    kubectl exec -it busybox -- nslookup 192-168-72-178.default.pod.cluster.local
    Server:    10.96.0.10
    Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

    Name:      192-168-72-178.default.pod.cluster.local
    Address 1: 192.168.72.178

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
