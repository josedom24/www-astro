---
title: "Plantilla de clase: `std::optional`"
---

En C++ clásico, la ausencia de valor se representaba con punteros nulos (`nullptr`) o valores especiales como `-1` o `""`.
Este enfoque era poco seguro y propenso a errores en tiempo de ejecución, además de poco expresivo desde el punto de vista semántico.

C++17 introduce la plantilla de clase **`std::optional<T>`**, que permite **representar de manera explícita y segura un valor que puede o no estar presente**.
Su uso mejora la claridad, la seguridad y la legibilidad del código moderno.

## Concepto básico

`std::optional<T>` encapsula un valor de tipo `T` o la ausencia de él. Cuando no contiene valor, se encuentra en el estado **vacío**, representado por la constante `std::nullopt`.
Veamos los métodos y operaciones más importantes:

```cpp
#include <iostream>
#include <optional>
#include <string>

int main() {
    // Declaración vacía de std::optional: no contiene ningún valor
    std::optional<std::string> mensaje;

    // has_value(): comprueba si el optional contiene un valor
    if (!mensaje.has_value()) {
        std::cout << "Sin valor inicial.\n";
    }

    // Asignar un valor al optional (ahora deja de estar vacío)
    mensaje = "Hola mundo";

    // operator bool(): permite comprobar el estado directamente
    //    if (mensaje) equivale a if (mensaje.has_value())
    if (mensaje) {
        std::cout << "Valor asignado: " << *mensaje << '\n';
    }

    // value(): accede al valor almacenado
    //    Si el optional está vacío, lanza std::bad_optional_access
    std::cout << "Con value(): " << mensaje.value() << '\n';

    // Declarar otro optional vacío
    std::optional<std::string> otroMensaje;
    

    // value_or(valor_defecto): devuelve el valor almacenado si existe,
    //    o un valor por defecto si el optional está vacío
    std::cout << "Valor o por defecto: " << otroMensaje.value_or("Vacío") << '\n';
    otroMensaje = "Hola C++";
    std::cout << "Valor o por defecto: " << otroMensaje.value_or("Vacío") << '\n';
    
    // reset(): elimina el valor almacenado, dejando el optional vacío
    mensaje.reset();

    // Comprobamos que ahora está vacío nuevamente
    std::cout << "Tras reset(), has_value(): "
              << std::boolalpha << mensaje.has_value() << '\n';

    return 0;
}
```

* `std::optional<string>` encapsula una cadena que puede o no estar presente.
* `has_value()` o `if (mensaje)` permiten comprobar si existe valor.
* `value()` o `*mensaje` acceden al valor almacenado.
* `value_or(valor_defecto)` devuelve un valor alternativo si el `optional` está vacío.
* `reset()`: Elimina el valor contenido, dejando el objeto vacío.

## Ejemplo completo

```cpp
#include <iostream>
#include <vector>
#include <optional>

// Busca un número en un vector y devuelve un std::optional<int>
std::optional<int> buscar(const std::vector<int>& datos, int objetivo) {
    for (int valor : datos) {
        if (valor == objetivo)
            return valor;          // Valor encontrado
    }
    return std::nullopt;           // Sin valor
}

int main() {
    std::vector<int> numeros = {3, 5, 7, 9};

    auto resultado = buscar(numeros, 5);

    if (resultado) {
        std::cout << "Encontrado: " << *resultado << '\n';
    }

    std::cout << "Valor o -1: " << resultado.value_or(-1) << '\n';

    auto resultado2 = buscar(numeros, 100);
    if (!resultado2) {
        std::cout << "No encontrado.\n";
    }

    std::cout << "Resultado2 con valor por defecto: "
              << resultado2.value_or(-1) << '\n';
}
```


