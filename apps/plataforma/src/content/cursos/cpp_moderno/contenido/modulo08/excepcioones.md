---
title: "Introducción a las excepciones"
---

Tenemos a nuestra disposición varias herramientas para gestión de errores.

## `std::cerr`: salida estándar de errores

El flujo `std::cerr` permite enviar mensajes de error directamente al canal de salida estándar de errores, separado de la salida normal (`std::cout`). Es útil para **mostrar información de diagnóstico** sin interferir con la salida principal del programa.

Ejemplo:

```cpp
#include <iostream>

int main() {
    int edad = -5;
    if (edad < 0) {
        std::cerr << "Error: la edad no puede ser negativa.\n";
    }
    return 0;
}
```

## `assert`: comprobaciones en tiempo de ejecución

La macro `assert` permite **verificar condiciones que deberían cumplirse durante la ejecución**. Si la condición es falsa, el programa termina inmediatamente, mostrando un mensaje con el archivo y la línea del fallo.

Ejemplo:

```cpp
#include <iostream>
#include <cassert>

// Función recursiva para calcular el factorial
int factorial(int n) {
    assert(n >= 0); // Comprobación: no se permite n negativo
    return (n == 0) ? 1 : n * factorial(n - 1);
}

int main() {
    std::cout << "Prueba de factorial:\n";

    // Casos de prueba
    std::cout << "factorial(0) = " << factorial(0) << "\n"; // 1
    std::cout << "factorial(1) = " << factorial(1) << "\n"; // 1
    std::cout << "factorial(5) = " << factorial(5) << "\n"; // 120
    std::cout << "factorial(10) = " << factorial(10) << "\n"; // 3628800

    // Si descomentas la siguiente línea, el programa abortará debido al assert
    // std::cout << factorial(-3) << "\n";

    return 0;
}

```

`assert` solo está activa si se compila sin la macro `NDEBUG`. Es útil durante el desarrollo, pero no se recomienda en entornos de producción.

## Hacia un manejo robusto de errores: excepciones

Si bien `std::cerr` y `assert` son útiles, tienen limitaciones:

* No permiten **recuperarse del error**: el programa continúa o termina abruptamente.
* No permiten **separar el código normal del código de tratamiento de errores**.

Para solventar estas limitaciones, C++ ofrece un mecanismo robusto y estructurado: **las excepciones**, que permiten detectar, lanzar y capturar errores de forma controlada y jerárquica.
En el siguiente apartado estudiaremos en profundidad el sistema de excepciones de C++: cómo lanzar (`throw`), capturar (`catch`) y definir excepciones propias.

