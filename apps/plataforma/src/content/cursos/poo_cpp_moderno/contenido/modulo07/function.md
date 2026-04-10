---
title: "Uso de `std::function` para encapsular comportamiento configurable"
---

En C++ moderno, `std::function` (definido en `<functional>`) permite **almacenar y ejecutar cualquier objeto invocable**, como funciones, lambdas, punteros a funciones o funtores.
Actúa como un **contenedor polimórfico de comportamientos**, permitiendo pasar acciones como parámetros o configurarlas dinámicamente **sin conocer su tipo exacto en tiempo de compilación**.

De esta forma, `std::function` facilita el diseño de **componentes configurables y desacoplados**, sin recurrir necesariamente a herencia o plantillas.

## ¿Qué es `std::function`?

Su sintaxis general es:

```cpp
std::function<tipo_retorno(parámetros)>
```

Por ejemplo:

```cpp
std::function<bool(int, int)> comparador;
```

Este objeto puede almacenar **cualquier invocable**, por ejemplo **funciones, lambdas o clases con `operator()`** que reciba dos `int` y devuelva un `bool`. 

## Ejemplo 1: selección dinámica de comportamiento

En este ejemplo, `std::function` permite que una función reciba **distintas operaciones** sin importar su origen.

```cpp
#include <iostream>
#include <functional>

void ejecutarOperacion(int a, int b, std::function<int(int, int)> operacion) {
    std::cout << "Resultado: " << operacion(a, b) << '\n';
}

int main() {
    auto suma = [](int x, int y) { return x + y; };
    auto resta = [](int x, int y) { return x - y; };

    ejecutarOperacion(5, 3, suma);   // Resultado: 8
    ejecutarOperacion(5, 3, resta);  // Resultado: 2
}
```

* `std::function<int(int,int)>` representa *cualquier* función que reciba dos `int` y devuelva un `int`.
* `ejecutarOperacion` no conoce las funciones concretas, solo las ejecuta.
* El comportamiento se **inyecta** dinámicamente a través del parámetro.


## Ejemplo 2: almacenamiento de comportamiento configurable

`std::function` puede usarse como miembro de una clase para definir **estrategias personalizables**.

```cpp
#include <iostream>
#include <functional>

class Procesador {
public:
    void setOperacion(std::function<int(int, int)> op) {
        operacion_ = op;
    }

    int procesar(int a, int b) const {
        return operacion_(a, b);
    }

private:
    std::function<int(int, int)> operacion_;
};

int main() {
    Procesador p;

    // Configurar la operación de multiplicar
    p.setOperacion([](int x, int y) { return x * y; });
    std::cout << "Multiplicación: " << p.procesar(4, 5) << "\n";

    // Cambiar el comportamiento dinámicamente
    p.setOperacion([](int x, int y) { return x + y; });
    std::cout << "Suma: " << p.procesar(4, 5) << "\n";
}
```

* `setOperacion()` permite cambiar el comportamiento sin modificar la clase.
* `std::function` actúa como un “espacio para guardar una acción”.
* Este enfoque combina **encapsulamiento** y **flexibilidad en tiempo de ejecución**.


## Ejemplo 3: registrar callbacks

Un **callback** es una función que se pasa como argumento para que se ejecute más adelante, normalmente **como respuesta a un evento**.
Esta técnica es la base de muchos sistemas de **programación reactiva o por eventos**.

```cpp
#include <iostream>
#include <functional>

class Boton {
private:
    std::function<void()> callback_;
public:
    void registrarAlPulsar(std::function<void()> f) {
        callback_ = f;
    }

    void pulsar() {
        if (callback_) callback_();
    }
};

int main() {
    Boton b;

    b.registrarAlPulsar([] {
        std::cout << "¡Botón pulsado!\n";
    });

    b.pulsar(); // Imprime: ¡Botón pulsado!
}
```

* `Boton` no conoce qué hará el código cuando se pulse; solo **almacena e invoca** la acción.
* El comportamiento puede cambiarse fácilmente: solo hay que registrar una lambda distinta.
* Esto implementa el principio de **desacoplar el evento de su respuesta**.

En el siguiente apartado estudiaremos cómo las **clases con `operator()`** (functores) pueden cumplir un papel similar al de las lambdas, pero ofreciendo **mayor capacidad de encapsulación y reutilización** del comportamiento.

