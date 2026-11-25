---
title: "Ejercicio 2: Trabajando con ReplicaSet"
---

## Ejercicio

Como indicamos en el contenido de este módulo, no se va  a trabajar directamente con los Pods (realmente tampoco vamos a trabajar directamente con los ReplicaSet, en el siguiente módulo explicaremos los Deployments que serán el recurso con el que trabajaremos).  En este ejercicio vamos a crear un ReplicaSet que va a controlar un conjunto de Pods. Para ello, realiza los siguientes pasos:

1. Crea un fichero yaml con la descripción del recurso ReplicaSet, teniendo en cuenta los siguientes aspectos:
    * Indica nombres distintos para el ReplicaSet y para el contenedor de los Pods que va a controlar.
    * El ReplicaSet va a crear 3 réplicas.
    * La imagen que debes desplegar es `iesgn/test_web:latest`.
    * Indica de manera adecuada una etiqueta en la especificación del Pod que vas a definir que coincida con el *selector* del ReplicaSet.

    Puedes partir de esta plantilla, sustituyendo cada `<...>` por el valor que corresponda:

    ```yaml
    apiVersion: apps/v1
    kind: ReplicaSet
    metadata:
      name: <nombre-del-replicaset>
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
    ```

2. Crea el ReplicaSet con `kubectl apply`.
3. Comprueba que se ha creado el ReplicaSet y los 3 Pods.
4. Obtén información detallada del ReplicaSet creado.
5. Vamos a probar la tolerancia a fallos: Elimina uno de los 3 Pods, y comprueba que inmediatamente se ha vuelto a crear un nuevo Pod.
6. Vamos a comprobar la escalabilidad: escala el ReplicaSet para tener 6 Pods de la aplicación con `kubectl scale`. Después vuelve a tener 3 Pods modificando el campo `replicas` del fichero yaml y aplicando el cambio.
7. Elimina el ReplicaSet y comprueba que se han borrado todos los Pods.
