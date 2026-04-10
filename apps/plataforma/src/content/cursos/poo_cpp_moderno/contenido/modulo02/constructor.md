---
title: "Constructores y destructores"
---

En C++, la creación, uso y destrucción de objetos se gestionan mediante **constructores** y **destructores**.

## Constructores

Un **constructor** es una función especial cuyo nombre coincide con el de la clase y que no tiene tipo de retorno. Se ejecuta automáticamente al crear un objeto.

Tipos:

* **Constructor por defecto:** no recibe argumentos.
* **Constructor parametrizado:** recibe valores para inicializar atributos.
* **Constructor delegante:** llama a otro constructor de la misma clase (se verá más adelante).
* **Constructores especiales:** como el de copia y el de movimiento (se estudiarán más adelante).

Aunque lo estudiaremos en profundidad en el siguiente apartado, hay que indicar que en C++ moderno, se recomienda usar **listas de inicialización uniforme (`{}`)** para inicializar los atributos:

```cpp
#include <iostream>

class Punto {
private:
    int x;
    int y;

public:
    // Constructor por defecto con lista de inicialización
    Punto() : x{0}, y{0} {}

    // Constructor parametrizado con lista de inicialización
    Punto(int valorX, int valorY) : x{valorX}, y{valorY} {}

    // Método constante para mostrar el estado del objeto
    void mostrar() const {
        std::cout << "Punto(" << x << ", " << y << ")\n";
    }
};

int main() {
    Punto p1;            // Se usa el constructor por defecto
    Punto p2{3, 4};      // Se usa el constructor parametrizado

    p1.mostrar();        // Punto(0, 0)
    p2.mostrar();        // Punto(3, 4)

    return 0;
}
```

Este programa demuestra que:

* El **constructor por defecto** inicializa `x` e `y` en `0`.
* El **constructor parametrizado** usa la lista de inicialización para asignar directamente los valores recibidos.
* El método `mostrar()` es **const** porque no modifica el estado del objeto.


## Destructor

Un **destructor** es una función especial que se ejecuta automáticamente cuando un objeto:

* sale de su ámbito,
* se elimina con `delete`,
* o es destruido dentro de un contenedor de la STL, por ejemplo, en un vector (`std::vector`).

Su sintaxis es: `~NombreDeClase();`

Ejemplo:

```cpp
#include <iostream>

class Ejemplo {
private:
    std::string nombre;

public:
    // Constructor: se ejecuta al crear el objeto
    Ejemplo(const std::string& n) : nombre{n} {
        std::cout << "Constructor: " << nombre << " creado.\n";
    }

    // Destructor: se ejecuta automáticamente al destruir el objeto
    ~Ejemplo() {
        std::cout << "Destructor: " << nombre << " destruido.\n";
    }
};

int main() {
    std::cout << "Inicio del programa.\n";

    Ejemplo a("Objeto A"); // Se construye automáticamente
    {
        Ejemplo b("Objeto B"); // Se construye dentro de un bloque
        std::cout << "Dentro del bloque.\n";
    } // b sale de ámbito: se invoca su destructor aquí

    std::cout << "Fin del programa.\n";
    return 0; // Al finalizar main, se destruye 'a'
}
```

* El **constructor** se llama cuando se crea el objeto (`Ejemplo a("Objeto A");`).
* El **destructor (`~Ejemplo`)** se ejecuta automáticamente cuando el objeto sale de su ámbito.
* El orden de destrucción es **inverso al de creación**: el último objeto creado es el primero en destruirse.
* No es necesario invocar el destructor manualmente; el compilador lo hace por ti.
* Si no se define, el compilador genera uno por defecto. 


## Uso de `=default` y `=delete`

En C++ moderno, el programador puede indicar al compilador si ciertas **funciones especiales** (como constructores, destructores u operadores) deben **generarse automáticamente** o **prohibirse explícitamente**.

Estas dos expresiones permiten **controlar el comportamiento por defecto** de las clases:

* `=default`: solicita que el compilador genere automáticamente la función.
* `=delete`: prohíbe que esa función se use.

Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

class Archivo {
private:
    std::string nombre;

public:
    // Constructor por defecto: generado automáticamente
    Archivo() = default;

    // Constructor con parámetro
    Archivo(const std::string& n) : nombre{n} {}

    // Destructor automático
    ~Archivo() = default;

    // Método para mostrar información
    void mostrar() const {
        std::cout << "Archivo: " << nombre << '\n';
    }

    // Ejemplo: prohibimos la creación de objetos con un número
    Archivo(int) = delete;
};

int main() {
    Archivo a1("datos.txt"); // OK
    a1.mostrar();

    Archivo a2;              // OK: usa el constructor por defecto
    // Archivo a3(42);       // Error: constructor eliminado (=delete)

    return 0;
}
```

* `=default` le indica al compilador que genere **automáticamente** el constructor por defecto y el destructor.
* `=delete` impide que se utilice una función concreta (en este caso, el constructor que recibe un número).
* Si el programador intenta usar una función eliminada, el compilador emitirá un **error en tiempo de compilación**.

