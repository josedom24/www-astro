---
title: "Herencia de clases"
---

La **herencia** y el **polimorfismo** son conceptos fundamentales de la Programación Orientada a Objetos (POO) que permiten:

* Reutilizar código.
* Modelar relaciones jerárquicas entre clases.
* Diseñar sistemas flexibles y extensibles.

## Herencia

La **herencia** permite que una clase (denominada **derivada** o **subclase**) herede atributos y métodos de otra clase (denominada **base** o **superclase**).

Esto representa una relación **"es un"** (**is-a**)*

* Un **Gato** es un **Animal**.
* Un **Círculo** es una **Figura**.
* Un **Coche** es un **Vehículo**.

La herencia evita la duplicación de código y permite extender el comportamiento de las clases base.

La forma más habitual y recomendada de herencia en C++ es la **herencia pública**, que significa que los miembros `public` y `protected` de la clase base se mantienen accesibles con las mismas restricciones en la clase derivada. El control de acceso `protected` indica que un miembro no es accesible desde fuera de la clase, pero sí puede ser accedido por clases derivadas. Este modificador se utiliza comúnmente para permitir que las subclases interactúen directamente con ciertos atributos o métodos internos de la clase base, sin exponerlos completamente como parte de su interfaz pública.

Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

// Clase base
class Animal {
private:
    std::string nombre;

public:
    // Constructor por defecto usando lista de inicialización
    Animal() : nombre{""} {}

    // Constructor con parámetro usando lista de inicialización
    Animal(const std::string& n) : nombre{n} {}

    void respirar() const {
        std::cout << nombre << " está respirando." << std::endl;
    }

    void mostrarNombre() const {
        std::cout << "Nombre: " << nombre << std::endl;
    }
};

// Clase derivada
class Perro : public Animal {
private:
    std::string raza;

public:
    // Constructor por defecto
    Perro() : Animal{}, raza{""} {}

    // Constructor con parámetros usando lista de inicialización
    Perro(const std::string& n, const std::string& r)
        : Animal{n}, raza{r} {}
        
    void mostrar() const {
        mostrarNombre(); // Método heredado de Animal
        std::cout << "Raza: " << raza << std::endl;
    }

    void ladrar() const {
        std::cout << "¡Guau guau!" << std::endl;
    }
};

int main() {
    Perro miPerro{"Firulais", "Pastor Alemán"};

    miPerro.respirar();  // Método heredado de Animal
    miPerro.mostrar();   // Método propio que llama a mostrarNombre()
    miPerro.ladrar();    // Método exclusivo de Perro

    return 0;
}
```

* La clase base `Animal` y los miembros de `Perro` se inicializan **directamente en la lista de inicialización**.
* Las clases derivadas deben invocar explícitamente el constructor de la clase base. Si no se indica, se invoca automáticamente el constructor por defecto de la clase base (si existe). 
* El destructor de la clase base se invoca automáticamente después del destructor de la clase derivada.

## Reescritura de métodos en clases derivadas

Además de heredar y añadir nuevos métodos, una clase derivada puede **reescribir** un método ya definido en la clase base para adaptarlo a su propio comportamiento.

Esto significa que la clase derivada proporciona una nueva implementación de un método con el mismo nombre y la misma firma que en la clase base.

Ejemplo:

```cpp
#include <iostream>
#include <string>

// Clase base
class Animal {
public:
    void hablar() const {
        std::cout << "El animal hace un sonido genérico." << std::endl;
    }
};

// Clase derivada
class Perro : public Animal {
public:
    // Reescritura de método: hablamos de "sobrescritura simple"
    void hablar() const {
        std::cout << "El perro ladra." << std::endl;
    }
};

int main() {
    Animal a;
    Perro p;

    a.hablar(); // Llama al método de Animal
    p.hablar(); // Llama al método reescrito en Perro

    return 0;
}
```

En este ejemplo:

* La clase base `Animal` define un método `hablar()`.
* La clase derivada `Perro` **reescribe** ese mismo método para proporcionar un comportamiento específico.
* Según el tipo del objeto (`Animal` o `Perro`), se ejecuta una implementación distinta.


