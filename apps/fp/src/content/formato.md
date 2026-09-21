---
title: "Normas de entrega de tareas en Redmine"
permalink: /formato.html
---
# 

Cada alumno dispone de una **tarea en Redmine** para entregar las actividades de la asignatura. Este documento recoge las normas de formato que hay que seguir al usarla, para que la entrega quede ordenada y sea fácil de corregir.

## Estructura de la entrega

- La tarea de Redmine es un *histórico* de tu trabajo: la entrega se hace **poco a poco**, según vas completando apartados.
- Cada vez que añadas algo nuevo (un apartado nuevo, o una corrección de uno anterior), crea una **conversación (comentario) nueva** (Botón **Modificar**). *No* edites ni borres un comentario ya publicado para meter contenido distinto: el histórico de comentarios es la prueba de tu progreso.
- Si necesitas corregir algo de una entrega anterior, coméntalo en una **conversación nueva** explicando qué cambia, en lugar de reescribir la antigua.
- Al empezar cada apartado, copia el **enunciado del ejercicio** con un título de nivel 2 (`h2`), para que se sepa qué se está entregando en esa conversación. En Redmine (formato *Textile*) se escribe así: `h2. Enunciado`.
- Entrega **solo** lo que se pide en el enunciado: no añadas de más ni de menos de lo solicitado en cada apartado.

## Formato del texto y del código

- El **código**, las **instrucciones que se ejecutan** y la **salida de esas instrucciones** se copian *siempre* con fuente monoespaciada, dentro de un bloque:
    ``` 
    <pre>
    $ ejemplo de comando
    salida del comando
    </pre>
    ```
- No mezcles código y explicaciones dentro del mismo bloque `<pre>`: el texto explicativo va fuera, como párrafo normal.
- Si el bloque de código es muy largo, resume o recorta la parte que no aporte nada (por ejemplo, salidas repetitivas), indicando que se ha recortado.
- Para resaltar texto normal (no código) puedes usar el formato *Textile*:
  - **Negrita**: `*texto*`
  - *Cursiva*: `_texto_`
  - Código en línea (una palabra o instrucción corta dentro de una frase): `@texto@`
  - Enlaces: `"texto del enlace":http://direccion`
  - Listas: `* elemento` para viñetas, `# elemento` para listas numeradas

## Capturas de pantalla e imágenes

- **No se entregan capturas del terminal.** Lo que ocurre en el terminal se documenta copiando el comando y su salida en texto (bloque `<pre>`), *no* como imagen.
- Solo se incluyen capturas **cuando de verdad son necesarias**, por ejemplo para mostrar el resultado de acceder a una página web desde el navegador, una interfaz gráfica, o un panel de administración.
- Recorta la captura para que se vea solo lo relevante; evita capturas de pantalla completa con ventanas o pestañas innecesarias.
- Si es una captura de un navegador accediendo a una página, **que se vea la URL**.
- **Cómo insertar una imagen:**
  1. Sube el fichero de imagen a la tarea de Redmine (como adjunto de la conversación).
  2. Redmine genera un enlace al fichero subido; copia ese enlace.
  3. Insértalo en el texto con la sintaxis *Textile* `!nombre_imagen.png!` para que la imagen se muestre incrustada en la conversación.
  4. También puedes probar a arrastrar la imagen al cuadro de texto de redmine.

## Ficheros adjuntos

- Sube los ficheros (código, documentos, imágenes) como **adjuntos** de la tarea, no pegados enteros como texto si son largos.
- Pon nombres de fichero *descriptivos* (por ejemplo `practica3_script.py`, no `final2_bueno.py`), así se identifican fácilmente en el historial.
- Si al subir un fichero te das cuenta de que está mal o subes una versión actualizada que lo sustituye, **borra el fichero anterior** de la tarea para que no queden versiones obsoletas confundiendo la corrección, y explica en la conversación qué has cambiado.

## Otras cosas

- Puedes ir actualizando el campo **% Realizado** conforme completas apartados, no hace falta esperar al final. Cuando termines toda la tarea, ese campo debe quedar **al 100%**.
- **No** cambies el estado de la tarea (por ejemplo, a *"Cerrada"*) salvo que se indique lo contrario; es el profesor quien gestiona el estado tras la corrección.
- Si tienes dudas sobre un apartado, pregunta al profesor.
- El profesor puede escribir también algún comentario en la tarea para aclarar algo o darte alguna indicación; revisa el correo para ver las modificaciones de la tarea.