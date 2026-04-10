---
title: "Gestión de memoria con punteros inteligentes"
---

En C++, la gestión segura y eficiente de memoria dinámica es un aspecto crítico del desarrollo robusto. Tras comprender los conceptos de RAII y propiedad, resulta natural introducir los **punteros inteligentes**, que son herramientas diseñadas para aplicar estos principios a la gestión de memoria.

## ¿Qué son los punteros inteligentes?

Un puntero inteligente es una clase plantilla de la biblioteca estándar (`<memory>`) que encapsula un puntero crudo y gestiona automáticamente la vida útil del objeto al que apunta, aplicando RAII.

Al usarlos:

* La memoria se adquiere al crear el puntero.
* La memoria se libera automáticamente al destruirse el puntero, sin necesidad de `delete`.
* La propiedad del recurso es explícita, reduciendo fugas de memoria y accesos inválidos.

Los más utilizados en C++ moderno son `std::unique_ptr`, `std::shared_ptr` y `std::weak_ptr`.


## `std::unique_ptr`

Representa **propiedad exclusiva**. Solo un `unique_ptr` puede poseer un recurso.

* No se puede copiar, solo **mover** con `std::move`.
* Libera el recurso automáticamente al destruirse.
* Ideal para recursos que no deben compartirse.

```cpp
#include <memory>
#include <iostream>

int main() {
    // Creación segura con make_unique
    std::unique_ptr<int> ptr = std::make_unique<int>(42);
    std::cout << *ptr << "\n";

    // Transferencia de propiedad
    std::unique_ptr<int> ptr2 = std::move(ptr);

    if (!ptr) {
        std::cout << "ptr ya no posee el recurso.\n";
    }

    return 0; // ptr2 libera automáticamente la memoria
}
```

`std::make_unique` es la forma recomendada de crear `unique_ptr`:

* Evita errores en expresiones complejas.
* Hace el código más claro y seguro.
* Introducido en C++14.


## `std::shared_ptr`

Representa **propiedad compartida** mediante conteo de referencias.

* Varias copias comparten el mismo recurso.
* El recurso se libera cuando el contador de referencias llega a cero.
* Útil en grafos, estructuras compartidas o cachés.
* Creamos punteros de este tipo con `std::make_shared`.

```cpp
#include <memory>
#include <iostream>

int main() {
    std::shared_ptr<int> sp1 = std::make_shared<int>(100);

    {
        std::shared_ptr<int> sp2 = sp1; // Copia: ambos comparten propiedad
        std::cout << "Valor: " << *sp2 << "\n";
        std::cout << "Conteo: " << sp1.use_count() << "\n";
    } // sp2 se destruye: el conteo baja

    std::cout << "Conteo tras salir del bloque: " << sp1.use_count() << "\n";

    return 0; // El recurso se libera cuando desaparece el último shared_ptr
}
```

### Ciclos de referencias

Un problema común con `shared_ptr` son los **ciclos de referencias**:

* Ocurren cuando dos (o más) objetos se apuntan entre sí mediante `shared_ptr`.
* Ninguno de los contadores llega a cero, por lo que el recurso **nunca se libera**: fuga de memoria.

Ejemplo de ciclo:

```cpp
struct Nodo {
    std::shared_ptr<Nodo> siguiente;
};
```

Si `nodo1.siguiente = nodo2` y `nodo2.siguiente = nodo1`, ambos quedan bloqueados en memoria.


## `std::weak_ptr`

Es un puntero **observador sin propiedad**.

* No incrementa el contador de referencias.
* Se usa junto a `shared_ptr` para **romper ciclos de referencias**.
* Permite comprobar si el recurso aún existe mediante `.lock()`.

```cpp
#include <memory>
#include <iostream>

int main() {
    std::shared_ptr<int> sp = std::make_shared<int>(200);
    std::weak_ptr<int> wp = sp; // Observador

    if (auto spt = wp.lock()) { // Convierte temporalmente a shared_ptr
        std::cout << *spt << "\n";
    } else {
        std::cout << "El recurso ya fue liberado.\n";
    }

    return 0;
}
```

Como `std::weak_ptr` **no es dueño** del recurso, no puede acceder directamente a él. Antes debe comprobar si el recurso sigue existiendo.

`lock()` sirve para eso:

* **Comprueba** si el `shared_ptr` asociado aún tiene propiedad del recurso (es decir, su contador de referencias es > 0).
* **Si existe**, crea y devuelve un **`std::shared_ptr` temporal**, aumentando el contador de referencias mientras se usa.
* **Si ya no existe**, devuelve un `std::shared_ptr` vacío (equivalente a `nullptr`).
