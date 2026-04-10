---
title: "Conversión de cadenas de caracteres"
---

En muchos programas necesitamos convertir datos entre **números** y **cadenas de texto**. Por ejemplo:

* Leer un número como texto desde el teclado y convertirlo a un entero.
* Convertir un número a texto para mostrarlo por pantalla o almacenarlo.

C++ moderno nos proporciona formas sencillas y seguras de hacer estas conversiones, especialmente gracias a las funciones de la biblioteca estándar.

## De número a string

Para convertir un número a texto, utilizamos la función `std::to_string`. Esta función convierte diferentes tipos de números (enteros, decimales, etc.) a un objeto de tipo `std::string`. Ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    int numero {42};
    double decimal {3.14};

    std::string texto1 {std::to_string(numero)};
    std::string texto2 {std::to_string(decimal)};

    std::cout << "Número como texto: " << texto1 << std::endl;
    std::cout << "Decimal como texto: " << texto2 << std::endl;

    return 0;
}
```

Muy útil para mostrar resultados por pantalla o para generar mensajes.

## De string a número

Cuando tenemos un valor en formato texto y queremos obtener su valor numérico, usamos funciones como:

* `std::stoi`: Convierte string a `int`.
* `std::stol`: Convierte string a `long`.
* `std::stoll`: Convierte string a `long long`.
* `std::stof`: Convierte string a `float`.
* `std::stod`: Convierte string a `double`.
* `std::stold`: Convierte string a `long double`.

Estas funciones se encuentran en la biblioteca `<string>`. Ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto1 {"123"};
    std::string texto2 {"3.1416"};

    int numero {std::stoi(texto1)};
    double decimal {std::stod(texto2)};

    std::cout << "Texto como número entero: " << numero << std::endl;
    std::cout << "Texto como número decimal: " << decimal << std::endl;

    return 0;
}
```


Si el texto no representa un valor numérico válido, estas funciones generan un **error de ejecución** llamado `std::invalid_argument`. Ejemplo:

```cpp
std::string texto {"abc"};
int numero {std::stoi(texto)};  // ERROR en tiempo de ejecución
```

Por eso, en programas robustos, se suelen incluir comprobaciones o manejar estas excepciones (tema que se verá más adelante en el curso).

## Ejemplo completo

```cpp
#include <iostream>
#include <string>

int main() {
    std::string edadTexto {};
    std::cout << "Introduce tu edad: ";
    std::getline(std::cin, edadTexto);

    int edad {std::stoi(edadTexto)};
    
    std::string mensaje {"Tienes " + std::to_string(edad) + " años."};
    std::cout << mensaje << std::endl;

    return 0;
}
```
