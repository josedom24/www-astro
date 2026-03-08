---
date: 2018-12-19
title: 'Accediendo a nuestras aplicaciones Kubernetes con Ingress'
slug: 2018/12/kubernetes-acceso-ingress
tags:
  - Cloud Computing
  - kubernetes
---

Partimos del escenario donde tenemos desplegado nuestras dos aplicaciones con las que hemos estado trabajando en prácticas anteriores: [guestbook](https://www.josedomingo.org/pledin/2018/11/kubernetes-desplegando-guestbook2/) y [letschat](https://www.josedomingo.org/pledin/2018/12/kubernetes-letschat/).

    kubectl get deploy,services
    NAME                                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    deployment.extensions/guestbook      3         3         3            3           1d
    deployment.extensions/letschat       3         3         3            3           1d
    deployment.extensions/mongo          1         1         1            1           1d
    deployment.extensions/redis-master   1         1         1            1           1d
    deployment.extensions/redis-slave    3         3         3            3           1d

    NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
    service/frontend       ClusterIP   10.104.59.122    <none>        80/TCP           1d
    service/kubernetes     ClusterIP   10.96.0.1        <none>        443/TCP          1d
    service/letschat       ClusterIP   10.111.18.129    <none>        8080/TCP         1d
    service/mongo          ClusterIP   10.104.219.60    <none>        27017/TCP        1d
    service/redis-master   ClusterIP   10.98.46.85      <none>        6379/TCP         1d
    service/redis-slave    ClusterIP   10.110.200.207   <none>        6379/TCP         1d

<!--more-->

Como podemos ver los servicios que dan acceso a las aplicaciones lo hemos creado del tipo *ClusterIP* por lo que ahora mismo no tenemos forma de acceder a ellos desde el exterior. Vamos a crear un recurso *Ingress* para acceder de ello por medio de dos nombres, para ello lo definimos en el fichero [`ingress.yaml`](https://github.com/josedom24/kubernetes/blob/master/ejemplos/ingress/ingress.yaml):

    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: ingress-name-based
      annotations:
        traefik.ingress.kubernetes.io/affinity: "true"
    spec:
      rules:
      - host: www.guestbook.com
        http:
          paths:
          - path: "/"
            backend:
              serviceName: frontend
              servicePort: 80
      - host: www.letschat.com
        http:
          paths:
          - path: "/"
            backend:
              serviceName: letschat
              servicePort: 8080

* Como vemos en un fichero podemos definir varías reglas de encaminamiento.
* Podemos configurar el proxy inverso utilizando *Annotations*, en este caso `traefik.ingress.kubernetes.io/affinity` nos permite activa la persistencia en las sesiones. Para ver más opciones de configuración en traefik puedes ver la [documentación oficial](https://docs.traefik.io/configuration/backends/kubernetes/#annotations).

Creamos el recurso ingress:

    kubectl create -f ingress.yaml 
    ingress.extensions "ingress-name-based" created

    kubectl get ingress
    NAME                 HOSTS                                ADDRESS   PORTS     AGE
    ingress-name-based   www.guestbook.com,www.letschat.com             80        15s

Vamos a utilizar resolución estática, por lo tanto añado la resolución a la IP de cualquier nodo del cluster al fichero `/etc/hosts`:

    172.22.200.178  www.guestbook.com  www.letschat.com

Y ya podemos acceder:

![ingress](/pledin/assets/2018/12/ingress-guestbook.png)

![ingress](/pledin/assets/2018/12/ingress-letschat.png)

## Para seguir investigando

* Las distintas aplicaciones que podemos usar para crear un `Ingress Controller` ([HAproxy](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/), [nginx](https://www.nginx.com/products/nginx/kubernetes-ingress-controller/), [traefik](https://docs.traefik.io/user-guide/kubernetes/),...) nos dan diferentes opciones de configuración.
* Traefik también ofrece la posibilidad de usar [rutas basadas en path](https://docs.traefik.io/user-guide/kubernetes/#path-based-routing), trabajar con [certificados TLS](https://docs.traefik.io/user-guide/kubernetes/#add-a-tls-certificate-to-the-ingress), [autentificación básica](https://docs.traefik.io/user-guide/kubernetes/#basic-authentication), ...
* Otra opción para acceder al `Ingress controller` es desplegarlo con un `Deployment` y crear un servicio del tipo *LoadBalancer* para acceder a él, en este caso es muy fácil escalarlo.

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
