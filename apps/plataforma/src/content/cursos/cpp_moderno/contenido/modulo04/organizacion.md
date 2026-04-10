---
title: "Organización del código en archivos `.h` y `.cpp`"
---

La programación estructurada promueve la descomposición de un programa en funciones pequeñas, modulares y comprensibles. En C++, esta descomposición no solo se expresa a través de funciones, sino también mediante una organización física del código en archivos fuente (`.cpp`) y archivos de cabecera (`.h`), que permite separar la interfaz de la implementación.

Esta práctica, aunque no exclusiva del paradigma estructurado, es especialmente útil para mantener la claridad, la legibilidad y la escalabilidad de los programas a medida que crecen en tamaño y complejidad.

## Propósito y ventajas

Dividir el código en archivos `.h` y `.cpp` cumple los siguientes propósitos fundamentales:

* **Separación de interfaz e implementación**: Las funciones se declaran en archivos de cabecera (`.h`) y se definen en archivos fuente (`.cpp`).
* **Facilidad de mantenimiento**: Se puede modificar la implementación de una función sin alterar el código que la utiliza.
* **Reutilización de código**: Las cabeceras permiten reutilizar funciones en múltiples unidades de compilación.
* **Compilación eficiente**: Al incluir solo las cabeceras necesarias, se reduce el tiempo de compilación.

## Ejemplo

A continuación se presenta una estructura comúnmente utilizada para organizar funciones en un programa estructurado:

### Archivo de cabecera: `math_utils.h`

```cpp
#pragma once //Evita múltiples inclusiones de un mismo archivo de cabecera

// Declaración de funciones relacionadas con operaciones matemáticas

int square(int x);
bool is_even(int x);
int factorial(int n);
```

### Archivo de implementación: `math_utils.cpp`

```cpp
#include "math_utils.h"

int square(int x) {
    return x * x;
}

bool is_even(int x) {
    return x % 2 == 0;
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

### Archivo principal: `main.cpp`

```cpp
#include <iostream>
#include "math_utils.h"

int main() {
    std::cout << "Cuadrado de 5: " << square(5) << "\n";
    std::cout << "Factorial de 4: " << factorial(4) << "\n";
    return 0;
}
```
Hay que indicar que a la hora de compilarlo, habrá que indicar los dos ficheros de implementación:

```bash
$ g++ main.cpp math_utils.cpp -o programa
``` 