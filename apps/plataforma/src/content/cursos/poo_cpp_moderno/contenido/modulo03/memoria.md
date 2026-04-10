---
title: "Gestión manual de memoria dinámica"
---

En C++, los datos y variables se almacenan en diferentes áreas de memoria con propósitos específicos. Comprender estas áreas es fundamental para escribir código eficiente y seguro.

## Modelos de memoria: stack y heap

### Memoria de pila (stack)

Es un área gestionada automáticamente por el compilador y el sistema en tiempo de ejecución. Aquí se almacenan:

* Variables locales de funciones
* Parámetros de funciones
* Información de control (direcciones de retorno)

Características:

* **Gestión automática**: al entrar en una función, se reservan las variables; al salir, se liberan.
* **Muy rápida**, debido a su gestión estructurada y proximidad al procesador.
* **Tamaño limitado**: abusar de la recursión o declarar estructuras grandes puede causar *stack overflow*.

```cpp
#include <iostream>

void funcion() {
    int x = 5;   // Variable local en el stack
    std::cout << "x = " << x << "\n";
} // al salir de la función, x se libera automáticamente

int main() {
    funcion();
    return 0;
}
```

### Memoria dinámica (heap)

Es un área de memoria cuya gestión depende del programador. Permite reservar bloques en tiempo de ejecución cuya duración no está ligada al alcance de una función.

Características:

* Vida útil extendida más allá del bloque en el que se creó.
* Flexibilidad: el tamaño puede definirse en tiempo de ejecución.
* Requiere gestión manual: si no se libera, aparecen fugas de memoria.
* Más lenta que el stack, por la complejidad de asignación.

## Gestión manual con `new` y `delete`

En C++ tradicional, se utilizan los operadores:

* `new`: reserva memoria en el heap y devuelve un puntero.
* `delete`: libera memoria previamente asignada con `new`.
* Para arrays: `new[]` y `delete[]`.

### Ejemplo: entero dinámico

```cpp
#include <iostream>

int main() {
    int* ptr = new int;   // Reserva espacio para un entero en el heap
    *ptr = 42;            // Uso de la memoria
    std::cout << "Valor: " << *ptr << "\n";

    delete ptr;           // Liberación manual
    return 0;
}
```

### Ejemplo: array dinámico

```cpp
#include <iostream>

int main() {
    int* array = new int[100]; // Reserva un array de 100 enteros en el heap

    array[0] = 10; // Uso del array
    array[99] = 50;

    std::cout << "Primer elemento: " << array[0] 
              << ", Último: " << array[99] << "\n";

    delete[] array; // Liberación de memoria del array
    return 0;
}
```

Aquí tienes la sección reescrita sin iconos, con programas completos y comentarios explicativos en un estilo formal y claro:

## Errores frecuentes en la gestión manual de memoria

Cuando se gestiona memoria manualmente con `new` y `delete`, pueden producirse errores graves que afectan la estabilidad del programa. A continuación se muestran los errores más comunes y sus implicaciones.

### Fuga de memoria (*memory leak*)

Una **fuga de memoria** ocurre cuando se reserva memoria dinámica y se pierde la referencia al bloque asignado sin haberlo liberado.
El espacio de memoria reservado no se puede recuperar, lo que provoca consumo innecesario de recursos.

```cpp
#include <iostream>

int main() {
    int* ptr = new int(10);  // reserva dinámica

    // Error: se pierde la referencia al bloque reservado
    ptr = nullptr;

    // El bloque original sigue existiendo en memoria, pero ya no es accesible
    std::cout << "Fuga de memoria: el entero reservado nunca se libera.\n";

    return 0;
}
```

### Doble liberación (*double delete*)

Liberar la misma dirección de memoria más de una vez produce **comportamiento indefinido**.
El sistema intenta liberar un bloque ya liberado, lo que puede causar un fallo de segmentación o errores impredecibles.

```cpp
#include <iostream>

int main() {
    int* ptr = new int(10);  // reserva memoria
    delete ptr;               // primera liberación

    // Error: segunda liberación del mismo bloque
    delete ptr;  // comportamiento indefinido

    std::cout << "Este mensaje podría no mostrarse correctamente.\n";
    return 0;
}
```

### Uso de memoria liberada (*dangling pointer*)

Un **puntero colgante** (*dangling pointer*) es un puntero que sigue apuntando a una dirección de memoria que ya fue liberada.
Cualquier intento de acceso o modificación de esa memoria es un error grave y produce comportamiento indefinido.

```cpp
#include <iostream>

int main() {
    int* ptr = new int(10);
    delete ptr;  // el bloque ya no es válido

    // Error: acceso a memoria liberada
    *ptr = 5;  // comportamiento indefinido
    std::cout << "Valor: " << *ptr << "\n";  // lectura inválida

    return 0;
}
```

