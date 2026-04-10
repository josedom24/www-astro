---
title: "Uso de funciones genéricas con contenedores STL"
---

La programación genérica en C++ permite escribir funciones y algoritmos que operan sobre una amplia variedad de tipos sin perder eficiencia ni claridad. Una de las aplicaciones más relevantes de esta capacidad es su integración con los **contenedores de la STL** (Standard Template Library), como `std::vector`, `std::list` o `std::map`.

## Ejemplo: impresión de elementos

Una función que recorra cualquier contenedor iterable e imprima sus elementos puede definirse de forma genérica así:

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <string>

template <typename Container>
void print_container(const Container& cont) {
    for (const auto& elem : cont) {
        std::cout << elem << ' ';
    }
    std::cout << '\n';
}
int main() {
    std::vector<int> v = {1, 2, 3};
    std::list<std::string> l = {"uno", "dos", "tres"};

    print_container(v); // Imprime: 1 2 3
    print_container(l); // Imprime: uno dos tres
}
```
* `Container` es un **tipo genérico** que se deduce automáticamente cuando llamas a la función.
* Puede ser **cualquier contenedor** que se puede recorrer con bucles range-based for loop o con iteradores:
  * `std::vector<T>`
  * `std::list<T>`
  * `std::array<T, N>`
  * Incluso contenedores propios que implementen `begin()` y `end()`.
* El compilador reemplaza `Container` por `std::vector<int>`.
* Así, con **una sola plantilla**, puedes imprimir distintos tipos de contenedores.

## Ejemplo: modificación de elementos

También es posible escribir funciones plantilla que **modifiquen** o **transformen** los elementos de un contenedor. Por ejemplo, aplicar una operación a cada elemento:

```cpp
#include <iostream>
#include <vector>

template <typename Container>
void print_container(const Container& cont) {
    for (const auto& elem : cont) {
        std::cout << elem << ' ';
    }
    std::cout << '\n';
}

template <typename Container, typename Function>
void apply_to_all(Container& cont, Function f) {
    for (auto& elem : cont) {
        f(elem);
    }
}
int main() {
    std::vector<int> v = {1, 2, 3, 4};
    apply_to_all(v, [](int& x) { x *= 2; });
    print_container(v); // Imprime: 2 4 6 8

}
```
Aquí se hace uso de una expresión lambda como parámetro, lo que permite aplicar cualquier transformación sin reescribir la función genérica.

