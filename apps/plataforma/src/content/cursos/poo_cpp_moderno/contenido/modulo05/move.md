---
title: "Movimiento de objetos"
---

En C++ clásico, copiar un objeto complejo —por ejemplo, un `std::vector` con miles de elementos— podía ser una operación costosa, ya que implicaba duplicar toda su memoria interna.
Para optimizar este proceso, a partir de **C++11** el lenguaje incorporó el **movimiento de objetos**, que permite **transferir recursos** de un objeto a otro en lugar de copiarlos.

El movimiento hace posible escribir programas más eficientes, especialmente cuando se trabaja con **objetos temporales** o con **estructuras grandes** que no es necesario duplicar.

## Valores *lvalue* y *rvalue*

Para comprender cómo funciona el movimiento, es necesario distinguir dos categorías fundamentales de expresiones en C++:

* **lvalue (left value):** Son expresiones que hacen referencia a una ubicación identificable en memoria, es decir, tienen nombre y pueden aparecer en el lado izquierdo de una asignación. Se puede obtener su dirección con el operador `&`.

  ```cpp
  int x = 42;    // x es un lvalue
  int* p = &x;   // se puede tomar la dirección de x
  ```

* **rvalue (right value):** Son valores temporales que no tienen nombre ni dirección persistente. No se les puede tomar la dirección (en general) y se usan normalmente en el lado derecho de una asignación.

  ```cpp
  int y = x + 1; // x + 1 es un rvalue
  ```

Con la llegada de C++11, se introdujo una nueva categoría de referencias: las **referencias a rvalue** (`T&&`), que permiten capturar estos valores temporales y **aprovecharlos para mover recursos** en lugar de copiarlos.

## Cómo actúa `std::move()`

La función `std::move()` es la herramienta que **habilita la semántica de movimiento** en C++.
Su comportamiento puede resumirse así:

* **No mueve nada por sí misma.**
* **Convierte un lvalue en un rvalue**, indicando al compilador que los recursos de ese objeto pueden **transferirse** en lugar de copiarse.

Por ejemplo:

```cpp
#include <iostream>
#include <utility> // std::move
#include <vector>

int main() {
    std::vector<int> origen = {1, 2, 3, 4, 5};
    std::vector<int> destino = std::move(origen);  // Se transfiere el contenido

    std::cout << "Tamaño de origen: " << origen.size() << "\n";
    std::cout << "Tamaño de destino: " << destino.size() << "\n";
}
```

En este código:

* `std::move(origen)` convierte el objeto `origen` (un *lvalue*) en un *rvalue*, habilitando el **constructor de movimiento** de `std::vector`.
* Los recursos internos (el bloque de memoria del vector) se **transfieren** a `destino` sin copiar los elementos.
* Tras el movimiento, `origen` queda **vacío pero válido**: puede volver a asignarse o destruirse sin problemas.

El uso de `std::move()` no debe confundirse con una copia o reasignación: simplemente **cambia el contexto semántico** del objeto, indicando que ya no será utilizado en su estado actual.

## Constructor y operador de movimiento

El movimiento se implementa mediante dos mecanismos especiales del lenguaje:

* **Constructor de movimiento:** crea un nuevo objeto **transfiriendo los recursos** del objeto origen.
* **Operador de asignación por movimiento:** transfiere los recursos de un objeto existente a otro que ya estaba construido.

Ambos mecanismos se definen utilizando **referencias a rvalue (`T&&`)** y suelen declararse como `noexcept`.

Se suelen declarar los constructores y operadores de movimiento como `noexcept` porque:
* Al transferir recursos en lugar de copiarlos, normalmente **no realizan operaciones que puedan lanzar excepciones** (como asignaciones de memoria). 
* **Garantiza al compilador que el movimiento es seguro**.
* Permitiendo a los contenedores de la STL, como `std::vector` o `std::map`, **utilizarlos con confianza** al reorganizar o redimensionar sus elementos. 
* Si el movimiento no estuviera marcado como `noexcept`, estos contenedores recurrirían a la copia para mantener la seguridad ante posibles excepciones, perdiendo así las ventajas de eficiencia que ofrece el movimiento.

## Ejemplo: Movimiento con `std::unique_ptr`

En este ejemplo, la clase `BufferMovil` gestiona su recurso mediante un puntero exclusivo (`std::unique_ptr`).
El **constructor de movimiento** y el **operador de asignación por movimiento** transfieren la propiedad del recurso en lugar de copiarlo.

```cpp
#include <iostream>
#include <memory>
#include <vector>

class BufferMovil {
private:
    std::unique_ptr<std::vector<int>> datos;

public:
    // Constructor por defecto
    BufferMovil() = default;

    // Constructor con datos iniciales (crea un vector con los valores dados)
    explicit BufferMovil(const std::vector<int>& v)
        : datos(std::make_unique<std::vector<int>>(v)) {}

    // Constructor de movimiento
    BufferMovil(BufferMovil&& other) noexcept
        : datos(std::move(other.datos)) {  // std::move(other.datos) convierte el miembro en rvalue
                                           // y activa el constructor de movimiento de std::unique_ptr,
                                           // transfiriendo la propiedad del puntero.
        std::cout << "Constructor de movimiento\n";
    }

    // Operador de asignación por movimiento
    BufferMovil& operator=(BufferMovil&& other) noexcept {
        if (this != &other) {
            datos = std::move(other.datos);  // Transfiere la propiedad del puntero del objeto origen
                                             // al destino. El origen queda con un puntero nulo.
            std::cout << "Asignación por movimiento\n";
        }
        return *this;
    }

    void mostrar() const {
        if (!datos || datos->empty()) {
            std::cout << "(vacío)\n";
        } else {
            for (int v : *datos) std::cout << v << " ";
            std::cout << "\n";
        }
    }
};

int main() {
    BufferMovil b1(std::vector<int>{1, 2, 3});  // Crea un objeto con su propio recurso

    // std::move(b1) convierte b1 (un lvalue) en un rvalue,
    // habilitando el constructor de movimiento en lugar del de copia.
    BufferMovil b2 = std::move(b1);  // Se transfiere la propiedad del recurso de b1 a b2
                                     // (sin copiar el std::vector<int>).

    BufferMovil b3;                  // Objeto inicialmente vacío
    b3 = std::move(b2);              // Invoca el operador de asignación por movimiento.
                                     // Transfiere el recurso de b2 a b3; b2 queda vacío.

    std::cout << "b1: "; b1.mostrar();  // (vacío) → b1 perdió su recurso
    std::cout << "b2: "; b2.mostrar();  // (vacío) → b2 también fue movido
    std::cout << "b3: "; b3.mostrar();  // 1 2 3 → ahora b3 posee el recurso original
}

```

* `std::move(b1)` **convierte `b1` en un *rvalue***, indicando al compilador que puede tratarse como un objeto temporal cuyo contenido puede ser **movido** en lugar de copiado.
* Esta conversión **activa el constructor de movimiento** `BufferMovil(BufferMovil&& other)`, ya que el argumento es ahora un *rvalue*.
* Dentro del constructor, `std::move(other.datos)` **convierte el miembro `datos` del objeto origen en un *rvalue***, lo que **invoca el constructor de movimiento de `std::unique_ptr`**.
* El `std::unique_ptr` transfiere la propiedad del puntero interno desde `other.datos` al nuevo objeto (`this->datos`), dejando al objeto origen (`b1`) con un puntero nulo (`nullptr`).
* Este movimiento de puntero es una **transferencia de propiedad**, no una copia: no se duplica el `std::vector<int>`, solo se reasigna su posesión.
* El recurso (`std::vector<int>`) pasa a pertenecer exclusivamente a `b2`, sin que se realicen copias ni asignaciones de memoria.
* Tras el movimiento, `b1` queda **en un estado válido pero vacío**: su puntero interno es nulo, pero puede ser destruido o reutilizado sin problema.
* El uso de `noexcept` indica que este constructor **no lanzará excepciones**, lo cual permite que contenedores de la STL (como `std::vector<BufferMovil>`) puedan mover sus elementos de forma segura y eficiente.
* En el caso del operador de asignación por movimiento, la lógica es equivalente: el recurso del objeto origen se transfiere al destino, y el origen se vacía.
* Después de mover un objeto:
  * Su estado es **válido pero no especificado**: puede destruirse, reasignarse o recibir nuevos datos, pero no debe accederse a su contenido anterior.
  * **No es necesario reinicializarlo manualmente**; el movimiento garantiza que el objeto puede ser destruido de forma segura o volver a usarse más adelante.

