---
title: "Ejercicios con archivos"
---

## Ejercicio 1: Lectura de archivo de texto con manejo de errores

Escribe un programa que solicite al usuario el nombre de un archivo de texto y muestre por pantalla su contenido línea por línea.
Si el archivo no puede abrirse (porque no existe o no hay permisos), el programa debe capturar la excepción correspondiente e imprimir un mensaje de error adecuado.

Indicaciones:

* Usar `std::ifstream` con `exceptions()`.
* Leer línea por línea con `std::getline`.
* Manejo básico de excepciones (`std::ios_base::failure`).

## Ejercicio 2: Escritura controlada en archivo de texto

Escribe un programa que abra un archivo de texto en modo de escritura (truncando su contenido) y permita al usuario escribir varias líneas, que se guardarán en el archivo.
Cuando el usuario introduzca una línea vacía, se terminará la escritura. Usa excepciones para manejar cualquier error durante la apertura o escritura del archivo.

Indicaciones:

* Usar `std::ofstream` con `exceptions()`.
* Escribir texto en archivo usando `<<`.
* Controlar errores de apertura o escritura con `std::ios_base::failure`.


## Ejercicio 3: Copia segura de archivos binarios

Escribe un programa que copie un archivo binario (como una imagen o PDF) a otro archivo. El nombre del archivo origen y destino deben ingresarse por consola.
El programa debe:

* Leer el archivo binario de entrada completo en memoria (usando `std::vector<char>`).
* Escribir su contenido en el archivo de destino.
* Capturar y reportar por separado errores de lectura y de escritura.

Indicaciones:

* Usar `std::ifstream` y `std::ofstream` en modo binario.
* Leer y escribir con `std::vector<char>` y `std::istreambuf_iterator`.
* Lanzar y capturar excepciones de I/O de forma diferenciada.
