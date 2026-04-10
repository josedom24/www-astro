---
title: "Tipos de funciones: constexpr, inline, lambda y recursivas"
---

En C++, las funciones se pueden clasificar en distintos tipos según su comportamiento y uso. A continuación estudiamos algunas de ellas:


## Funciones `constexpr`

Las funciones `constexpr` permiten que su resultado se calcule en **tiempo de compilación**, siempre que se les pasen argumentos constantes. Esto mejora la eficiencia del programa, evitando ciertos cálculos en tiempo de ejecución.

Ejemplo:

```cpp
#include <iostream>

// Función constexpr que calcula el doble de un número
constexpr int doble(int x) {
    return x * 2;
}

int main() {
    constexpr int resultado = doble(4); // Se calcula en tiempo de compilación
    std::cout << "El doble de 4 es: " << resultado << std::endl;

    int numero = 5;
    std::cout << "El doble de 5 es: " << doble(numero) << std::endl; // Evaluación en tiempo de ejecución

    return 0;
}
```

## Funciones `inline`

Las funciones `inline` son sugerencias al compilador para que inserte el código de la función directamente donde se invoca, evitando así el coste de llamada a función, lo que puede ser útil en funciones muy simples.

Ejemplo:

```cpp
#include <iostream>

// Función inline que suma dos números
inline int sumar(int a, int b) {
    return a + b;
}

int main() {
    int x = 3, y = 7;
    std::cout << "La suma es: " << sumar(x, y) << std::endl;
    return 0;
}
```

## Funciones lambda

Las **lambdas** son funciones anónimas que se definen directamente en el lugar donde se necesitan. Son útiles para operaciones rápidas y sencillas. Ejemplo:

```cpp
#include <iostream>

int main() {
    int valor = 4;
    std::cout << [](int n) { return n * 3; }(valor) << std::endl;  // Imprime 8
    return 0;
}
```
La función lambda es: `[](int n) { return n * 3;}`.

## Funciones recursivas

Las funciones recursivas se llaman a sí mismas, dividiendo el problema en subproblemas más pequeños. Son comunes para cálculos como factoriales o sumas repetitivas.

Ejemplo:

```cpp
#include <iostream>

// Función recursiva que calcula el factorial de un número
int factorial(int n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    int numero = 5;
    std::cout << "El factorial de " << numero << " es: " << factorial(numero) << std::endl;
    return 0;
}
```
