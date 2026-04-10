---
title: "Plantillas de clase: `std::variant` y `std::visit`"
---

## `std::variant`

En C++17 se introdujo la plantilla de clase `std::variant`, que permite almacenar **uno de varios tipos posibles**, garantizando **seguridad de tipo en tiempo de compilación**.

Un `std::variant` puede considerarse como un **contenedor de valor alternativo**:
solo puede contener **un valor activo a la vez**, pero el tipo de ese valor puede ser **uno de los declarados en su definición**.

Por ejemplo, un `std::variant<int, std::string>` puede almacenar un `int` o una `std::string`, pero nunca ambos al mismo tiempo.

El compilador controla qué operaciones son válidas en función del tipo actualmente almacenado, lo que evita errores y elimina la necesidad de comprobaciones manuales en tiempo de ejecución.

`std::variant` es especialmente útil cuando un objeto o función debe manejar **valores de diferentes tipos** de manera flexible, manteniendo **seguridad, eficiencia y expresividad** en el código.


```cpp
#include <iostream>
#include <variant>

int main() {
    // Un std::variant que puede contener un int o un float
    std::variant<int, float> valor;

    valor = 10;      // Contiene un int
    std::cout << "Valor entero: " << std::get<int>(valor) << '\n';

    valor = 3.14f;   // Ahora contiene un float
    std::cout << "Valor flotante: " << std::get<float>(valor) << '\n';

    return 0;
}
```

* En este ejemplo, `valor` puede guardar un `int` o un `float`, pero nunca ambos a la vez. 
* El tipo activo se rastrea automáticamente en tiempo de compilación.
* `std::get<int>(variant)` devuelve el valor almacenado en el std::variant si el tipo activo es int, lanzando una excepción si no coincide.

## `std::visit`

Cuando un `std::variant` puede contener distintos tipos, necesitamos una forma **segura y unificada de acceder al valor almacenado**, sin importar cuál sea su tipo actual. `std::visit` recibe una función (o un objeto función) y un `std::variant` y ejecuta automáticamente esa función sobre el valor actual del variant, llamando a la versión que corresponde al tipo real que contiene en ese momento.

```cpp
#include <iostream>
#include <variant>
#include <string>

int main() {
    // std::variant puede contener un valor de cualquiera de los tipos listados
    std::variant<int, std::string> dato;

    // Asignamos inicialmente una cadena
    dato = "Hola mundo";

    // Primer uso de std::visit:
    //    std::visit aplica una función (lambda, en este caso)
    //    al valor actualmente almacenado en el variant
    std::visit([](auto&& valor) {
        std::cout << "Valor inicial: " << valor << '\n';
    }, dato);

    // Ahora cambiamos el contenido del variant a un entero
    dato = 42;

    // Segundo uso de std::visit:
    //    Se vuelve a ejecutar la misma función sobre el nuevo valor
    std::visit([](auto&& valor) {
        std::cout << "Nuevo valor: " << valor << '\n';
    }, dato);

    // Podemos comprobar qué tipo contiene actualmente el variant
    if (std::holds_alternative<int>(dato)) {
        std::cout << "El variant contiene un entero.\n";
    } else if (std::holds_alternative<std::string>(dato)) {
        std::cout << "El variant contiene una cadena.\n";
    }

    // Acceder directamente al valor si sabemos su tipo
    std::cout << "Acceso directo al entero: " << std::get<int>(dato) << '\n';

    return 0;
}
```

* **`std::variant<int, std::string>`**: Define un tipo que puede contener **un entero o una cadena** (solo uno a la vez).
* **`std::visit()`**:  Aplica una función a lo que haya dentro del `variant`, sin importar el tipo actual.
* La lambda genérica `[](auto&& valor)` se adapta automáticamente al tipo real del valor: `auto` deduce el tipo, y `&&` permite recibir el valor sin copiarlo (igual que en el movimiento).
* **`std::holds_alternative<T>(v)`**: Permite comprobar si el `variant` contiene un valor de tipo `T`.
* **`std::get<T>(v)`**: Devuelve el valor si el tipo actual es `T`, o lanza una excepción `std::bad_variant_access` si no coincide.


## Ejemplo completo: procesar distintos tipos de eventos

Supongamos una aplicación que puede recibir varios **eventos**: un número de control (`int`), un mensaje (`std::string`) o una lectura de sensor (`double`). Queremos procesar cada tipo de manera diferente.

```cpp
#include <iostream>
#include <variant>
#include <string>
#include <vector>

// Tipo variante que puede contener uno de varios tipos
using Evento = std::variant<int, std::string, double>;

// Visitor con sobrecarga de funciones
class ProcesadorEvento {
public:
    void operator()(int codigo) const {
        std::cout << "Código de control recibido: " << codigo << '\n';
    }

    void operator()(const std::string& mensaje) const {
        std::cout << "Mensaje recibido: \"" << mensaje << "\"\n";
    }

    void operator()(double lectura) const {
        std::cout << "Lectura de sensor: " << lectura << " unidades\n";
    }
};

int main() {
    std::vector<Evento> eventos = {
        42,
        std::string("Arranque del sistema"),
        23.7,
        std::string("Advertencia: temperatura alta"),
        0,
        18.2
    };

    // Procesar cada evento según su tipo
    for (const auto& evento : eventos) {
        std::visit(ProcesadorEvento{}, evento);
    }

    return 0;
}
```

* `std::variant<int, std::string, double>` define un tipo que puede contener **uno solo de esos tres tipos** a la vez.
* `ProcesadorEvento` es una clase *visitor* que **sobrecarga `operator()`** para cada tipo posible.
* `std::visit(ProcesadorEvento{}, evento)` llama automáticamente a la versión correcta del método según el tipo almacenado.
* Así, se evita el uso de *casts* o comprobaciones manuales de tipo.
* Si todos los tipos pudieran procesarse de la misma forma, se podría usar directamente una **lambda genérica**, pero cuando el comportamiento depende del tipo concreto, un *visitor* con sobrecargas es más claro y seguro.

