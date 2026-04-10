---
title: "Clonación de objetos"
---

En programación orientada a objetos, a veces es necesario duplicar un objeto existente sin modificar el original. A esta operación se la denomina **clonación**.

En C++, la clonación no es una característica incorporada del lenguaje, sino un comportamiento que debe implementarse explícitamente. Se apoya en los mecanismos de copia (constructor y operador de asignación) y, en la práctica, **suele implicar una copia profunda**, de modo que el nuevo objeto sea totalmente independiente del original.

Es importante distinguir ambos conceptos: la **copia profunda** describe la **técnica de duplicar los recursos internos** de un objeto, mientras que la **clonación** define un **mecanismo de diseño polimórfico** que permite duplicar objetos sin conocer su tipo concreto. En la práctica, toda clonación realiza una copia profunda, pero no toda copia profunda constituye una clonación.

Este comportamiento resulta especialmente relevante cuando el objeto gestiona **recursos dinámicos** (memoria, archivos, conexiones, etc.), que no pueden compartirse entre instancias sin riesgo de corrupción o duplicación del recurso.


## Clonación básica

La forma más simple de clonación consiste en definir un método `clone()` que devuelva una nueva instancia copiada del objeto actual.
En C++ moderno, se suele utilizar `std::unique_ptr` para **gestionar automáticamente la memoria** del clon.

En este ejemplo, la clase `Buffer` gestiona su recurso mediante un `std::unique_ptr<int[]>`, lo que simula la gestión manual de memoria dinámica.

```cpp
#include <iostream>
#include <memory>

class Buffer {
private:
    std::unique_ptr<int[]> datos;
    std::size_t tam;

public:
    // Constructor con tamaño e inicialización
    Buffer(std::size_t n, int valor = 0)
        : datos(std::make_unique<int[]>(n)), tam(n) {
        for (std::size_t i = 0; i < tam; ++i)
            datos[i] = valor;
    }

    // Método de clonación
    std::unique_ptr<Buffer> clone() const {
        auto nuevo = std::make_unique<Buffer>(tam);
        for (std::size_t i = 0; i < tam; ++i)
            nuevo->datos[i] = datos[i];  // Copia profunda
        return nuevo;
    }

    void modificar(std::size_t i, int valor) {
        if (i < tam) datos[i] = valor;
    }

    void mostrar() const {
        for (std::size_t i = 0; i < tam; ++i)
            std::cout << datos[i] << " ";
        std::cout << "\n";
    }
};

int main() {
    Buffer original(3, 5);       // [5, 5, 5]
    auto copia = original.clone(); // Clonación profunda

    original.modificar(1, 99);   // Solo cambia el original

    std::cout << "Original: ";
    original.mostrar();
    std::cout << "Copia:    ";
    copia->mostrar();
}
```

* El método `clone()` crea un nuevo objeto dinámico mediante `std::make_unique`.
* Se copian los datos uno a uno, de modo que el clon y el original **no comparten memoria**.
* El uso de `std::unique_ptr` garantiza una **gestión automática y segura** del recurso.

## Clonación polimórfica

En sistemas con **herencia**, puede ser necesario **clonar objetos sin conocer su tipo concreto**.
Para ello, la clase base define un método `clone()` como **virtual**, de modo que las clases derivadas pueden sobrescribirlo para devolver una copia de su propio tipo.

De esta forma, es posible clonar objetos de distintas clases a través de un mismo interfaz, sin conocer su tipo en tiempo de compilación.

```cpp
#include <iostream>
#include <memory>
#include <vector>

// Clase base con clonación virtual
class Clonable {
public:
    // Método virtual: puede redefinirse en las clases derivadas
    virtual std::unique_ptr<Clonable> clone() const {
        return std::make_unique<Clonable>(*this);
    }

    virtual void mostrar() const {
        std::cout << "Objeto base Clonable\n";
    }

    virtual ~Clonable() = default;
};

// Clase derivada A
class DerivadoA : public Clonable {
private:
    int dato;

public:
    DerivadoA(int d) : dato(d) {}

    std::unique_ptr<Clonable> clone() const override {
        return std::make_unique<DerivadoA>(*this); // Crea una copia del objeto actual
    }

    void mostrar() const override {
        std::cout << "DerivadoA: " << dato << "\n";
    }
};

// Clase derivada B
class DerivadoB : public Clonable {
private:
    std::vector<int> datos;

public:
    DerivadoB(const std::vector<int>& v) : datos(v) {}

    std::unique_ptr<Clonable> clone() const override {
        return std::make_unique<DerivadoB>(*this); // Crea una copia del objeto actual
    }

    void mostrar() const override {
        std::cout << "DerivadoB: ";
        for (int n : datos) std::cout << n << " ";
        std::cout << "\n";
    }
};

int main() {
    std::unique_ptr<Clonable> base = std::make_unique<Clonable>();
    std::unique_ptr<Clonable> a = std::make_unique<DerivadoA>(42);
    std::unique_ptr<Clonable> b = std::make_unique<DerivadoB>(std::vector<int>{1, 2, 3});

    auto clonBase = base->clone();
    auto clonA = a->clone();
    auto clonB = b->clone();

    base->mostrar();
    clonBase->mostrar();

    a->mostrar();
    clonA->mostrar();

    b->mostrar();
    clonB->mostrar();
}
```

* La clase base `Clonable` define un método `clone()` **virtual**, que devuelve un nuevo objeto con el mismo contenido.
* Las clases derivadas (`DerivadoA`, `DerivadoB`) **sobrescriben este método** para crear copias de su propio tipo.
* El uso de `std::unique_ptr` garantiza una **gestión automática y segura de memoria**.
* En el `main()`, los objetos pueden clonarse y mostrarse a través de punteros a la clase base, sin conocer su tipo concreto.

