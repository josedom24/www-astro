---
title: "Delegación de comportamiento mediante interfaces"
---

Una de las formas más clásicas y efectivas de conseguir **comportamiento intercambiable** en la programación orientada a objetos es la **delegación mediante interfaces**.
En este enfoque, una clase **no implementa directamente** un comportamiento, sino que **lo delega a otro objeto** que cumple una **interfaz abstracta**.

Gracias a este principio, es posible **sustituir libremente las implementaciones concretas** sin modificar el código cliente, logrando un sistema **más flexible, extensible y fácilmente comprobable**.

Este concepto se fundamenta en uno de los pilares del diseño orientado a objetos: **“Programa contra interfaces, no contra implementaciones.”**

## Ejemplo completo: delegación de comportamiento

En el siguiente ejemplo, un objeto `Ordenador` delega la tarea de ordenar datos a una estrategia que implementa una interfaz común.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>

// ---------------------------------------------------------
// Interfaz abstracta: define el contrato del comportamiento
// ---------------------------------------------------------
class EstrategiaOrdenamiento {
public:
    // Método virtual puro: cada clase derivada define su propio algoritmo
    virtual void ordenar(std::vector<int>& datos) = 0;

    // Destructor virtual para garantizar destrucción correcta
    virtual ~EstrategiaOrdenamiento() = default;
};

// ---------------------------------------------------------
// Clase que delega el comportamiento de ordenación
// ---------------------------------------------------------
class Ordenador {
private:
    std::unique_ptr<EstrategiaOrdenamiento> estrategia_; // Comportamiento inyectado

public:
    // Constructor: recibe la estrategia a utilizar
    explicit Ordenador(std::unique_ptr<EstrategiaOrdenamiento> estrategia)
        : estrategia_(std::move(estrategia)) {}

    // Método público que delega la tarea
    void ordenar(std::vector<int>& datos) {
        estrategia_->ordenar(datos); // Llamada polimórfica
    }
};

// ---------------------------------------------------------
// Implementaciones concretas de la interfaz
// ---------------------------------------------------------

// Estrategia 1: ordenamiento burbuja (ineficiente, pero ilustrativo)
class OrdenamientoBurbuja : public EstrategiaOrdenamiento {
public:
    void ordenar(std::vector<int>& datos) override {
        for (size_t i = 0; i < datos.size(); ++i) {
            for (size_t j = 0; j < datos.size() - 1; ++j) {
                if (datos[j] > datos[j + 1]) {
                    std::swap(datos[j], datos[j + 1]);
                }
            }
        }
        std::cout << "Ordenado con burbuja\n";
    }
};

// Estrategia 2: uso de std::sort (más eficiente)
class OrdenamientoRapido : public EstrategiaOrdenamiento {
public:
    void ordenar(std::vector<int>& datos) override {
        std::sort(datos.begin(), datos.end());
        std::cout << "Ordenado con std::sort\n";
    }
};

// ---------------------------------------------------------
// Programa principal: selección de comportamiento
// ---------------------------------------------------------
int main() {
    std::vector<int> datos = {5, 2, 8, 1, 4};

    // Primer ordenador usa la estrategia de burbuja
    Ordenador ordenador1(std::make_unique<OrdenamientoBurbuja>());
    ordenador1.ordenar(datos);

    std::cout << "Resultado: ";
    for (int n : datos)
        std::cout << n << " ";
    std::cout << "\n\n";

    // Segundo ordenador usa la estrategia rápida
    std::vector<int> otrosDatos = {9, 3, 7, 1, 6};
    Ordenador ordenador2(std::make_unique<OrdenamientoRapido>());
    ordenador2.ordenar(otrosDatos);

    std::cout << "Resultado: ";
    for (int n : otrosDatos)
        std::cout << n << " ";
    std::cout << "\n";

    return 0;
}
```

* **`EstrategiaOrdenamiento`** define una **interfaz pura** con un único método virtual puro `ordenar()`. No implementa el algoritmo, solo especifica el contrato.
* **`Ordenador`** no contiene lógica de ordenación. Recibe la estrategia en su constructor y delega la tarea llamando a `estrategia_->ordenar(datos)`.
* La palabra clave `explicit` evita que el compilador realice **conversiones implícitas no deseadas** desde un `std::unique_ptr` hacia `Ordenador`, garantizando que el objeto se construya **solo de forma intencionada y explícita**.
* **`OrdenamientoBurbuja`** y **`OrdenamientoRapido`** implementan la interfaz de forma distinta. Ambas clases pueden usarse indistintamente en `Ordenador`.
* **`std::unique_ptr`** gestiona la memoria automáticamente, garantizando la destrucción correcta de las estrategias cuando el objeto `Ordenador` deja de existir.
* En el **`main()`**, se crean dos ordenadores con comportamientos diferentes sin cambiar el código de la clase `Ordenador`.
