---
title: "Introducción al polimorfismo"
---

El **polimorfismo** significa *“muchas formas”*. En POO, se refiere a la capacidad de que un mismo método tenga **diferentes comportamientos** según el tipo de objeto que lo invoque.

En C++ existen dos formas principales de polimorfismo:

* **Polimorfismo de sobrecarga (en tiempo de compilación):** mismo nombre de función pero diferentes parámetros.
* **Polimorfismo dinámico (en tiempo de ejecución):** se logra mediante **herencia** y **métodos virtuales**.

Nos centraremos primero en el **polimorfismo dinámico**, que es el más relevante en la POO clásica.

Podemos extender nuestro ejemplo de `Animal` para que diferentes animales "hagan sonido" de manera distinta.

```cpp
#include <iostream>
#include <string>

class Animal {
protected:
    std::string nombre;

public:
    Animal(const std::string& n) : nombre{n} {}

    virtual void hacerSonido() const {  // Método virtual
        std::cout << nombre << " hace un sonido genérico." << std::endl;
    }
};

class Perro : public Animal {
public:
    Perro(const std::string& n) : Animal{n} {}

    void hacerSonido() const override {
        std::cout << nombre << " dice: ¡Guau guau!" << std::endl;
    }
};

class Gato : public Animal {
public:
    Gato(const std::string& n) : Animal{n} {}

    void hacerSonido() const override {
        std::cout << nombre << " dice: ¡Miau!" << std::endl;
    }
};

int main() {
    Perro perro("Firulais");
    Gato gato("Misu");

    // Polimorfismo usando referencias
    Animal& a1 = perro;
    Animal& a2 = gato;

    a1.hacerSonido(); // Llama a Perro::hacerSonido()
    a2.hacerSonido(); // Llama a Gato::hacerSonido()

    return 0;
}

```
* Un **método virtual** en C++ es un método de una clase base que **puede ser sobrescrito** por las clases derivadas, y cuya llamada se resuelve en tiempo de ejecución según el tipo real del objeto, no según el tipo de la referencia o puntero que lo invoca.
* Se recomienda usar la palabra clave `override` para indicar de forma explícita que se está sobrescribiendo un método virtual.
* El método `hacerSonido()` en `Animal` se declara como `virtual`.
* Cada clase derivada (`Perro`, `Gato`) sobrescribe ese método con `override`.
* `a1` y `a2` son referencia de tipo `Animal`, pero cada una referencia a un objeto distinto. Al invocar `hacerSonido()` se ejecuta la versión correspondiente al tipo real del objeto (polimorfismo dinámico).
* Esto permite escribir código más **flexible** y **extensible**, donde se pueden tratar colecciones de distintos tipos de objetos de manera uniforme.

