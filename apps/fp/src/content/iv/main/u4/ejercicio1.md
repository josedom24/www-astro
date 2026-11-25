---
title: "Ejercicio 1: Trabajando con Pods"
---

## Ejercicio

Vamos a crear nuestro primer Pod, y para ellos vamos a desplegar una imagen que nos ofrece un servidor web con una página estática. Para ello realiza los siguientes pasos:

1. Instala minikube y kubectl como hemos estudiado en la presentación, comprobando con `kubectl version` que el cliente y el servidor tienen versiones compatibles.
2. Crea un fichero yaml con la descripción del recurso Pod, teniendo en cuenta los siguientes aspectos:
    * Indica nombres distintos para el Pod y para el contenedor.
    * La imagen que debes desplegar es `iesgn/test_web:latest`.
    * Indica una etiqueta en la descripción del Pod.

    Puedes partir de esta plantilla, sustituyendo cada `<...>` por el valor que corresponda:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: <nombre-del-pod>
      labels:
        <clave>: <valor>
    spec:
      containers:
        - image: <imagen>
          name: <nombre-del-contenedor>
    ```

3. Crea el Pod.
4. Comprueba que el Pod se ha creado y está corriendo.
5. Obtén información detallada del Pod creado.
6. Accede de forma interactiva al Pod y comprueba los ficheros que están en el DocumentRoot (`/usr/local/apache2/htdocs/`).
7. Crea una redirección con `kubectl port-forward` utilizando el puerto de localhost 8888 y sabiendo que el Pod ofrece el servicio en el puerto 80. Accede a la aplicación desde un navegador.
8. Muestra los logs del Pod y comprueba que se visualizan los logs de los accesos que hemos realizado en el punto anterior.
9. Elimina el Pod, y comprueba que ha sido eliminado.

## Parte optativa: Pod multicontenedor

Vamos a crear un Pod con dos contenedores que comparten la misma red. Realiza los siguientes pasos:

1. Crea un fichero `pod-multi.yaml` con la definición de un Pod con dos contenedores:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: pod-multi
    spec:
      containers:
        - name: web
          image: nginx:1.29
        - name: cliente
          image: busybox:1.37
          command: ["sleep", "3600"]
    ```

    * En `spec.containers` hay una lista con **dos contenedores**, cada uno con su `name` y su `image`.
    * El contenedor `web` ejecuta un servidor web `nginx`, que escucha en el puerto 80.
    * El contenedor `cliente` usa `busybox`, una imagen mínima con herramientas como `wget`. Por sí sola terminaría inmediatamente, por lo que con `command` ejecutamos `sleep 3600` para que se mantenga en ejecución durante una hora.
    * Los dos contenedores pertenecen al mismo Pod, por lo que **comparten la misma IP y la misma red**.

2. Crea el Pod y comprueba que está corriendo y que muestra `2/2` en la columna `READY`.
3. Obtén información detallada del Pod y localiza en la salida los dos contenedores.
4. Accede al contenedor `cliente` (indícalo con la opción `-c`) y, desde él, ejecuta `wget -qO- http://localhost`. Comprueba que obtienes la página de inicio de `nginx`, que se está ejecutando en el otro contenedor. ¿Por qué funciona usando `localhost`?
5. Muestra los logs del contenedor `web` (con la opción `-c`) y comprueba que aparece el acceso que has hecho en el punto anterior.
6. Elimina el Pod.
