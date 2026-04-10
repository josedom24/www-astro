---
title: "Listas: `std::list`"
---

`std::list` es una estructura de datos proporcionada por la biblioteca estándar de C++ (STL) que implementa una **lista doblemente enlazada**. A diferencia de los contenedores `std::array` y `std::vector`, los elementos de un `std::list` no se almacenan en ubicaciones contiguas de memoria, sino que cada elemento mantiene un enlace (puntero) al siguiente y al anterior, lo que permite inserciones y eliminaciones eficientes en cualquier posición, incluso en el medio de la lista.

Es especialmente útil cuando se requiere **insertar o eliminar elementos de forma eficiente en cualquier posición**, sin necesidad de recorrer todo el contenedor o desplazar elementos. No obstante, si se necesita un acceso aleatorio rápido o el contenedor se consulta con frecuencia mediante índices, es más adecuado emplear `std::array` o `std::vector`.


## Declaración e inicialización de `std::list`

La inicialización se realiza con **inicialización uniforme**, de manera similar a otros contenedores:

```cpp
#include <list>
#include <iostream>

int main() {
    std::list<int> numeros {10, 20, 30, 40, 50};
    return 0;
}
```

## Métodos más importantes de `std::list`

* `size()`: Devuelve el número de elementos almacenados en la lista. El valor es de tipo `std::size_t`.
* `empty()`: Devuelve `true` si la lista está vacía, es decir, no contiene elementos.
* `push_back(valor)`: Añade un nuevo elemento al final de la lista.
* `push_front(valor)`: Añade un nuevo elemento al principio de la lista.
* `pop_back()`: Elimina el último elemento de la lista.
* `pop_front()`: Elimina el primer elemento de la lista.
* `insert(pos, valor)`: Inserta un elemento en la posición indicada mediante un iterador.
* `erase(pos)`: Elimina el elemento en la posición indicada mediante un iterador.
* `clear()`: Elimina todos los elementos de la lista.

Ejemplo:

```cpp
#include <list>
#include <iostream>

int main() {
    std::list<int> numeros {1, 2, 3};

    numeros.push_back(4);     // Añade al final
    numeros.push_front(0);    // Añade al principio

    std::cout << "Tamaño: " << numeros.size() << std::endl;

    numeros.pop_back();       // Elimina el último elemento
    numeros.pop_front();      // Elimina el primer elemento

    // Insertar en la segunda posición
    auto it = numeros.begin();
    ++it;
    numeros.insert(it, 99);   // Inserta 99 en la segunda posición

    // Eliminar el segundo elemento
    it = numeros.begin();
    ++it;
    numeros.erase(it);

    // Mostrar los elementos
    for (int n : numeros) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    numeros.clear(); // Vacía la lista
    return 0;
}
```

## Recorridos de un `std::list`

### Bucle range-based for loop (bucle basado en rangos)

```cpp
#include <list>
#include <iostream>

int main() {
    std::list<int> numeros {10, 20, 30, 40, 50};

    for (int valor : numeros) {
        std::cout << valor << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

### Recorrido con iteradores

```cpp
#include <list>
#include <iostream>

int main() {
    std::list<int> numeros {10, 20, 30, 40, 50};

    for (auto it = numeros.begin(); it != numeros.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

## Envío de `std::list` como parámetro a funciones

Realizamos las mismas consideraciones que hemos hecho con otros contenedores. Usamos paso por referencia constante si no necesitamos modificar los elementos de la lista:

```cpp
#include <list>
#include <iostream>

void mostrar(const std::list<int>& lista) {
    for (int n : lista) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::list<int> datos {10, 20, 30, 40, 50};
    mostrar(datos);
    return 0;
}
```

En el caso de que necesitemos modificar los elementos de las listas utilizaríamos paso por referencia constante:

```cpp
#include <list>
#include <iostream>

void modificarYMostrar(std::list<int>& lista) {
    for (int& n : lista) {
        n *= 2; // Duplica cada elemento
    }
    for (int n : lista) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::list<int> datos {1, 2, 3, 4, 5};
    modificarYMostrar(datos);
    return 0;
}
```

## Otros contenedores de la STL que no hemos estudiado

* `std::deque`: Estructura de datos similar a un `std::vector`, pero que permite inserciones y eliminaciones eficientes tanto al principio como al final.
* `std::set`: Contenedor que almacena elementos únicos en orden. Ideal para colecciones donde se desea evitar duplicados.
* `std::unordered_set`: Similar a `std::set`, pero sin mantener el orden de los elementos. Utiliza tablas hash para un acceso eficiente.

