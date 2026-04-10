---
title: "Introducción al trabajo con archivos"
---

En la mayoría de programas reales, el trabajo con archivos es una necesidad común: guardar datos, leer configuraciones, procesar información externa, generar informes, etc. En esta sección introduciremos los fundamentos del trabajo con archivos en C++, qué son y cómo se gestionan correctamente en el paradigma moderno del lenguaje.

Un **archivo** es una colección de datos almacenados en un medio persistente (habitualmente el disco), que puede ser **leído** o **escrito** por un programa. En el contexto de la programación, los archivos sirven como un mecanismo para:

* **Guardar información** más allá de la ejecución del programa.
* **Leer datos** producidos por otros programas o por el usuario.
* **Intercambiar información** entre aplicaciones.

Los archivos pueden clasificarse de varias formas, pero desde el punto de vista de C++, nos interesan principalmente:

1. **Archivos de texto** (`.txt`, `.csv`, `.xml`, `.json`, etc.):

   * Contienen caracteres legibles por humanos.
   * Se pueden abrir con un editor de texto.
   * Usualmente se leen y escriben línea por línea o carácter por carácter.

2. **Archivos binarios** (`.dat`, `.bin`, etc.):

   * Contienen datos codificados en forma binaria (no legibles directamente).
   * Se usan para almacenar estructuras complejas de forma más compacta o eficiente.
   * Requieren lectura y escritura en bloques de memoria.


## Los archivos como recurso

Desde la perspectiva de la programación moderna en C++, un **archivo es un recurso externo** al programa. Al igual que la memoria dinámica, los sockets o los hilos, debe ser:

* **Solicitado** (abierto).
* **Usado** (leer o escribir).
* **Liberado** (cerrado).

Una gestión incorrecta de archivos puede producir:

* **Fugas de recursos** (archivos abiertos que nunca se cierran).
* **Bloqueos** (otro programa no puede acceder al archivo porque no fue cerrado correctamente).
* **Corrupción de datos** (escritura incompleta).

Esto hace que el trabajo con archivos esté estrechamente relacionado con los mecanismos de **RAII** y **excepciones**, dos pilares del diseño seguro en C++ moderno.

## RAII y archivos

**RAII** (*Resource Acquisition Is Initialization*) es un principio de diseño donde la gestión de un recurso se asocia al ciclo de vida de un objeto. En el caso de archivos, esto significa que **abrir y cerrar archivos se hace automáticamente** mediante objetos que lo manejan.

En C++, la biblioteca estándar ofrece las clases:

* `std::ifstream` (input file stream): para **leer** archivos.
* `std::ofstream` (output file stream): para **escribir** archivos.
* `std::fstream` (file stream): para leer y escribir al mismo tiempo.

Estas clases abren el archivo al construirse, y lo **cierran automáticamente al destruirse**, lo que garantiza una gestión segura del recurso.

```cpp
#include <fstream>

int main() {
    std::ofstream archivo("datos.txt");
    archivo << "Hola, archivo\n";
    // El archivo se cierra automáticamente al salir del bloque
    return 0;
}
```

Aquí, `archivo` se destruye automáticamente al final de `main()`, y su destructor cierra el archivo correctamente. No hace falta llamar a `archivo.close()`.


## Excepciones y archivos

Abrir o manipular un archivo puede fallar por muchos motivos:

* El archivo no existe.
* No tenemos permisos.
* El disco está lleno o dañado.
* El archivo está en uso por otro proceso.



Cuando trabajamos con archivos en C++ (`std::ifstream`, `std::ofstream`, `std::fstream`), los errores no lanzan excepciones por defecto; en su lugar, el flujo se marca con **flags** de error:

* `std::ios::failbit`: indica un error lógico, como intentar leer un número donde hay texto o no poder abrir un archivo correctamente.
* `std::ios::badbit`: indica un error grave, como fallo del sistema de archivos o problemas de hardware.

Por defecto, debes comprobar manualmente estos estados usando métodos como `fail()` o `bad()`. Además podemos usar el método `is_open()` para comprobar si el fichero se ha abierto de manera adecuada. Por ejemplo:

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    // Abrimos el archivo
    std::ifstream archivo("archivo.txt");
    if (!archivo.is_open()) {
        std::cerr << "Error al abrir archivo\n";
        return 1;
    }

    int numero{};
    archivo >> numero; // Intento de lectura

    // Comprobación: ¿falló la lectura por formato o fin de archivo?
    if (archivo.fail()) {
        std::cerr << "Error al leer el número (fail)\n";
        return 1;
    }

    // Comprobación opcional: ¿ocurrió un error grave durante la operación?
    if (archivo.bad()) {
        std::cerr << "Error grave en el flujo (bad)\n";
        return 1;
    }

    std::cout << "Número leído: " << numero << '\n';
    std::cout << "Programa finalizado\n";

    return 0;
}
```
Si en cambio configuramos el flujo con `archivo.exceptions(std::ios::failbit | std::ios::badbit);`, cualquier operación que active estas flags lanzará automáticamente una **excepción** de tipo `std::ios_base::failure`.

Esto permite manejar errores de archivos dentro de un sistema de **excepciones**, lo que hace el código más limpio y robusto, por ejemplo:

```cpp
#include <fstream>
#include <iostream>

int main() {
    std::ifstream archivo;
    archivo.exceptions(std::ifstream::failbit | std::ifstream::badbit);

    try {
        archivo.open("inexistente.txt");
        std::string linea;
        std::getline(archivo, linea);
        std::cout << linea << '\n';
    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al trabajar con archivos: " << e.what() << '\n';
    }
    return 0;
}
```

En resumen: activar excepciones en flujos de archivos permite que los errores se integren en el sistema general de manejo de errores, evitando comprobaciones manuales tras cada operación.



