---
title: "Conversión de tipos de datos"
---

En un programa, a veces es necesario convertir el valor de una variable de un **tipo de dato** a otro. Esto se llama **conversión de tipos** o **casting**. Por ejemplo:

* Convertir un número decimal (`double`) a un número entero (`int`).
* Convertir un carácter (`char`) a su código numérico entero (`int`).
* Convertir un entero (`int`) a decimal (`double`) para que no se pierda información en una operación.

C++ permite realizar estas conversiones de forma **automática o manual**, pero es muy importante entender cómo y cuándo ocurren, para evitar errores o resultados inesperados.


## Conversión implícita (automática)

Ocurre cuando el compilador convierte un tipo a otro **de forma automática**, sin que el programador lo indique de forma explícita. Generalmente sucede cuando:

* Se combinan variables de distintos tipos en una operación.
* El compilador considera que no hay riesgo de perder información.

Ejemplo:

```cpp
#include <iostream>

int main() {
    int entero {5};
    double decimal {2.5};

    double resultado {entero + decimal};

    std::cout << resultado << std::endl;  // Imprime: 7.5
    return 0;
}
```

El compilador convierte la variable `entero` al tipo `double` automáticamente, para que la suma sea precisa.

## Conversión explícita (casting)

El programador indica de forma clara que quiere convertir un valor de un tipo a otro. Esto se hace cuando:

* Hay riesgo de perder información (por ejemplo, al convertir de decimal a entero).
* Queremos asegurarnos de que la conversión ocurre exactamente cuando y como queremos.

Para realizar la conversión explícita usamos la función `static_cast`. Veamos un ejemplo:


```cpp
#include <iostream>

int main() {
    double decimal {3.75};

    int entero {static_cast<int>(decimal)};  // Conversión explícita en inicialización uniforme

    std::cout << "Decimal: " << decimal << std::endl;
    std::cout << "Entero: " << entero << std::endl;

    entero = entero + static_cast<int>(1.0);  // Conversión explícita en asignación
    std::cout << "Entero modificado: " << entero << std::endl;
    return 0;
}
```

## Conversión entre caracteres y números

Recuerda que los caracteres se almacenan como códigos numéricos en la memoria (tabla ASCII). Ejemplo:

```cpp
#include <iostream>

int main() {
    char letra {'A'};
    int codigo {static_cast<int>(letra)};

    std::cout << "La letra es: " << letra << std::endl;
    std::cout << "Su código es: " << codigo << std::endl;
    return 0;
}
```

## Posible perdida de información

Cuando convertimos de un tipo más "grande" o preciso a uno más pequeño, podemos perder datos. Ejemplo:

```cpp
#include <iostream>

int main() {
    double decimal {9.99};
    int entero {static_cast<int>(decimal)};  // Se pierde la parte decimal

    std::cout << entero << std::endl;  // Imprime: 9
    return 0;
}
```
