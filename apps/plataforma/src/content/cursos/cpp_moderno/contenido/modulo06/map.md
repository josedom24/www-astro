---
title: "Mapas: `std::map` y `std::unordered_map`"
---

Tanto `std::map` como `std::unordered_map` son estructuras de datos de la biblioteca estándar de C++ (STL) que permiten almacenar **pares clave-valor**, donde cada clave es única y está asociada a un valor. Para trabajar con los mapas hay que incluir la cabecera `<map>`.

* `std::map`: Implementa un árbol binario balanceado, lo que garantiza que los elementos estén **ordenados según la clave**.
* `std::unordered_map`: Implementa una tabla hash, por lo que **no mantiene el orden de los elementos**, pero ofrece tiempos de acceso promedio más rápidos para operaciones de búsqueda e inserción.

Estas estructuras son útiles cuando se desea asociar una clave a un valor y poder buscar rápidamente un valor a partir de su clave.

## Declaración e inicialización de `std::map` y `std::unordered_map`

En la declaración es necesario indicar el tipo de datos de la clave y el del valor. La inicialización se puede realizar mediante inicialización uniforme:

```cpp
#include <map>
#include <unordered_map>
#include <string>

int main() {
    std::map<std::string, int> edades {
        {"Ana", 25},
        {"Luis", 30},
        {"Maria", 28}
    };

    std::unordered_map<std::string, int> telefonos {
        {"Ana", 1234},
        {"Luis", 5678},
        {"Maria", 9101}
    };

    return 0;
}
```


## Acceso a los elementos de un mapa

Existen dos formas principales de acceder a los elementos o crear nuevos pares clave-valor:

* **Acceso mediante el operador `[]`**: Si la clave existe, devuelve una referencia al valor asociado.
  Si la clave no existe, crea un nuevo par clave-valor, inicializando el valor por defecto (por ejemplo, `0` para enteros).

    ```cpp
    std::map<std::string, int> edades;
    edades["Ana"] = 25; // Crea el par {"Ana", 25}
    int edadLuis = edades["Luis"]; // Crea {"Luis", 0} si no existe, luego devuelve 0
    ```

* **Acceso mediante `at(clave)`**: Si la clave existe, devuelve una referencia al valor asociado.
  Si la clave no existe, lanza una excepción (error en tiempo de ejecución) `std::out_of_range`.

    ```cpp
    std::map<std::string, int> edades{{"Ana", 25}};
    int edadAna = edades.at("Ana"); // Devuelve 25
    // int edadLuis = edades.at("Luis"); // Error en tiempo de ejecución si "Luis" no existe


## Métodos más importantes de `std::map` y `std::unordered_map`

* `size()`: Devuelve el número de elementos del mapa. El tipo devuelto es `std::size_t`.
* `empty()`: Devuelve `true` si el mapa está vacío.
* `insert({clave, valor})`: Inserta un nuevo par clave-valor. Si la clave ya existe, no se modifica el valor.
* `at(clave)`: Accede al valor asociado a una clave. Si la clave no existe, lanza una excepción `std::out_of_range`.
* `erase(clave)`: Elimina el elemento asociado a la clave, si existe.
* `clear()`: Elimina todos los elementos del mapa.
* `find(clave)`: Devuelve un iterador al elemento con la clave dada o `end()` si no se encuentra.
* `count(clave)`: Devuelve 1 si la clave existe o 0 si no existe.

Ejemplo:

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> edades {
        {"Ana", 25},
        {"Luis", 30}
    };

    edades.insert({"María", 28});   // Insertar un nuevo elemento
    edades["Pedro"] = 35;           // Insertar o modificar un elemento

    std::cout << "Edad de Ana: " << edades.at("Ana") << std::endl;

    if (edades.count("Luis") > 0) {
        std::cout << "Luis está en el mapa." << std::endl;
    }
    edades.erase("Ana");            // Eliminar un elemento
    std::cout << "Tamaño del mapa: " << edades.size() << std::endl;
    edades.clear();                 // Eliminar todos los elementos
    return 0;
}
```

## Recorridos de un `std::map` o `std::unordered_map`

### Bucle range-based for loop (bucle basado en rangos)

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> edades {
        {"Ana", 25},
        {"Luis", 30},
        {"María", 28}
    };

    for (const auto& par : edades) {
        std::cout << par.first << " tiene " << par.second << " años." << std::endl;
    }

    return 0;
}
```
* En este caso la variable `par` es de tipo `std::pair<const Key, T>`.
* `par.first`: Representa la clave del par, en este caso un `std::string`. Ejemplo: "Ana".
* `par.second`: Representa el valor asociado a esa clave, en este caso un `int`. Ejemplo: 25.

### Recorrido con iteradores

```cpp
#include <iostream>
#include <unord_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> telefonos {
        {"Ana", 1234},
        {"Luis", 5678},
        {"María", 9101}
    };

    for (auto it = telefonos.begin(); it != telefonos.end(); ++it) {
        std::cout << it->first << ": " << it->second << std::endl;
    }

    return 0;
}
```

En este caso `it` representa un iterador que internamente es un puntero, para acceder a los miembros `first` y `second` se debe utilizar el operador `->`.


## Envío de `std::map` o `std::unordered_map` como parámetro a funciones

Como en los apartados anteriores, vemos un ejemplo donde se utiliza paso de referencia constante:

```cpp
#include <iostream>
#include <map>
#include <string>

void mostrar(const std::map<std::string, int>& datos) {
    for (const auto& par : datos) {
        std::cout << par.first << ": " << par.second << std::endl;
    }
}

int main() {
    std::map<std::string, int> edades {
        {"Ana", 25},
        {"Luis", 30},
        {"María", 28}
    };

    mostrar(edades);

    return 0;
}
```

Y otro ejemplo, donde vamos a modificar los datos del mapa, donde utilizamos paso por referencia:

```cpp
#include <iostream>
#include <unordered_map>
#include <string>

void agregarTelefono(std::unordered_map<std::string, int>& telefonos) {
    telefonos["Pedro"] = 2222;
}

int main() {
    std::unordered_map<std::string, int> telefonos {
        {"Ana", 1234},
        {"Luis", 5678}
    };

    agregarTelefono(telefonos);

    for (const auto& par : telefonos) {
        std::cout << par.first << ": " << par.second << std::endl;
    }

    return 0;
}
```