---
title: "Comportamiento intercambiable y bajo acoplamiento"
---

Uno de los principios fundamentales del diseño orientado a objetos es la **separación de responsabilidades**: cada clase debe encargarse de una tarea bien definida, y su implementación no debería depender directamente de los detalles de otras partes del sistema.

En este contexto surge una idea clave: diseñar **componentes con comportamiento intercambiable**, es decir, clases que puedan **modificar o delegar su comportamiento sin cambiar su estructura interna**.

Este enfoque reduce el acoplamiento, mejora la extensibilidad y facilita la reutilización del código.


## ¿Qué significa comportamiento intercambiable?

Un componente tiene **comportamiento intercambiable** cuando su lógica no depende de una única implementación, sino que **puede delegar ciertas decisiones o acciones a otro objeto o función**.

Así, el componente principal define *qué se debe hacer*, mientras que otros elementos deciden *cómo hacerlo*. Por ejemplo:

* Cuando una clase debe comportarse de manera diferente en distintos contextos.
* Cuando el algoritmo o acción puede variar según la configuración o preferencia del usuario.
* Cuando se desea probar una clase sustituyendo su comportamiento real por uno simulado (*mock*) durante las pruebas unitarias.

## El problema del acoplamiento rígido

Un diseño con **acoplamiento fuerte** ocurre cuando una clase **implementa directamente todos los detalles de su comportamiento**.
Esto la hace inflexible y difícil de extender o mantener.

Veamos un ejemplo:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

class Ordenador {
public:
    void ordenar(std::vector<int>& datos) {
        // Algoritmo de ordenación fijo (burbuja)
        for (size_t i = 0; i < datos.size(); ++i) {
            for (size_t j = 0; j < datos.size() - 1; ++j) {
                if (datos[j] > datos[j + 1]) {
                    std::swap(datos[j], datos[j + 1]);
                }
            }
        }
    }
};

int main() {
    std::vector<int> datos = {5, 2, 9, 1, 7};
    Ordenador ordenador;
    ordenador.ordenar(datos);

    for (int n : datos)
        std::cout << n << " ";
}
```
* El método `ordenar()` **está rígidamente acoplado** a un único algoritmo (burbuja).
* Si se desea usar otro algoritmo (por ejemplo, *quick sort* o *merge sort*), sería necesario **modificar la clase**.


## Hacia el diseño de comportamiento flexible

En C++ moderno existen varias formas de lograr comportamiento intercambiable:

1. **Delegación mediante interfaces abstractas:** Definir un contrato común para múltiples comportamientos (por ejemplo, diferentes estrategias de ordenación).
2. **Funciones lambda:** Permiten definir comportamientos ligeros y configurables directamente en el punto de uso.
3. **`std::function`:** Facilita almacenar y pasar comportamientos como parámetros configurables.
4. **Functores (`operator()`):** Objetos que encapsulan una acción o estrategia y pueden comportarse como funciones.
5. **Composición e inyección de comportamiento:** Permiten construir objetos que **delegan tareas específicas** a otros componentes, favoreciendo la flexibilidad.


