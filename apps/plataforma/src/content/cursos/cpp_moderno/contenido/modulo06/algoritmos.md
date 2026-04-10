---
title: "Algoritmos de la STL"
---

La biblioteca estándar de C++ proporciona un conjunto de **algoritmos genéricos** definidos como **plantillas de funciones**, definidos en el encabezado `<algorithm>`. Estos algoritmos permiten realizar de forma segura y eficiente operaciones comunes sobre colecciones de datos, como:

* Ordenación.
* Búsqueda.
* Transformaciones.
* Contado de elementos.
* Comprobaciones de propiedades.
* Reordenamientos.

Los algoritmos están diseñados para operar sobre **rangos de iteradores**, lo que los hace aplicables a la mayoría de los contenedores estándar. En nuestro caso, lo vamos a usar en los contenedores que hemos estudiado en los apartados anteriores: `std::string`, `std::array`, `std::vector` y `std::list`.

`std::list` no proporciona acceso aleatorio, por lo que no se pueden aplicar algunos algoritmos como `std::sort`. Sin embargo, `std::list` tiene su propio método `sort()`.

## Algoritmos más habituales

A continuación, algunos de los algoritmos más utilizados:

* `std::sort`: Ordena los elementos en orden ascendente
* `std::reverse`: Invierte el orden de los elementos
* `std::count`: Cuenta las apariciones de un valor específico
* `std::find`: Busca un valor y devuelve un iterador al mismo
* `std::all_of`: Comprueba si todos los elementos cumplen una condición
* `std::any_of`: Comprueba si al menos un elemento cumple una condición
* `std::none_of`: Comprueba si ningún elemento cumple una condición
* `std::fill`: Asigna un valor a todos los elementos del contenedor
* `std::transform`: Aplica una función a cada elemento y guarda el resultado
* `std::copy`: Copia elementos de un contenedor a otro


## Ejemplos

Ejemplo con `std::string`:

```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <cctype> // Para funciones como ::tolower

int main() {
    std::string texto = "Algoritmo";

    // std::transform: Convertir todos los caracteres a minúsculas
    // Recibe el inicio y fin del rango de entrada, el inicio del rango de salida y la función que se ejecuta.
    std::transform(texto.begin(), texto.end(), texto.begin(), ::tolower);
    std::cout << "Texto en minúsculas: " << texto << std::endl;

    // std::sort: Ordenar los caracteres alfabéticamente
    std::sort(texto.begin(), texto.end());
    std::cout << "Texto ordenado: " << texto << std::endl;

    // std::reverse: Invertir el orden de los caracteres
    std::reverse(texto.begin(), texto.end());
    std::cout << "Texto invertido: " << texto << std::endl;

    // std::count: Contar cuántas veces aparece la letra 'o'
    int numO = std::count(texto.begin(), texto.end(), 'o');
    std::cout << "La letra 'o' aparece " << numO << " veces." << std::endl;

    // std::find: Buscar la letra 'a'
    auto it = std::find(texto.begin(), texto.end(), 'a');
    if (it != texto.end()) {
        std::cout << "La letra 'a' se encuentra en el texto." << std::endl;
    }

    // std::all_of: Comprobar si todos los caracteres son minúsculas
    if (std::all_of(texto.begin(), texto.end(), ::islower)) {
        std::cout << "Todos los caracteres son minúsculas." << std::endl;
    }

    // std::any_of: Comprobar si hay al menos una vocal
    if (std::any_of(texto.begin(), texto.end(), [](char c){
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    })) {
        std::cout << "Hay al menos una vocal." << std::endl;
    }

    // std::none_of: Comprobar si no hay dígitos
    if (std::none_of(texto.begin(), texto.end(), ::isdigit)) {
        std::cout << "No hay dígitos en el texto." << std::endl;
    }
}
```
Ejemplo con `std::array`:

```cpp
#include <iostream>
#include <array>
#include <algorithm>

int main() {
    std::array<int, 5> numeros = {3, 1, 4, 1, 5};

    // std::sort: Ordenar el array
    std::sort(numeros.begin(), numeros.end());
    std::cout << "Array ordenado: ";
    for (int n : numeros) std::cout << n << " ";
    std::cout << std::endl;

    // std::reverse: Invertir el array
    std::reverse(numeros.begin(), numeros.end());
    std::cout << "Array invertido: ";
    for (int n : numeros) std::cout << n << " ";
    std::cout << std::endl;

    // std::count: Contar cuántas veces aparece el 1
    int cantidad = std::count(numeros.begin(), numeros.end(), 1);
    std::cout << "El número 1 aparece " << cantidad << " veces." << std::endl;

    // std::find: Buscar el 4
    auto it = std::find(numeros.begin(), numeros.end(), 4);
    if (it != numeros.end()) {
        std::cout << "El número 4 está en el array." << std::endl;
    }

    // std::fill: Rellenar el array con ceros
    std::fill(numeros.begin(), numeros.end(), 0);
    std::cout << "Array tras rellenarlo con ceros: ";
    for (int n : numeros) std::cout << n << " ";
    std::cout << std::endl;
}
```
Ejemplo con `std::vector`:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> datos = {7, 2, 5, 3, 9};

    // std::any_of: ¿Hay algún número mayor que 5?
    if (std::any_of(datos.begin(), datos.end(), [](int x){ return x > 5; })) {
        std::cout << "Hay al menos un valor mayor que 5." << std::endl;
    }

    // std::all_of: ¿Todos son positivos?
    if (std::all_of(datos.begin(), datos.end(), [](int x){ return x > 0; })) {
        std::cout << "Todos los elementos son positivos." << std::endl;
    }

    // std::sort: Ordenar el vector
    std::sort(datos.begin(), datos.end());
    std::cout << "Vector ordenado: ";
    for (int x : datos) std::cout << x << " ";
    std::cout << std::endl;

    // std::transform: Multiplicar cada elemento por 2
    std::transform(datos.begin(), datos.end(), datos.begin(), [](int x){ return x * 2; });
    std::cout << "Vector tras multiplicar por 2: ";
    for (int x : datos) std::cout << x << " ";
    std::cout << std::endl;

    // std::copy: Copiar el vector a otro vector
    std::vector<int> copia(datos.size());
    std::copy(datos.begin(), datos.end(), copia.begin());
    std::cout << "Copia del vector: ";
    for (int x : copia) std::cout << x << " ";
    std::cout << std::endl;
}
```
Ejemplo con `std::list`:

```cpp
#include <iostream>
#include <list>
#include <algorithm>

int main() {
    std::list<int> lista = {4, 2, 7, 3, 1};

    // std::list no permite std::sort, se usa su método propio
    lista.sort();
    std::cout << "Lista ordenada: ";
    for (int n : lista) std::cout << n << " ";
    std::cout << std::endl;

    // std::reverse funciona porque opera sobre iteradores bidireccionales
    std::reverse(lista.begin(), lista.end());
    std::cout << "Lista invertida: ";
    for (int n : lista) std::cout << n << " ";
    std::cout << std::endl;

    // std::count: contar apariciones de un valor
    int numVeces = std::count(lista.begin(), lista.end(), 2);
    std::cout << "El número 2 aparece " << numVeces << " veces." << std::endl;

    // std::find: buscar un valor
    auto it = std::find(lista.begin(), lista.end(), 7);
    if (it != lista.end()) {
        std::cout << "El número 7 se encuentra en la lista." << std::endl;
    }
}
```

## Algoritmos aplicables a mapas

Los mapas (`std::map` y `std::unordered_map`) son contenedores que proporcionan **iteradores** , por lo que se pueden usar algoritmos de la STL que:

* No modifiquen la estructura interna del mapa (es decir, que no intenten ordenar, insertar o eliminar elementos, lo cual debe hacerse mediante los métodos específicos del mapa).
* Trabajen sobre el rango proporcionado por los iteradores, generalmente operando sobre los **pares clave-valor**.

Por lo tanto, no se pueden usar algoritmos como `std::sort`, `std::reverse`, `std::shuffle`.

Ejemplos de algoritmos que **sí** se pueden aplicar:

* `std::for_each`: Recorrer y aplicar una función a cada elemento.
* `std::find_if`: Buscar un elemento que cumpla una condición (aunque para buscar por clave es mejor usar `find()`).
* `std::count_if`: Contar elementos que cumplan una condición.
* `std::all_of`, `std::any_of`, `std::none_of`: Comprobar condiciones sobre los elementos.


Veamos un ejemplo:


```cpp
#include <iostream>
#include <map>
#include <algorithm>
#include <string>

int main() {
    std::map<std::string, int> edades {
        {"Ana", 25},
        {"Luis", 30},
        {"Maria", 28}
    };

    // std::for_each para mostrar contenido
    std::for_each(edades.begin(), edades.end(), [](const auto& par) {
        std::cout << par.first << " tiene " << par.second << " años.\n";
    });

    // std::count_if para contar personas mayores de 27
    int mayores = std::count_if(edades.begin(), edades.end(), [](const auto& par) {
        return par.second > 27;
    });
    std::cout << "Hay " << mayores << " personas mayores de 27 años.\n";

    // std::find_if para buscar a alguien con 30 años
    auto it = std::find_if(edades.begin(), edades.end(), [](const auto& par) {
        return par.second == 30;
    });

    if (it != edades.end()) {
        std::cout << it->first << " tiene 30 años.\n";
    } else {
        std::cout << "Nadie tiene 30 años.\n";
    }

    // all_of: ¿Todas las personas son mayores de 20 años?
    bool todos_mayores_20 = std::all_of(edades.begin(), edades.end(), [](const auto& par) {
        return par.second > 20;
    });
    std::cout << "Todas las personas son mayores de 20 años? " 
              << (todos_mayores_20 ? "Sí" : "No") << "\n";

    // any_of: ¿Hay alguien menor de 26 años?
    bool alguno_menor_26 = std::any_of(edades.begin(), edades.end(), [](const auto& par) {
        return par.second < 26;
    });
    std::cout << "Hay alguien menor de 26 años? " 
              << (alguno_menor_26 ? "Sí" : "No") << "\n";

    // none_of: ¿Nadie tiene exactamente 35 años?
    bool nadie_35 = std::none_of(edades.begin(), edades.end(), [](const auto& par) {
        return par.second == 35;
    });
    std::cout << "Nadie tiene 35 años? " 
              << (nadie_35 ? "Sí" : "No") << "\n";

    return 0;
}

```
