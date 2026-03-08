---
date: 2018-12-03
title: 'Kubernetes: Desplegando la aplicación LetsChat'
slug: 2018/12/kubernetes-letschat
tags:
  - Cloud Computing
  - kubernetes
---

En este ejemplo vamos a instalar una aplicación web (CMS), llamado [`letschat`](https://github.com/sdelements/lets-chat/wiki). LetsChat nos ofrece la posibilidad de tener un sistema de chat. Está escrito en node.js y utiliza una base de datos mongo.  Por lo tanto vamos a crear dos deployments:

* Uno con la aplicación letschat, este deployment lo vamos poder escalar sin problemas.
* Otro con la base de datos mongo.

En el directorio [`letschat`](https://github.com/josedom24/kubernetes/tree/master/ejemplos/letschat) tenemos los ficheros yaml que describen los dos despliegues, además de los que describen los dos servicios:

* El fichero `mongo-srv.yaml` crea un servicio del tipo *ClustrIP* para poder acceder a mongo:

        apiVersion: v1
        kind: Service
        metadata:
          name: mongo
        spec:
          ports:
          - name: mongo
            port: 27017
            targetPort: mongo
          selector:
            name: mongo

* El fichero `letschat-srv.yaml` crea el servicio *NodePort* para poder acceder desde el exterior a la aplicación:

        apiVersion: v1
        kind: Service
        metadata:
          name: letschat
        spec:
          type: NodePort
          ports:
          - name: http
            port: 8080
            targetPort: http-server
          selector:
            name: letschat

<!--more-->

Si queremos desplegar todos los ficheros que hay en el directorio lo podemos hacer de la siguiente forma:

    kubectl create -f letschat/
    deployment.extensions "letschat" created
    service "letschat" created
    deployment.extensions "mongo" created
    service "mongo" created
    
    kubectl get deploy,rs,service,pods
    NAME                             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    deployment.extensions/letschat   3         3         3            3           15s
    deployment.extensions/mongo      1         1         1            1           15s

    NAME                                        DESIRED   CURRENT   READY     AGE
    replicaset.extensions/letschat-57cb7f589f   3         3         3         15s
    replicaset.extensions/mongo-769fdf6975      1         1         1         15s

    NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
    service/kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP          6d
    service/letschat     NodePort    10.100.157.57    <none>        8080:30188/TCP   15s
    service/mongo        ClusterIP   10.97.213.5      <none>        27017/TCP        15s

    NAME                            READY     STATUS    RESTARTS   AGE
    pod/letschat-57cb7f589f-czl8d   1/1       Running   0          15s
    pod/letschat-57cb7f589f-jfnwb   1/1       Running   0          15s
    pod/letschat-57cb7f589f-zzwnv   1/1       Running   0          15s
    pod/mongo-769fdf6975-nlt4r      1/1       Running   0          15s

Y vemos como podemos acceder a la aplicación:

![letschat](/pledin/assets/2018/12/letschat.png)

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
