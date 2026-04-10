---
title: "Entrada y salida estándar"
---

En C++ podemos interactuar con el usuario a través de la **entrada estándar** (habitualmente el teclado) y la **salida estándar** (habitualmente la pantalla).
Para ello, utilizamos los siguientes objetos: 

* **`std::cin`** es un objeto de la clase `std::istream`, definido en la librería `<iostream>`. Representa la entrada estándar.
* **`std::cout`** es un objeto de la clase `std::ostream`, también definido en `<iostream>`. Representa la salida estándar.

Para poder utilizarlos, es necesario incluir la biblioteca de cabecera `iostream`. Son objetos globales creados por la biblioteca estándar al inicio del programa, listos para usarse. 

## Salida por pantalla: `std::cout`

El objeto `std::cout` representa la salida estándar, normalmente la pantalla.

* Utilizamos el operador de inserción `<<` para enviar datos a la salida.
* Podemos combinar varios datos en la misma instrucción.
* El manipulador `std::endl` finaliza la línea, igual que `\n`, y además **fuerza el vaciado del búfer de salida**.

## Entrada por teclado: `std::cin`

El objeto `std::cin` representa la entrada estándar, normalmente el teclado.

* Utilizamos el operador de extracción `>>` para leer datos y almacenarlos en variables.
* El operador `>>` realiza automáticamente la conversión al tipo de la variable, siempre que sea posible.
* Si el usuario introduce un valor que no corresponde al tipo de la variable , se producirá un **error de entrada** y la variable no se modificará.

## Lectura de cadenas de caracteres

Cuando queremos leer una cadena de texto que pueda contener espacios, no podemos utilizar `std::cin >>`, ya que este operador **solo lee hasta el primer espacio**. Si el usuario introduce `"Pepe García"`, solo se guardará `"Pepe"`.

La solución es usar la función `std::getline` que permite leer toda la línea, incluidos los espacios. 

Cuando se combinan ambas formas de entrada, puede ocurrir que quede un carácter de salto de línea `'\n'` pendiente en el búfer de entrada, lo que provoca que `std::getline` lea una línea vacía.

Para evitar este problema, podemos utilizar `std::cin.ignore()` antes de llamar a `std::getline`, que limpia el buffer de entrada. Ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    int edad {};
    std::string nombre {};

    std::cout << "Introduce tu edad: ";
    std::cin >> edad;

    std::cin.ignore();  // Limpiar búfer

    std::cout << "Introduce tu nombre completo: ";
    std::getline(std::cin, nombre);

    std::cout << nombre << " tiene " << edad << " años." << std::endl;

    return 0;
}
```
