---
title: "Estructuras alternativas: if"
---

En muchos programas es necesario tomar decisiones durante la ejecución, es decir, ejecutar o no ciertas instrucciones en función de si se cumple una determinada condición. Para ello, en C++ disponemos de las **estructuras alternativas**, entre las que destaca la instrucción `if`.

## Alternativa simple: `if`

La sintaxis básica es la siguiente:

```cpp
if (condición) {
    // Instrucciones que se ejecutan si la condición es verdadera
}
```

* **`condición`** debe ser una expresión lógica (es decir, su resultado es de tipo `bool`).
* Si la condición se evalúa como `true`, se ejecuta el bloque de instrucciones que aparece entre llaves `{}`.
* Si la condición es `false`, el bloque de instrucciones se omite y la ejecución continúa después del `if`.


Ejemplo:

```cpp
#include <iostream>

int main() {
    int edad{};
    std::cout << "Introduce tu edad: ";
    std::cin >> edad;

    if (edad >= 18) {
        std::cout << "Eres mayor de edad." << std::endl;
    }

    std::cout << "Programa finalizado." << std::endl;
    return 0;
}
```
Es recomendable **indentar** las instrucciones dentro del bloque `{}` para mejorar la legibilidad del código.

## Alternativa doble: `if` - `else`

Cuando se desea ejecutar un bloque de instrucciones si la condición es verdadera, y otro bloque distinto si la condición es falsa, se utiliza la estructura `if - else`. Su sintaxis es:

```cpp
if (condición) {
    // Instrucciones si la condición es verdadera
} else {
    // Instrucciones si la condición es falsa
}
```

Veamos un ejemplo:

```cpp
#include <iostream>

int main() {
    int edad{};
    std::cout << "Introduce tu edad: ";
    std::cin >> edad;

    if (edad >= 18) {
        std::cout << "Eres mayor de edad." << std::endl;
    } else {
        std::cout << "Eres menor de edad." << std::endl;
    }

    std::cout << "Programa finalizado." << std::endl;
    return 0;
}
```

Es aconsejable utilizar `{}` para delimitar los bloques, incluso si solo hay una instrucción. Esto previene errores y mejora la claridad.

## Alternativa múltiple

Cuando un programa debe tomar decisiones con **más de dos opciones**, utilizamos estructuras más complejas que el simple `if` o el `if-else`. Para estos casos, C++ permite anidar instrucciones `if` o usar la construcción `else if`.

### Alternativa múltiple con `if` anidados

Los `if` anidados se refieren a colocar una instrucción `if` dentro del bloque de otro `if` o dentro de un `else`. Esto permite realizar comprobaciones secuenciales según diferentes condiciones. La sintaxis sería:


```cpp
if (condición1) {
    // Instrucciones si condición1 es verdadera

    if (condición2) {
        // Instrucciones si condición1 y condición2 son verdaderas
    }
} else {
    // Instrucciones si condición1 es falsa
}
```

Y un ejemplo:

```cpp
#include <iostream>

int main() {
    int edad{};
    std::cout << "Introduce tu edad: ";
    std::cin >> edad;

    if (edad >= 18) {
        if (edad >= 65) {
            std::cout << "Eres un adulto mayor." << std::endl;
        } else {
            std::cout << "Eres un adulto." << std::endl;
        }
    } else {
        std::cout << "Eres menor de edad." << std::endl;
    }

    return 0;
}
```

### Alternativa múltiple con `else if`

Para mejorar la legibilidad cuando se tienen múltiples opciones mutuamente excluyentes, es recomendable usar `else if`. Esta estructura evalúa condiciones secuencialmente y ejecuta solo el bloque correspondiente a la primera condición verdadera. Su sintaxis es:

```cpp
if (condición1) {
    // Instrucciones si condición1 es verdadera
} else if (condición2) {
    // Instrucciones si condición1 es falsa y condición2 es verdadera
} else if (condición3) {
    // Instrucciones si condición1 y condición2 son falsas y condición3 es verdadera
} else {
    // Instrucciones si todas las condiciones anteriores son falsas
}
```
Un ejemplo:

```cpp
#include <iostream>

int main() {
    int edad{};
    std::cout << "Introduce tu edad: ";
    std::cin >> edad;

    if (edad < 18) {
        std::cout << "Eres menor de edad." << std::endl;
    } else if (edad < 65) {
        std::cout << "Eres un adulto." << std::endl;
    } else {
        std::cout << "Eres un adulto mayor." << std::endl;
    }

    return 0;
}
```

* Es preferible usar la estructura `else if` en lugar de anidar múltiples `if` para evitar código difícil de leer.
* Hay que tener en cuenta que la evaluación de las condiciones se realiza en orden, y se ejecuta solo el primer bloque cuyo `if` o `else if` sea verdadero.

## Operador condicional ternario

Es una forma compacta de escribir una estructura `if-else`. Su sintaxis es:

```
condición ? valor_si_verdadero : valor_si_falso;
```

Se evalúa la `condición`:
* Si es **verdadera**, se devuelve `valor_si_verdadero`.
* Si es **falsa**, se devuelve `valor_si_falso`.

Ejemplo:

```cpp
#include <iostream>

int main() {
    int edad = 17;
    std::string resultado{ (edad >= 18) ? "Mayor de edad" : "Menor de edad"};
    std::cout << resultado << '\n';
    return 0;
}
```