---
title: "Inyección de comportamiento mediante composición"
---

Tradicionalmente, la orientación a objetos ha utilizado la **herencia** para variar comportamientos: cada subclase redefine un método para implementar una versión distinta.
Sin embargo, este enfoque tiende a crear **jerarquías complejas y rígidas**.

La alternativa es la **composición flexible**: una clase puede **recibir como dependencia** el comportamiento que necesita, sin crear subclases ni modificar su código.


## Ejemplo: calculadora con comportamiento inyectado

```cpp
#include <functional>
#include <iostream>

class Calculadora {
public:
    using Operacion = std::function<int(int, int)>;

    explicit Calculadora(Operacion op) : operacion_(op) {}

    int ejecutar(int a, int b) const {
        return operacion_(a, b);
    }

private:
    Operacion operacion_;
};

int main() {
    Calculadora suma([](int a, int b) { return a + b; });
    Calculadora producto([](int a, int b) { return a * b; });

    std::cout << "5 + 3 = " << suma.ejecutar(5, 3) << "\n";
    std::cout << "5 * 3 = " << producto.ejecutar(5, 3) << "\n";
}
```

* `Operacion` es un alias de `std::function<int(int,int)>`, que puede almacenar **cualquier operación binaria** sobre enteros.
* `Calculadora` recibe en su constructor el comportamiento a aplicar y lo guarda en el atributo `operacion_`.
* El método `ejecutar` **delegará la acción** en esa función inyectada.
* En `main`, se crean dos calculadoras distintas (suma y producto), usando **lambdas** como operaciones inyectadas.

Así, `Calculadora` **no necesita subclases** como `CalculadoraSuma` o `CalculadoraProducto`.
Su comportamiento se define desde fuera, en el momento de uso.

Este enfoque demuestra cómo la **composición flexible** permite variar el comportamiento de un objeto sin recurrir a la herencia, promoviendo diseños más modulares y mantenibles.