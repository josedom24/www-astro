---
title: "Estructuras repetitivas: while"
---

La instrucción `while` permite ejecutar repetidamente un bloque de instrucciones **mientras** se cumpla una determinada condición lógica. La sintaxis general es:

```cpp
while (condición) {
    // Instrucciones del cuerpo del bucle
}
```

* Antes de cada iteración, se evalúa la condición.
* Si la condición es **verdadera**, se ejecutan las instrucciones del cuerpo del bucle.
* Al finalizar las instrucciones, se vuelve a evaluar la condición.
* El proceso se repite hasta que la condición resulte **falsa**.
* Si la condición es falsa en la primera evaluación, las instrucciones del bucle no se ejecutan en ningún momento.
* Para evitar bucles infinitos, es fundamental que dentro del cuerpo del bucle exista alguna instrucción que modifique las variables implicadas en la condición, de modo que en algún momento esta pueda ser falsa.

Veamos un ejemplo. Este programa solicita al usuario que introduzca una contraseña. El bucle se repite mientras la contraseña no sea correcta.

```cpp
#include <iostream>
#include <string>

int main() {
    const std::string clave_correcta{"asdasd"};
    std::string clave{};

    std::cout << "Introduce la clave: ";
    std::getline(std::cin, clave);

    while (clave != clave_correcta) {
        std::cout << "Clave incorrecta.\n";
        std::cout << "Introduce la clave: ";
        std::getline(std::cin, clave);
    }
    std::cout << "Bienvenido.\n";
    return 0;
}
```

## Instrucciones `break` y `continue`

Las instrucciones `break` y `continue` alteran el flujo normal de los bucles. Son válidas en los bucles `while`, `for` y `do-while`.


### Instrucción `break`

Finaliza de forma inmediata la ejecución del bucle, incluso si la condición todavía es verdadera. Ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    const std::string clave_correcta{"asdasd"};
    std::string clave{};
    char opcion{};

    std::cout << "Introduce la clave: ";
    std::getline(std::cin, clave);

    while (clave != clave_correcta) {
        std::cout << "Clave incorrecta.\n";
        std::cout << "¿Deseas intentar de nuevo? (S/N): ";
        std::cin >> opcion;
        std::cin.ignore();  // Limpiar el salto de línea pendiente

        if (std::toupper(opcion) == 'N') {
            break;
        }

        std::cout << "Introduce la clave: ";
        std::getline(std::cin, clave);
    }

    if (clave == clave_correcta) {
        std::cout << "Bienvenido.\n";
    }

    std::cout << "Programa terminado.\n";
    return 0;
}
```

Hemos usado la función `std::toupper()` que nos permite convertir un carácter a mayúsculas.

### Instrucción `continue`

Interrumpe la iteración actual del bucle y salta directamente a la siguiente evaluación de la condición, sin ejecutar las instrucciones restantes del cuerpo del bucle.

Vemos un ejemplo que muestra los números pares del 1 al 10:

```cpp
#include <iostream>

int main() {
    int contador{0};

    while (contador < 10) {
        contador++;

        if (contador % 2 != 0) {
            continue;  // Saltamos los números impares
        }

        std::cout << contador << " ";
    }

    std::cout << "\n";
    return 0;
}
```
