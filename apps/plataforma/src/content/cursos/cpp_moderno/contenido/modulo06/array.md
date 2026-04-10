---
title: "Arreglos: `std::array`"
---

Los arrays nos permiten trabajar con conjuntos de elementos del mismo tipo. Podemos hacerlos de dos maneras:

* **Arrays clásicos**, heredados de C. Que son una estructura de datos **estáticos** que almacenan la información en bloques de memoria contigua y almacenan elementos del mismo tipo. Por ejemplo:

    ```cpp
    int numeros[5] {1, 2, 3, 4, 5};
    ```

    Trabajar con estas estructuras conlleva algunos inconvenientes:

    * No conocen su propio tamaño.
    * No ofrecen métodos ni funcionalidades adicionales.
    * Son propensos a errores como desbordamientos de búfer.
    * El acceso fuera de los límites genera comportamiento indefinido.

* **Arrays modernos**: `std::array`. Un **contenedor** que nos ofrece trabajar con arrays con la seguridad y funcionalidad de las estructuras de la STL. Para usar este tipo de datos tenemos que incluir el fichero de cabecera `<array>`. Características:

    * Conoce su propio tamaño mediante `size()`.
    * Seguridad adicional con `at()`.
    * Funciona con algoritmos de la STL (como `std::sort`).
    * Mayor legibilidad y mantenimiento del código.
    * Permite inicialización uniforme y sintaxis moderna.


## Declaración e inicialización de `std::array`

El tipo se declara como `std::array<TIPO, TAMAÑO>`. Donde se indica el tipo de los elementos del array y el número de elementos. El tamaño **debe conocerse en tiempo de compilación**. Veamos un ejemplo:

```cpp
#include <array>
#include <iostream>

int main() {
    std::array<int, 5> numeros {1, 2, 3, 4, 5};

    for (int n : numeros) {
        std::cout << n << " ";
    }
}
```
## Métodos más importantes de `std::array`

* `size()`: Devuelve el tamaño del array. Como en las cadenas devuelve un dato del tipo `std::size_t`.
* `empty()`: Indica si el array está vacío. Devuelve un valor booleano.
* `at(índice)`: Acceso seguro con comprobación de límites, aunque también se puede usar la indexación del mismo modo que en la `std::string`.
* `front()`, `back()`: Acceso al primer y último elemento.
* `fill(valor)`: Rellena todo el array con el valor especificado.

Ejemplo:

```cpp
#include <iostream>
#include <array>

int main() {
    std::array<int, 5> numeros{1, 2, 3, 4, 5};

    std::cout << "Tamaño: " << numeros.size() << std::endl;
    std::cout << "Primer elemento: " << numeros.front() << std::endl;
    std::cout << "Último elemento: " << numeros.back() << std::endl;

    numeros.fill(0); // Todos los elementos a 0

    for (size_t i = 0; i < numeros.size(); ++i) {
        std::cout << numeros[i] << " ";
        std::cout << numeros.at(i) << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

## Recorridos de un `std::array`

### Bucle clásico con índice

```cpp
#include <iostream>
#include <array>

int main() {
    std::array<int, 5> numeros{1, 2, 3, 4, 5};

    for (std::size_t i = 0; i < numeros.size(); i++) {
        std::cout << numeros.at(i) << " ";
    }

    std::cout << std::endl;
    return 0;
}
```

### Bucle range-based for loop (bucle basado en rangos)


```cpp
#include <iostream>
#include <array>

int main() {
    std::array<int, 5> numeros{1, 2, 3, 4, 5};

    for (int valor : numeros) {
        std::cout << valor << " ";
    }

    std::cout << std::endl;
    return 0;
}
```

### Recorrido con iteradores

```cpp
#include <iostream>
#include <array>

int main() {
    std::array<int, 5> numeros{1, 2, 3, 4, 5};

    for (auto it = numeros.begin(); it != numeros.end(); ++it) {
        std::cout << *it << " ";
    }

    std::cout << std::endl;
    return 0;
}
```

## Envío de `std::array` como parámetro a funciones

El paso de `std::array` se puede hacer de diferentes maneras como hemos estudiado con la estructura `std::string`. Aunque podríamos hacer un paso por valor, para evitar la copia de la estructura completa y la posible perdida de rendimiento se suele usar el paso por referencia constante:


```cpp
#include <iostream>
#include <array>

// Función que muestra el contenido de un std::array
void mostrar(const std::array<int, 5>& arr) {
    for (int n : arr) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}

int main() {
    // Inicialización uniforme del array
    std::array<int, 5> datos{10, 20, 30, 40, 50};

    // Llamada a la función mostrar
    mostrar(datos);

    return 0;
}
```

En el caso de que queramos modificar los valores del array podemos pasarlo usando un puntero, aunque normalmente usaremos paso por referencia:


```cpp
#include <iostream>
#include <array>

void modificarYMostrar(std::array<int, 5>& arr) {
    for (int& n : arr) {
        n *= 2; // Modificar: duplicar cada valor
    }

    for (int n : arr) {
        std::cout << n << " "; // Mostrar
    }
    std::cout << std::endl;
}

int main() {
    std::array<int, 5> datos{1, 2, 3, 4, 5};
    modificarYMostrar(datos);
    return 0;
}
```

## Trabajando con arrays multidimensionales

Una **tabla o matriz** en un array bidimensional. La primera dimensión indica el número de filas y el segundo el número de columnas. Para acceder a cada uno de lo elemento tenemos que indicar la fila y la columna en la que se encuentra, siempre empezando por el 0. Veamos un ejemplo:

```cpp
#include <iostream>
#include <array>

int main() {
    // Definir una tabla de 3 filas por 4 columnas con valores iniciales
    std::array<std::array<int, 4>, 3> tabla {{
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    }};

    //Mostrar un elemento
    std::cout << tabla[1][2] << std::endl; // Imprime 7
    std::cout << tabla.at(1).at(2) << std::endl; // También imprime 7

    // Recorrer la tabla fila por fila
    for (const auto& fila : tabla) {
        for (int valor : fila) {
            std::cout << valor << " ";
        }
        std::cout << std::endl;
    }

    // Recorrer la tabla usando índices
    for (size_t i = 0; i < tabla.size(); ++i) {           // fila
        for (size_t j = 0; j < tabla[i].size(); ++j) {    // columna
            std::cout << tabla.at(i).at(j) << " ";
        }
        std::cout << std::endl;
    }

    return 0;
}
```

* Se usa `std::array<std::array<int, 4>, 3>` para representar una matriz de 3 filas y 4 columnas.
* Se inicializa con valores usando **inicialización uniforme**.
* El recorrido se hace usando bucles range-based (`for (const auto& fila : tabla)`).
* Cada `fila` es un `std::array<int, 4>`, y se puede recorrer también con un range-based loop.
* Los arrays pueden tener las dimensiones que deseemos, por ejemplo podemos tener una array de tres dimensiones. En este caso necesitaríamos 3 bucles for para realizar el recorrido.


