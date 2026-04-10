---
title: "Cadenas de caracteres: `std::string`"
---

La clase `std::string` forma parte de la **Biblioteca Estándar de C++** y proporciona una forma moderna, segura y flexible de trabajar con cadenas de caracteres. A diferencia de las cadenas de C tradicionales (arreglos de caracteres terminados en `'\0'`), `std::string`:

* Gestiona automáticamente la memoria necesaria para almacenar el texto.
* Permite redimensionar la cadena dinámicamente.
* Ofrece numerosos métodos que facilitan la manipulación de texto.
* Proporciona seguridad adicional, evitando errores comunes como desbordamientos de búfer.

En C++ moderno, salvo casos muy específicos de bajo nivel o interoperabilidad con C, **se recomienda siempre utilizar `std::string`** para trabajar con texto.

## Métodos más utilizados de `std::string`

A continuación se presenta una lista de los métodos más frecuentes y útiles que proporciona la clase `std::string`:

* `length()` o `size()`: Devuelve el número de caracteres de la cadena. No devuelve un `int` devuelve un tipo llamado `std::size_t` que es un entero sin signo y que se suele utilizar para representar tamaños, conteos o índices de arrays, contenedores y estructuras de datos.
* `empty()`: Indica si la cadena está vacía.
* `at(pos)`: Devuelve el carácter en la posición `pos` con comprobación de límites.
* `front()`: Devuelve el primer carácter de la cadena.
* `back()`: Devuelve el último carácter de la cadena.
* `substr(pos, n)`: Devuelve una subcadena que comienza en la posición `pos` y tiene longitud `n`.
* `find(cadena)`: Devuelve la posición donde se encuentra la primera aparición de `cadena`, o `std::string::npos` si no se encuentra.
* `rfind(cadena)`: Devuelve la posición de la última aparición de `cadena`.
* `insert(pos, cadena)`: Inserta `cadena` en la posición `pos`.
* `erase(pos, n)`: Elimina `n` caracteres a partir de la posición `pos`.
* `replace(pos, n, cadena)`: Reemplaza los `n` caracteres a partir de `pos` por `cadena`.
* `append(cadena)`: Añade `cadena` al final.
* `compare(cadena)`: Compara dos cadenas, devolviendo `0` si son iguales, `< 0`	si la cadena que llama al método es menor y `> 0` si la cadena que llama al método es mayor.

Veamos un ejemplo:
```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    // Longitud de la cadena
    std::cout << "Longitud: " << texto.length() << std::endl;

    // Acceso seguro al primer y último carácter
    std::cout << "Primer carácter: " << texto.front() << std::endl;
    std::cout << "Último carácter: " << texto.back() << std::endl;

    // Subcadena
    std::string subcadena = texto.substr(0, 4);
    std::cout << "Subcadena: " << subcadena << std::endl;

    // Búsqueda de una palabra
    size_t posicion = texto.find("Mundo");
    if (posicion != std::string::npos) {
        std::cout << "\"Mundo\" encontrado en la posición: " << posicion << std::endl;
    }

    // Reemplazo de texto
    texto.replace(5, 5, "ChatGPT");
    std::cout << "Texto modificado: " << texto << std::endl;

    // Concatenación con append
    texto.append("!");
    std::cout << "Texto final: " << texto << std::endl;

    // Comparación
    std::string otroTexto {"Hola ChatGPT!"};
    if (texto.compare(otroTexto) == 0) {
        std::cout << "Las cadenas son iguales." << std::endl;
    } else {
        std::cout << "Las cadenas son diferentes." << std::endl;
    }

    return 0;
}
```

## Recorrido de un `std::string`

Una operación habitual al trabajar con cadenas es recorrer sus caracteres, ya sea para mostrarlos, analizarlos o modificarlos. Existen varias formas de hacerlo, y es importante utilizar el tipo de dato correcto para los índices, especialmente en C++ moderno.

### Bucle clásico con índice

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    for (std::size_t i = 0; i < texto.size(); i++) {
        std::cout << texto[i] << ' ';
    }
    std::cout << std::endl;

    return 0;
}
```

Ten en cuenta que hemos usado `std::size_t` para declarar el índice `i` y hemos usado indexación para acceder a cada uno de los elementos utilizando `[ ]`.

Si queremos tener un acceso seguro no utilizamos indexación, usamos el método `at`:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    for (std::size_t i = 0; i < texto.size(); i++) {
        std::cout << texto.at(i) << ' ';
    }
    std::cout << std::endl;

    return 0;
}
```

* `texto.at(i)` lanza una excepción `std::out_of_range` si el índice es inválido, haciendo el acceso más seguro.

### Bucle range-based for loop (bucle basado en rangos)

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    for (char c : texto) {
        std::cout << c << ' ';
    }
    std::cout << std::endl;

    return 0;
}
```

Esta forma es más sencilla y legible, y no tenemos la necesidad de usar índices. Si queremos modificar la cadena tenemos que hacer un recorrido con referencias:

```cpp
#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string texto {"Hola Mundo"};

    for (char& c : texto) {
        c = std::toupper(c);  // Convierte cada carácter a mayúscula
    }

    std::cout << texto << std::endl;  // Salida: "HOLA MUNDO"

    return 0;
}
```

### Recorrido con iteradores

Un **iterador** en C++ moderno es un objeto que permite recorrer los elementos de un contenedor (como un `std::vector`, `std::list`, `std::map`, etc.) de manera similar a un puntero. Los iteradores abstraen el acceso a los elementos del contenedor, proporcionando una interfaz común para iterar sobre diferentes tipos de contenedores, sin necesidad de conocer su implementación interna.

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    for (std::string::iterator it = texto.begin(); it != texto.end(); ++it) {
        std::cout << *it << ' ';
    }
    std::cout << std::endl;

    return 0;
}
```

En este ejemplo:

* `texto.begin()` devuelve un **iterador** que apunta al primer carácter de la cadena.
* `texto.end()` devuelve un **iterador** que apunta a la posición **después** del último elemento.
* `++it` avanza el iterador al siguiente elemento, y `*it` accede al valor al que apunta.

## `std::string` como parámetro en funciones

### Paso por valor

Cuando pasamos un `std::string` por valor, se realiza una **copia completa** del objeto. Esto significa que la cadena original no se ve afectada por modificaciones dentro de la función, pero puede ser menos eficiente si la cadena es muy grande.

```cpp
#include <iostream>
#include <string>

void imprimirCadena(std::string texto) {
    std::cout << "Texto dentro de la función: " << texto << std::endl;
    texto = "Texto modificado";
    std::cout << "Texto modificado dentro de la función: " << texto << std::endl;
}

int main() {
    std::string original = "Hola Mundo";
    
    imprimirCadena(original);  // Se pasa por valor

    std::cout << "Texto después de la función: " << original << std::endl;  // No ha cambiado

    return 0;
}
```
### Paso por referencia

Cuando pasamos un `std::string` por **referencia** (sin `const`), la función puede modificar directamente el objeto original. Esto es útil cuando se necesita cambiar el contenido de la cadena en la función y no se desea realizar una copia.

```cpp
#include <iostream>
#include <string>

void modificarCadena(std::string& texto) {
    std::cout << "Texto antes de la modificación: " << texto << std::endl;
    texto = "Texto modificado";
    std::cout << "Texto después de la modificación: " << texto << std::endl;
}

int main() {
    std::string original = "Hola Mundo";
    
    modificarCadena(original);  // Se pasa por referencia

    std::cout << "Texto después de la función: " << original << std::endl;  // Ha cambiado

    return 0;
}
```

### Paso por referencia constante

Si no necesitas modificar la cadena dentro de la función, pero aún deseas evitar hacer una copia innecesaria, puedes pasar el `std::string` por **referencia constante**. Esto mejora la eficiencia, ya que no se realiza una copia, y también garantiza que la cadena no sea modificada dentro de la función.

```cpp
#include <iostream>
#include <string>

void imprimirCadena(const std::string& texto) {
    std::cout << "Texto dentro de la función: " << texto << std::endl;
}

int main() {
    std::string original = "Hola Mundo";
    
    imprimirCadena(original);  // Se pasa por referencia constante

    return 0;
}
```

### Paso por puntero

Aunque no es tan común en C++ moderno, también es posible pasar un `std::string` por **puntero**. Este enfoque se utiliza con menos frecuencia, ya que la referencia es más segura y conveniente. Sin embargo, es útil cuando se quiere pasar un puntero nulo (es decir, cuando se desea tener la posibilidad de que el argumento sea opcional).

```cpp
#include <iostream>
#include <string>

void modificarCadena(std::string* texto) {
    if (texto != nullptr) {
        std::cout << "Texto antes de la modificación: " << *texto << std::endl;
        *texto = "Texto modificado";
        std::cout << "Texto después de la modificación: " << *texto << std::endl;
    }
}

int main() {
    std::string original = "Hola Mundo";
    
    modificarCadena(&original);  // Se pasa por puntero

    std::cout << "Texto después de la función: " << original << std::endl;  // Ha cambiado

    return 0;
}
```
