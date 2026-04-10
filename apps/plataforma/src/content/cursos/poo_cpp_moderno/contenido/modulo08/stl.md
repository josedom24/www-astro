---
title: "Las plantillas de clase y la STL"
---

La STL (*Standard Template Library*) es un componente esencial del C++ moderno. Está construida íntegramente mediante **plantillas de clase y de función**, lo que permite que sus contenedores y algoritmos sean completamente genéricos. Gracias a ello, es posible trabajar con estructuras de datos eficientes y reutilizables sin necesidad de herencia ni polimorfismo dinámico.

La STL se organiza en tres grandes bloques:

* **Contenedores genéricos** (`std::vector<T>`, `std::array<T,N>`, `std::list<T>`, etc.), que almacenan colecciones de elementos de cualquier tipo `T`.
* **Algoritmos genéricos** (`std::sort`, `std::find`, `std::accumulate`, etc.), que operan sobre cualquier secuencia definida por iteradores.
* **Iteradores**, que unifican la manera de recorrer contenedores independientemente de su implementación interna.

Esta separación entre *almacenamiento* (contenedores) y *comportamiento* (algoritmos) permite escribir código flexible, expresivo y eficiente.


## Ejemplo: potencia de los algoritmos genéricos

En este ejemplo, un mismo algoritmo (`std::sort`) y una misma transformación (`std::transform`) se aplican a dos contenedores distintos (`std::vector` y `std::array`) sin necesidad de escribir versiones específicas:

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {4, 1, 3, 2};
    std::array<double, 4> a = {8.2, 5.0, 7.4, 6.6};

    std::sort(v.begin(), v.end());
    std::sort(a.begin(), a.end());

    std::transform(v.begin(), v.end(), v.begin(), [](int x){ return x * 2; });
    std::transform(a.begin(), a.end(), a.begin(), [](double x){ return x * 2; });

    for (int x : v) std::cout << x << " ";  // 2 4 6 8
    std::cout << '\n';
    for (double x : a) std::cout << x << " ";  // 10 13.2 14.8 16.4
    return 0;
}
```

* `std::vector<int>` y `std::array<double,4>` son **instancias de plantillas de clase**.
* `std::sort` y `std::transform` son **funciones plantilla** que funcionan con cualquier contenedor que proporcione iteradores.
* No es necesario duplicar código para cada tipo de contenedor: los algoritmos son reutilizables y consistentes.

