---
title: "Functores y clases con `operator()`"
---

En C++, una clase puede comportarse como una función si **sobrecarga el operador de llamada `operator()`**.
A estos objetos se les denomina **functores** (*function objects*).
Permiten **encapsular lógica configurable** dentro de un objeto invocable, combinando:

* la **sintaxis de las funciones**, y
* la **organización y el estado interno de las clases**.

Antes de las lambdas (introducidas en C++11), los functores eran la forma más habitual de representar acciones o estrategias intercambiables.
Aun hoy siguen siendo útiles cuando se necesita **comportamiento configurable con estado persistente**.

## Ejemplo básico: un objeto invocable

```cpp
#include <iostream>

class Sumar {
public:
    int operator()(int a, int b) const {
        return a + b;
    }
};

int main() {
    Sumar sumar;
    std::cout << "Resultado: " << sumar(3, 4) << '\n';  // 7
}
```

La clase `Sumar` define `operator()`, lo que permite **invocar el objeto como si fuera una función**:
`sumar(3, 4)` llama internamente a `sumar.operator()(3, 4)`.


## Functor con estado interno

Los functores pueden **guardar información** que modifique su comportamiento:

```cpp
#include <iostream>

class Multiplicador {
private:
    int factor_;
public:
    explicit Multiplicador(int factor) : factor_(factor) {}

    int operator()(int x) const {
        return x * factor_;
    }

};

int main() {
    Multiplicador por2(2);
    Multiplicador por10(10);

    std::cout << por2(5) << '\n';   // 10
    std::cout << por10(3) << '\n';  // 30
}
```

Cada instancia de `Multiplicador` representa un comportamiento distinto.
El estado `factor_` personaliza la acción sin necesidad de escribir clases derivadas.

## Inyección de comportamiento con functores

Los functores también pueden usarse para **inyectar comportamiento configurable** en otras clases o funciones,
igual que hicimos antes con lambdas o `std::function`.

```cpp
#include <iostream>
#include <vector>

class Accion {
public:
    virtual void operator()(int x) const = 0;
    virtual ~Accion() = default;
};

class Mostrar : public Accion {
public:
    void operator()(int x) const override {
        std::cout << "Valor: " << x << '\n';
    }
};

class Cuadrado : public Accion {
public:
    void operator()(int x) const override {
        std::cout << x << "² = " << x * x << '\n';
    }
};

// El procesador no es dueño de la acción, solo la usa
class Procesador {
public:
    explicit Procesador(const Accion& accion) : accion_(accion) {}

    void ejecutar(const std::vector<int>& datos) const {
        for (int valor : datos)
            accion_(valor);
    }

private:
    const Accion& accion_; // referencia constante, sin propiedad
};

int main() {
    std::vector<int> numeros = {1, 2, 3};

    Mostrar mostrar;
    Cuadrado cuadrado;

    Procesador p1(mostrar);
    Procesador p2(cuadrado);

    p1.ejecutar(numeros);
    p2.ejecutar(numeros);
}

```

* **Cada clase derivada (`Mostrar`, `Cuadrado`) define su propio comportamiento** sobre el operador `()`, actuando como *functor* (objeto que se puede “llamar” como una función).
* **El `Procesador` recibe una referencia a un objeto `Accion`**, sin conocer su tipo concreto, lo que permite **inyectar diferentes comportamientos** en tiempo de ejecución.
* **La llamada `accion_(valor)` dentro de `Procesador::ejecutar`** invoca polimórficamente el operador `()` del functor concreto, aplicando la acción específica a cada elemento del vector.


