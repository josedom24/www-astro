---
title: "Introducción a la gestión de recursos"
---

En programación, la **gestión de recursos** se refiere al conjunto de técnicas que permiten reservar, utilizar y liberar recursos del sistema de manera eficiente y segura.

Entre los recursos más habituales se encuentran:

* **Memoria dinámica**
* **Archivos abiertos**
* **Conexiones de red o bases de datos**
* **Descriptores de dispositivos o handles**

Un manejo inadecuado puede causar:

* **Fugas de memoria** (*memory leaks*)
* **Bloqueos o corrupción de datos**
* **Consumo excesivo de recursos**
* **Fallas en la aplicación y mala experiencia de usuario**

## Gestión manual de recursos

En C++, el enfoque tradicional obliga al programador a reservar y liberar los recursos manualmente.

### Ejemplo: gestión manual de memoria

```cpp
#include <iostream>

int main() {
    int* ptr = new int;    // Reserva de memoria dinámica
    *ptr = 42;             // Uso de la memoria

    std::cout << "Valor: " << *ptr << "\n";

    delete ptr;            // Liberación manual de memoria

    return 0;
}
```

Si se omite `delete`, la memoria queda reservada sin liberarse: **fuga de memoria**.

### Ejemplo: gestión manual de archivos

```cpp
#include <cstdio>   // fopen, fclose

int main() {
    FILE* file = fopen("datos.txt", "r"); // Apertura manual del archivo
    if (file) {
        // ... uso del archivo ...
        fclose(file); // Cierre manual obligatorio
    }

    return 0;
}
```

Si se olvida `fclose`, el descriptor queda abierto, lo que puede causar **fugas de recursos** cuando se abren muchos archivos.

## Gestión moderna en C++

La gestión moderna de recursos en C++ se fundamenta en el principio **RAII (Resource Acquisition Is Initialization)**, que garantiza la liberación automática y segura de los recursos cuando los objetos que los poseen salen de su ámbito de validez. Este enfoque elimina la necesidad de liberar recursos manualmente y protege frente a fugas de memoria o bloqueos incluso en presencia de excepciones.

Dentro de este marco, la **gestión segura de memoria** se realiza mediante **punteros inteligentes**, como `std::unique_ptr` y `std::shared_ptr`, que encapsulan la propiedad de los recursos dinámicos y aseguran su liberación automática cuando dejan de ser necesarios.

En los apartados siguientes profundizaremos en estos mecanismos y en su aplicación práctica para lograr un código más seguro, robusto y expresivo.

