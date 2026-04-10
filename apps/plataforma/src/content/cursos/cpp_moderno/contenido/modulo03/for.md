---
title: "Estructuras repetitivas: for"
---

El bucle `for` permite ejecutar de forma repetitiva un bloque de instrucciones, normalmente se usa cuando se conoce cuántas veces debe realizarse esa repetición.

Su sintaxis consta de tres partes:

```cpp
for (inicialización; condición; actualización) {
    // Instrucciones del bucle
}
```

* **Inicialización:** Se ejecuta una vez al principio. Suele declararse e inicializarse aquí la variable de control.
* **Condición:** Se evalúa antes de cada iteración. Mientras sea verdadera (`true`), se sigue ejecutando el bucle.
* **Actualización:** Se ejecuta al final de cada iteración, normalmente para modificar la variable de control.

Veamos algunos ejemplos:

### Ejemplo 1: Contar del 1 al 10

```cpp
#include <iostream>

int main() {
    for (int var = 1; var <= 10; var++) {
        std::cout << var << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

### Ejemplo 2: Contar de 10 a 1 (decreciendo)

```cpp
#include <iostream>

int main() {
    for (int var = 10; var >= 1; var--) {
        std::cout << var << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

### Ejemplo 3: Números pares del 2 al 10

```cpp
#include <iostream>

int main() {
    for (int var = 2; var <= 10; var += 2) {
        std::cout << var << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

## Elementos opcionales en el `for`

Las tres partes del `for` (inicialización, condición y actualización) son opcionales, aunque deben mantenerse los puntos y comas. Esto permite estructuras como bucles infinitos.

### Ejemplo de bucle infinito

```cpp
#include <iostream>

int main() {
    for (;;) {  // Equivale a while (true)
        std::cout << "Ejecutando..." << std::endl;
        break;  // Salimos del bucle
    }
    return 0;
}
```

### Ejemplo omitiendo inicialización o actualización

```cpp
#include <iostream>

int main() {
    int contador{1};  // Inicialización fuera del for, usando inicialización uniforme
    for (; contador <= 5;) {
        std::cout << contador << " ";
        contador++;
    }
    std::cout << std::endl;
    return 0;
}
```

## Introducción al bucle range-based for loop (bucle basado en rangos)

El **range-based for loop (bucle basado en rangos)** simplifica el recorrido de los elementos de colecciones como cadenas (`std::string`), arrays o contenedores como `std::vector`. La sintaxis general:

```cpp
for (tipo elemento : colección) {
    // Instrucciones
}
```
Como la única colección que hemos estudiado son las cadenas, vamos a ver un ejemplo que donde se recorre los caracteres de una cadena con el bucle `for`:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto{"Hola Mundo"};

    for (char c : texto) {
        std::cout << c << " ";
    }
    std::cout << std::endl;
    return 0;
}
```
