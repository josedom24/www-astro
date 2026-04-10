---
title: "Declaración e inicialización de constantes"
---

Las **constantes** representan valores que no deben modificarse durante la ejecución de un programa. El uso correcto de constantes mejora la legibilidad, seguridad y mantenimiento del código, además de permitir al compilador realizar optimizaciones adicionales.

C++ moderno proporciona diversas formas para declarar y trabajar con constantes, que se describen a continuación:

## Constantes con `const`

La palabra clave `const` indica que el valor de una variable no puede modificarse después de su inicialización. Ejemplo:

```cpp
const int edad {25};
const double pi {3.14159};
const char inicial {'A'};
const bool esValido {true};
```

* Las variables declaradas como `const` deben ser inicializadas en el momento de su declaración.
* Intentar modificar su valor generará un error de compilación.

Ejemplo completo:

```cpp
#include <iostream>
using namespace std;

int main() {
    // ----- Declaración de constantes -----
    const int edad {25};               // Entero constante
    const double pi {3.14159};         // Número real constante
    const char inicial {'A'};          // Carácter constante
    const bool esValido {true};        // Booleano constante

    // Mostramos los valores
    cout << "Edad: " << edad << endl;
    cout << "Pi: " << pi << endl;
    cout << "Inicial: " << inicial << endl;
    cout << "Es válido: " << esValido << endl;

    // Intentar modificar una constante provoca error de compilación
    // edad = 30; // Esto NO está permitido

    return 0;
}
```

## Constantes con `constexpr`

La palabra clave `constexpr` indica que el valor de la variable es **una constante en tiempo de compilación**. Es una extensión más estricta y potente que `const`. Ejemplos:

Veamos un ejemplo:

```cpp
constexpr int tamaño {10};
constexpr double radio {2.5};
constexpr char letra {'B'};
```

* El valor debe poder evaluarse en tiempo de compilación.
* Es preferible a `const` cuando se necesita que la constante sea conocida en tiempo de compilación, por ejemplo, para tamaños de arrays o plantillas.

Ejemplo completo:

```cpp
#include <iostream>
using namespace std;

int main() {
    // ----- Declaración de constantes en tiempo de compilación -----
    constexpr int tamaño {10};      // Entero constante conocido en tiempo de compilación
    constexpr double radio {2.5};   // Número real constante en tiempo de compilación
    constexpr char letra {'B'};     // Carácter constante en tiempo de compilación

    // Uso de la constante para declarar un array
    int array[tamaño];               // Tamaño conocido en tiempo de compilación

    // Mostramos los valores
    cout << "Tamaño del array: " << tamaño << endl;
    cout << "Radio: " << radio << endl;
    cout << "Letra: " << letra << endl;

    return 0;
}
```

## Directiva del preprocesador `#define`

En versiones más antiguas de C++ se solía usar una directiva de preprocesador llamada `#define`, que nos permite hacer sustituciones de texto a valores, es decir poner alias a ciertos valores. No son variables reales, por ejemplo:

```cpp
#define PI 3.14159
```

Esta forma de trabajar con constantes está desaconsejada en C++ moderno.

