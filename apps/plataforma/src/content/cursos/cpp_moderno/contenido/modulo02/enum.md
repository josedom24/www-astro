---
title: "Tipos definidos por el usuario: `enum class`"
---

En programación, a menudo necesitamos representar un conjunto de valores posibles claramente definidos y finitos. Por ejemplo, los días de la semana, los colores de un semáforo, o el estado de una tarea.

Para ello usamos los **tipos enumerados** (`enum`):

* En C++ clásico, se utiliza el tipo `enum`. El uso de este tipo enumerado tiene limitaciones que pueden generar errores. 
* En **C++ moderno**, se prefiere el uso de **`enum class`**, que soluciona esos problemas.

## `enum class`: Enumeraciones fuertemente tipadas

`enum class` (enumeration class) es un tipo definido por el programador que representa un conjunto finito de valores simbólicos, llamados **enumeradores**. Estos valores se agrupan bajo un mismo nombre de tipo y están fuertemente tipados.

Ejemplo:

```cpp
enum class Color { Rojo, Verde, Azul };
Color miColor = Color::Rojo;
```

Sus características principales son:

* **Es un tipo propio**: Un `enum class` define un tipo independiente, es decir, definido por el usuario.
* **Nombres de los enumeradores cualificados**: Los valores del `enum class` se acceden a través del nombre del tipo, lo que evita ambigüedad. Ejemplo: `Color::Rojo`.
* **Seguridad de tipo (type safety)**: Un valor de `enum class` no puede convertirse implícitamente a otro tipo como `int` o `float`. Esto evita errores al mezclar enumeraciones con otros tipos numéricos.
* **Se puede especificar el tipo base**: Es posible indicar explícitamente el tipo subyacente (como `int`, `char`, `unsigned`, etc.), lo que permite controlar el tamaño en memoria.

## Ejemplo

```cpp
#include <iostream>

enum class Color {
    Rojo,
    Verde,
    Azul
};

int main() {
    Color c {Color::Verde};

    if (c == Color::Verde) {
        std::cout << "El color es verde\n";
    }
    return 0;
}
```

En este ejemplo:

* `Color` es un tipo definido por el usuario.
* Sus posibles valores son `Color::Rojo`, `Color::Verde` y `Color::Azul`.
* El uso de `Color::` es obligatorio para acceder a los enumeradores.

## Conversión de tipo

Por defecto, cada valor que definimos en un `enum class` se relaciona con un entero, siendo el primer elemento el valor 0, el segundo el 1, y así sucesivamente.

En la declaración de la enumeración podemos establecer el valor entero de cada uno de los valores que definimos.

Aunque `enum class` no se convierte automáticamente a `int`, a veces es útil obtener su valor numérico:

```cpp
#include <iostream>

enum class Estado { Inactivo = 1, Activo = 2, Suspendido = 3 };

int main() {
    Estado e {Estado::Activo};

    std::cout << "Valor numérico: " << static_cast<int>(e) << std::endl;

    return 0;
}
```

Utilizamos la función `static_cast<int>` para realizar la conversión a entero.

Si partimos de un entero también podemos hacer la conversión a `enum class`:

```cpp
#include <iostream>

enum class Estado { Inactivo = 1, Activo = 2, Suspendido = 3 };

int main() {
    // Pedir un valor numérico al usuario
    int valor;
    std::cout << "Ingresa un valor (1: Inactivo, 2: Activo, 3: Suspendido): ";
    std::cin >> valor;

    // Verificar si el valor ingresado es válido
    if (valor >= 1 && valor <= 3) {
        // Convertir el valor numérico al tipo enum class usando static_cast
        Estado e {static_cast<Estado>(valor)};

        // Imprimir el valor numérico del enum
        std::cout << "El valor numérico del estado es: " << static_cast<int>(e) << std::endl;
    } else {
        std::cout << "Valor no válido." << std::endl;
    }

    return 0;
}
```

Si ponemos sólo el valor inicial, el resto de los elementos irán cogiendo el valor consecutivo. Ejemplo:

```cpp
enum class Estado { Inactivo = 1, Activo, Suspendido };
``` 

## Definir el tipo subyacente

Por defecto, el tipo subyacente es `int`, pero se puede especificar otro tipo:

```cpp
enum class Estado : unsigned char { Inactivo = 1, Activo = 2, Suspendido = 3 };
```

Esto puede ser útil para ahorrar memoria o por requisitos específicos.

## Ejemplo final

Define un `enum class` llamado `DiaSemana` con los valores `Lunes`, `Martes`, `Miércoles`, `Jueves`, `Viernes`, `Sábado`, `Domingo`. Escribe un programa que:

* Pida al usuario un número entre 1 y 7.
* Muestre el día correspondiente usando `enum class`.

```cpp
#include <iostream>

int main() {
    enum class DiaSemana { 
        Lunes = 1, 
        Martes, 
        Miercoles, 
        Jueves, 
        Viernes, 
        Sabado, 
        Domingo 
    };

    int numero;
    std::cout << "Introduce un número del 1 al 7 para indicar el día de la semana: ";
    std::cin >> numero;

    if (numero < 1 || numero > 7) {
        std::cout << "Número inválido." << std::endl;
        return 1;
    }

    DiaSemana dia { static_cast<DiaSemana>(numero) };

    std::cout << "El día seleccionado es: ";
    switch (dia) {
        case DiaSemana::Lunes: std::cout << "Lunes"; break;
        case DiaSemana::Martes: std::cout << "Martes"; break;
        case DiaSemana::Miercoles: std::cout << "Miércoles"; break;
        case DiaSemana::Jueves: std::cout << "Jueves"; break;
        case DiaSemana::Viernes: std::cout << "Viernes"; break;
        case DiaSemana::Sabado: std::cout << "Sábado"; break;
        case DiaSemana::Domingo: std::cout << "Domingo"; break;
    }
    std::cout << std::endl;

    return 0;
}

```