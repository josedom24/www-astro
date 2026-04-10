---
title: "Inicialización de objetos"
---

En C++, la creación de un objeto implica su **inicialización**, es decir, la ejecución de un **constructor** que establece su estado inicial.
Existen tres formas principales de inicializar un objeto, que difieren solo en la sintaxis pero no en el efecto.

## Inicialización tradicional con paréntesis `()`

Es la forma más común. Invoca directamente al constructor correspondiente:

```cpp
Persona p("Ana", 30);
```

Esta forma ha sido la sintaxis clásica en C++ desde sus inicios.

## Inicialización uniforme con llaves `{}`

Introducida en **C++11**, unifica la sintaxis de inicialización para todos los tipos de datos (básicos, compuestos o de clase).
Evita ambigüedades, mejora la legibilidad y previene conversiones implícitas inseguras.

```cpp
Persona p{"Ana", 30};
```

## Inicialización con el operador `=`

También es posible inicializar un objeto utilizando el operador `=`, lo que se denomina **inicialización por copia**. Aunque su aspecto recuerda a una asignación, en realidad crea el objeto y llama a su constructor.

```cpp
Persona p = Persona("Ana", 30);
```

En este caso, el compilador crea un objeto temporal `Persona("Ana", 30)` y lo usa para inicializar `p`.

## Ejemplo completo

El siguiente programa muestra las tres formas de inicialización utilizando una misma clase:

```cpp
#include <iostream>
#include <string>

class Persona {
private:
    std::string nombre;
    int edad;

public:
    Persona(const std::string& n, int e) : nombre{n}, edad{e} {}

    void mostrar() const {
        std::cout << nombre << " (" << edad << " años)\n";
    }
};

int main() {
    Persona p1("Ana", 30);          // Inicialización tradicional
    Persona p2{"Luis", 25};         // Inicialización uniforme (recomendada)
    Persona p3 = Persona("Eva", 40); // Inicialización por copia

    p1.mostrar();
    p2.mostrar();
    p3.mostrar();

    return 0;
}
```

Las tres formas producen exactamente el mismo resultado.
La diferencia radica únicamente en la sintaxis y en cómo el compilador interpreta la construcción del objeto.


## Conversión implícita y constructores con un solo parámetro

Cuando una clase tiene un **constructor con un único parámetro**, el compilador puede utilizarlo para **convertir implícitamente** valores de otro tipo en objetos de esa clase.
Por ejemplo:

```cpp
Entero e = 5; // Conversión implícita: int → Entero
```

Aunque en algunos casos puede ser útil, estas conversiones automáticas pueden provocar errores difíciles de detectar, especialmente cuando una función espera un objeto y se le pasa un valor de otro tipo por descuido.


## Uso de `explicit`

Para evitar esas conversiones implícitas no deseadas, C++ permite marcar los constructores con la palabra clave **`explicit`**.
Esto obliga a que la conversión sea siempre **intencionada** y expresada de forma clara en el código.

```cpp
#include <iostream>

class Entero {
private:
    int valor;

public:
    // Constructor con un único parámetro
    // 'explicit' evita conversiones implícitas no deseadas
    explicit Entero(int v) : valor{v} {}

    int getValor() const { return valor; }
};

// Función que recibe un objeto Entero
void mostrar(const Entero& e) {
    std::cout << "Valor: " << e.getValor() << '\n';
}

int main() {
    Entero e1(10);  // Correcto: construcción explícita
    mostrar(e1);

    // Entero e2 = 20;     // Error: conversión implícita prohibida por 'explicit'
    // mostrar(30);        // Error: no se convierte int → Entero automáticamente

    mostrar(Entero(30));   // Correcto: conversión explícita

    return 0;
}
```

* `explicit` impide que el compilador convierta automáticamente un tipo primitivo (`int`) en un objeto de clase (`Entero`).
* Evita errores sutiles cuando se pasa un valor incorrecto a una función o se asigna de forma no intencionada.
* Para crear el objeto debe hacerse de forma **explícita**, por ejemplo con `Entero(30)` o `Entero e(30);`.

