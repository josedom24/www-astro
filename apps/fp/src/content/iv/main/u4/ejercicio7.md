---
title: "Ejercicio 7: Instalación de aplicaciones con Helm"
---

En este ejercicio vamos a usar **Helm** para instalar una aplicación a partir de un chart que ya existe. Utilizaremos `podinfo`, una pequeña aplicación web de demostración que muestra el nombre del Pod que responde, su versión, un color y un mensaje que podemos personalizar.

## Ejercicio 1: Instalación de Helm

1. Descarga la última versión de Helm desde su página de descargas, descomprímela y copia el binario `helm` a una carpeta de tu `PATH` (por ejemplo, `~/.local/bin`).
2. Comprueba la versión instalada con `helm version`.
3. Comprueba con `helm list` que, de momento, no hay ninguna release instalada.

## Ejercicio 2: Instalando podinfo

1. Añade el repositorio de charts `podinfo`, cuya URL es `https://stefanprodan.github.io/podinfo`, y actualiza la información de los repositorios.
2. Busca el chart `podinfo` con `helm search repo` y anota su versión y la versión de la aplicación.
3. Muestra los valores por defecto del chart con `helm show values` y localiza los parámetros que permiten cambiar:
   * el número de réplicas,
   * el tipo del Service,
   * el mensaje que muestra la aplicación.
4. Instala el chart con el nombre de release `mi-podinfo`, usando `--set` para que tenga 2 réplicas, el Service sea de tipo `NodePort` y el mensaje sea `Hola desde Helm`.
5. Comprueba los recursos que se han creado: Deployment, ReplicaSet, Pods y Service. ¿Qué etiquetas tienen?
6. Accede a la aplicación con `minikube service mi-podinfo --url` y comprueba el mensaje y el nombre del Pod. Recarga la página varias veces: ¿cambia el nombre del Pod?
7. Ejecuta `helm list` y `helm get values mi-podinfo`. ¿Qué valores aparecen?

## Ejercicio 3: Actualizando la release

1. Crea un fichero `valores.yaml` con 3 réplicas, el Service de tipo `NodePort`, el mensaje `Hola desde Helm v2` y el color `#c0392b`. Consulta en `helm show values` el nombre de los parámetros.
2. Actualiza la release con `helm upgrade mi-podinfo podinfo/podinfo -f valores.yaml`. Comprueba que hay 3 Pods y que la aplicación muestra el nuevo mensaje y color.
3. Ejecuta `helm history mi-podinfo`. ¿Cuántas revisiones hay?
4. Vuelve a la primera revisión con `helm rollback`. Comprueba el historial y la aplicación. ¿Qué número de revisión tiene ahora la release? ¿Cuántos Pods hay?
5. Ejecuta `helm install prueba podinfo/podinfo --set ui.message="Hola, soy yo" --dry-run=client`. ¿Qué error aparece y por qué? Soluciónalo usando un fichero de valores.

## Ejercicio 4: Comprobando lo que genera Helm

1. Con `helm get manifest mi-podinfo`, localiza el YAML del Deployment que ha generado Helm. ¿Qué imagen y qué etiqueta usa?
2. Con `helm template` genera el YAML del chart con el fichero `valores.yaml`, sin instalarlo. ¿En qué se diferencia de `helm get manifest`?
3. Desinstala la release con `helm uninstall` y comprueba que se han eliminado todos los recursos.

## Ejercicio 5 (optativo): Nuestro propio chart

1. Crea la estructura de un chart con `helm create mi-web`. Revisa los ficheros que se han generado.
2. En `values.yaml`, cambia la imagen por `iesgn/test_web` y la etiqueta por `version1`.
3. Comprueba el chart con `helm lint mi-web` e instálalo con `helm install web ./mi-web --set service.type=NodePort`.
4. Accede a la aplicación y actualiza la release a la etiqueta `version2` con `--set image.tag=version2`.
5. Empaqueta el chart con `helm package mi-web`.
