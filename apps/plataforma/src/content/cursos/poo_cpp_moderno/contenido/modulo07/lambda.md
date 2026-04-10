---
title: "Representación de acciones con funciones lambda"
---

En C++ moderno, las **expresiones lambda** permiten definir **funciones anónimas** directamente en el punto donde se necesitan.
Una lambda puede comportarse como una función normal: puede recibir argumentos, devolver valores y, además, **capturar variables del entorno** para formar pequeñas acciones dependientes del contexto.

Gracias a ello, las lambdas permiten **representar comportamientos concretos de manera compacta**, sin necesidad de definir clases o funciones adicionales.
Son especialmente útiles al trabajar con los algoritmos de la **biblioteca estándar (STL)**, ya que muchos de ellos aceptan funciones como argumentos para expresar criterios o condiciones personalizadas.

## Sintaxis general de una lambda

```cpp
[captura](parámetros) -> tipo_retorno {
    cuerpo
};
```

**Donde:**

* `captura` especifica qué variables del entorno pueden usarse dentro de la lambda.
  Puede hacerse por valor `[=]`, por referencia `[&]` o listando variables concretas.
* `parámetros` define los argumentos de la lambda (igual que en una función).
* `tipo_retorno` es opcional; suele deducirse automáticamente.
* `cuerpo` contiene el código que se ejecuta cuando se llama a la lambda.


## Ejemplo 1: usar una lambda como criterio de ordenación

Una de las aplicaciones más comunes de las lambdas es definir **criterios personalizados** para los algoritmos de la STL, como `std::sort`.

```cpp
#include <iostream>
#include <vector>
#include <algorithm> // std::sort

int main() {
    std::vector<int> numeros = {5, 2, 8, 1, 4};

    // Orden ascendente (criterio por defecto)
    std::sort(numeros.begin(), numeros.end());

    std::cout << "Ascendente: ";
    for (int n : numeros) std::cout << n << " ";
    std::cout << "\n";

    // Orden descendente (criterio definido por una lambda)
    std::sort(numeros.begin(), numeros.end(), [](int a, int b) {
        return a > b;  // Devuelve true si 'a' debe ir antes que 'b'
    });

    std::cout << "Descendente: ";
    for (int n : numeros) std::cout << n << " ";
    std::cout << "\n";
}
```
* `std::sort` ordena el vector usando el criterio de comparación que recibe como tercer argumento.
* La **lambda** sustituye la necesidad de escribir una función o clase comparadora aparte.
* Cambiar el comportamiento solo requiere modificar la expresión lambda.

## Ejemplo 2: lambdas que capturan variables del entorno y modifican el comportamiento

Las lambdas pueden **capturar valores externos** y usarlos para crear comportamientos diferentes.
En este ejemplo, definiremos dos lambdas (`mayorQue` y `menorQue`) y las usaremos con el mismo algoritmo para producir resultados distintos.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numeros = {1, 4, 7, 2, 9, 5};
    int umbral = 5;

    // Lambda que determina si un número es mayor que el umbral
    auto mayorQue = [umbral](int x) {
        return x > umbral;
    };

    // Lambda que determina si un número es menor que el umbral
    auto menorQue = [umbral](int x) {
        return x < umbral;
    };

    // Buscar el primer número mayor que el umbral
    auto it1 = std::find_if(numeros.begin(), numeros.end(), mayorQue);
    if (it1 != numeros.end())
        std::cout << "Primer número mayor que " << umbral << ": " << *it1 << "\n";

    // Buscar el primer número menor que el umbral
    auto it2 = std::find_if(numeros.begin(), numeros.end(), menorQue);
    if (it2 != numeros.end())
        std::cout << "Primer número menor que " << umbral << ": " << *it2 << "\n";
}
```
* Ambas lambdas capturan la variable `umbral` por valor (`[umbral]`), pero aplican **condiciones opuestas**.
* El algoritmo `std::find_if` es el mismo: lo que cambia es el **criterio** que se le inyecta.
* Así, con el mismo conjunto de datos y la misma lógica de búsqueda, obtenemos **comportamientos distintos** simplemente cambiando la lambda.

Hasta ahora hemos visto cómo las lambdas pueden **representar acciones** y **personalizar algoritmos**.
En el siguiente apartado aprenderemos a **crear funciones o métodos que acepten funciones como parámetros**, lo que nos permitirá **inyectar comportamientos personalizados** y diseñar sistemas verdaderamente **configurables y flexibles**.
