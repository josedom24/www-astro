---
date: 2018-05-23
id: 1995
title: Desplegando una aplicación en Kubernetes


guid: https://www.josedomingo.org/pledin/?p=1995
slug: 2018/05/desplegando-una-aplicacion-en-kubernetes


tags:
  - Cloud Computing
  - kubernetes
---
Un escenario común cuando desplegamos una aplicación web puede ser el siguiente:

![<img src="/pledin/assets/2018/05/deploy1.png" alt="" width="685" height="387" class="aligncenter size-full wp-image-1997" />](/pledin/assets/2018/05/deploy1.png)

En este escenario tenemos los siguientes elementos:

* Un conjunto de máquinas (normalmente virtuales) que sirven la aplicación web (**frontend**).
* Un balanceador de carga externo que reparte el tráfico entre las diferentes máquinas.
* Un número de servidores de bases de datos (**backend**).
* Un balanceador de carga interno que reparte el acceso a las bases de datos.

<!--more-->

El escenario anterior se podría montar en Kubernetes de la siguiente forma:

[<img src="/pledin/assets/2018/05/deploy2.png" alt="" width="754" height="388" class="aligncenter size-full wp-image-1996" />](/pledin/assets/2018/05/deploy2.png)

Los distintos recursos de Kubernetes nos proporcionan distintas características muy deseadas:

* `Pods`: La unidad mínima de computación en Kubernetes, permite ejecutar contenedores. Representa un conjunto de contenedores y almacenamiento compartido que comparte una única IP.
* `ReplicaSet`: Recurso de un cluster Kubernetes que asegura que siempre se ejecute un número de replicas de un pod determinado. Nos proporciona las siguientes características: 
  * Que no haya caída del servicio
  * Tolerancia a errores
  * Escabilidad dinámica
* `Deployment`: Recurso del cluster Kubernetes que nos permite manejar los `ReplicaSets`. Nos proporciona las siguientes características: 
  * Actualizaciones continúas
  * Despliegues automáticos
* `Service`: Nos permite el acceso a los pod. 
* `Ingress`: Nos permite implementar un proxy inverso para el acceso a los distintos servicios establecidos. Estos dos elementos nos proporcionan la siguiente funcionalidad: 
  * Balanceo de carga
* Otros recursos de un cluster Kubernetes nos pueden proporcional características adicionales: 
  * Migraciones sencillas
  * Monitorización
  * Control de acceso basada en Roles
  * Integración y despliegue continuo

En las siguientes entradas vamos a ir estudiando cada uno de estos recursos.

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
