---
title: "Ejemplos típicos de plantillas de funciones"
---

Uno de los objetivos fundamentales de la programación genérica es escribir funciones reutilizables que operen con distintos tipos de datos sin necesidad de duplicar código. Para comprender cómo se aplican estos principios en la práctica, se analizan a continuación tres ejemplos clásicos: `max`, `swap` y `print`. Estos ejemplos ilustran cómo expresar comportamientos comunes de forma abstracta utilizando **plantillas de funciones**.


## Ejemplo 1: Función `max`

Determinar el mayor de dos valores que puedan compararse mediante el operador relacional `>`.


```cpp
#include <iostream>

// Función plantilla que devuelve el mayor de dos valores
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    // Ejemplo con enteros
    int x = 5, y = 10;
    auto resultado = max(x, y);  // T deducido como int
    std::cout << "El mayor entre " << x << " y " << y << " es " << resultado << std::endl;

    // Ejemplo con double
    double a = 3.14, b = 2.71;
    auto resultado2 = max(a, b); // T deducido como double
    std::cout << "El mayor entre " << a << " y " << b << " es " << resultado2 << std::endl;

    // Ejemplo con std::string
    std::string s1 = "hola", s2 = "mundo";
    auto resultado3 = max(s1, s2); // T deducido como std::string
    std::cout << "El mayor entre \"" << s1 << "\" y \"" << s2 << "\" es \"" << resultado3 << "\"" << std::endl;

    // Uso explicito de tipos 
    // La función es instancia con double
    auto resultado4 = max<double>(3, 7.5);
    std::cout << "El mayor es \"" << resultado4 << "\"" 
    return 0;
}
```

* Se declara una plantilla de función con un parámetro de tipo `T`.
* La función acepta dos argumentos del mismo tipo `T` y devuelve el mayor de ellos.
* El tipo `T` debe admitir la operación `a > b`.

## Ejemplo 2: Función `swap`

Intercambiar los valores de dos variables del mismo tipo.

```cpp
#include <iostream>
#include <string>

// Plantilla de función para intercambiar dos valores
template <typename T>
void mi_swap(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    std::cout << "Antes de swap (int): x = " << x << ", y = " << y << '\n';
    mi_swap(x, y);
    std::cout << "Después de swap (int): x = " << x << ", y = " << y << '\n';

    double a = 3.14, b = 2.71;
    std::cout << "Antes de swap (double): a = " << a << ", b = " << b << '\n';
    mi_swap(a, b);
    std::cout << "Después de swap (double): a = " << a << ", b = " << b << '\n';

    std::string s1 = "rojo", s2 = "azul";
    std::cout << "Antes de swap (string): s1 = " << s1 << ", s2 = " << s2 << '\n';
    mi_swap(s1, s2);
    std::cout << "Después de swap (string): s1 = " << s1 << ", s2 = " << s2 << '\n';

    return 0;
}
```

* Se define una función plantilla que toma dos referencias a variables del mismo tipo `T`.
* Se realiza un intercambio utilizando una variable auxiliar temporal.
* No se devuelve ningún valor; la operación se realiza por efecto de las referencias.


## Ejemplo 3: Función `print`

Imprimir un valor genérico en la salida estándar.

```cpp
#include <iostream>
#include <string>

// Función plantilla para imprimir un valor genérico
template <typename T>
void print(const T& valor) {
    std::cout << valor << '\n';
}

int main() {
    int x = 42;
    double pi = 3.14159;
    std::string mensaje = "Hola, mundo";

    std::cout << "Impresión de un int: ";
    print(x);

    std::cout << "Impresión de un double: ";
    print(pi);

    std::cout << "Impresión de un string: ";
    print(mensaje);

    return 0;
}
```
* La función recibe un valor de tipo `T` por referencia constante.
* Utiliza `std::cout` para imprimirlo seguido de un salto de línea.
* El tipo `T` debe ser compatible con la operación de salida `operator<<`.

