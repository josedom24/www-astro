---
title: "Conversiones implícitas y punteros base"
---

Cuando trabajamos con herencia en C++, es común utilizar **punteros o referencias a la clase base** para manipular objetos derivados. Esto es posible porque C++ permite una **conversión implícita** de un puntero o referencia de una clase derivada hacia un puntero o referencia de su clase base.

Este mecanismo es fundamental para el **polimorfismo dinámico**, ya que permite tratar de forma uniforme a distintos objetos derivados mediante un único tipo común: la clase base. 

* Al hacer **conversiones implícitas**: el puntero o la referencia resultante solo puede acceder a los **miembros declarados en la clase base**, incluso si el objeto real pertenece a una clase derivada. 
* Si queremos acceder a los **miembros propios de la clase derivada**, tendremos que hacer una **conversión implícita** con `dynamic_cast`.

## Conversiones implícitas en herencia

Si tenemos un objeto de una clase derivada, podemos convertir su dirección a un puntero o referencia de la clase base sin necesidad de casting:

```cpp
#include <iostream>
#include <memory>

class Base {};
class Derivada : public Base {};

int main() {
    // --- Conversión implícita con punteros inteligentes ---
    // std::unique_ptr<Derivada> puede convertirse automáticamente
    // en std::unique_ptr<Base> porque existe una relación de herencia pública.
    std::unique_ptr<Derivada> ptrDerivada = std::make_unique<Derivada>();
    std::unique_ptr<Base> ptrBase = std::move(ptrDerivada); // Conversión implícita

    // --- Conversión implícita con referencias ---
    // Una referencia a un objeto Derivada puede asignarse a una referencia Base
    // sin necesidad de casting explícito.
    Derivada objDerivada;
    Base& refBase = objDerivada; // Conversión implícita

    std::cout << "Conversiones implícitas realizadas correctamente.\n";
    return 0;
}
```

* **Conversión con punteros inteligentes:**
  `std::unique_ptr<Derivada>` se convierte implícitamente en `std::unique_ptr<Base>` porque `Derivada` hereda públicamente de `Base`. No se necesita `dynamic_cast`.
* **Conversión con referencias:**
  Una referencia a `Derivada` puede vincularse directamente a una referencia a `Base` porque C++ aplica la conversión implícita correspondiente.
* Esta conversión es **segura** porque una clase derivada **es un** tipo de la clase base. La parte de la clase base está siempre presente en el objeto derivado.

## Conversiones implícitas con referencias

Cuando una clase deriva públicamente de otra, C++ permite convertir **implícitamente** una referencia a la clase derivada en una referencia a la clase base.
Esto permite manipular distintos tipos derivados mediante una interfaz común.
Sin embargo, tras la conversión, la referencia solo puede acceder a los **métodos declarados en la clase base**.
Si alguno de ellos ha sido **sobrescrito** en la clase derivada y es `virtual`, se ejecutará la versión correspondiente al tipo real del objeto.

```cpp
#include <iostream>

class Animal {
public:
    virtual void comer() const {
        std::cout << "El animal come.\n";
    }
};

class Perro : public Animal {
public:
    // Sobrescribimos el método comer
    void comer() const override {
        std::cout << "El perro come su pienso.\n";
    }

    void ladrar() const {
        std::cout << "El perro ladra.\n";
    }
};

class Gato : public Animal {
public:
    // No sobrescribe comer(), hereda la versión de Animal
    void maullar() const {
        std::cout << "El gato maúlla.\n";
    }
};

int main() {
    Perro p;
    Gato g;

    // --- Conversión implícita de Derivada& a Base& ---
    // Referencias a las derivadas se convierten automáticamente
    // en referencias a la clase base (sin necesidad de casting).
    Animal& refAnimal1 = p;
    Animal& refAnimal2 = g;

    // Ambas referencias solo pueden usar métodos definidos en Animal:
    refAnimal1.comer(); // Llama a Perro::comer() (método sobrescrito)
    refAnimal2.comer(); // Llama a Animal::comer() (no sobrescrito en Gato)

    // No podemos acceder a métodos exclusivos de las derivadas:
    // refAnimal1.ladrar(); // Error: 'ladrar' no está en Animal
    // refAnimal2.maullar(); // Error: 'maullar' no está en Animal

    // Pero si accedemos directamente al objeto derivado, sí:
    p.ladrar(); // Válido: tenemos un Perro
    g.maullar(); // Válido: tenemos un Gato

    std::cout << "Conversiones implícitas con referencias realizadas correctamente.\n";
    return 0;
}
```

* **Conversión implícita:** Las referencias `refAnimal1` y `refAnimal2` se crean automáticamente al asignar objetos `Perro` y `Gato` a variables de tipo `Animal&`.  No se requiere `dynamic_cast`.
* **Acceso restringido:** Desde una referencia de tipo `Animal&` solo pueden llamarse los métodos definidos en `Animal`.
  Métodos propios de `Perro` o `Gato` (como `ladrar()` o `maullar()`) no son accesibles.
* **Comportamiento dinámico:** Dado que `comer()` es `virtual`, la llamada `refAnimal1.comer()` ejecuta `Perro::comer()`, mientras que `refAnimal2.comer()` ejecuta `Animal::comer()`, porque `Gato` no la sobrescribió.


## Conversiones implícitas con punteros inteligentes

Las conversiones de una clase derivada a su clase base también pueden realizarse de forma **implícita** cuando se utilizan **punteros inteligentes** (`std::unique_ptr` o `std::shared_ptr`), siempre que la herencia sea **pública**.

Esto permite gestionar distintos objetos derivados a través de punteros inteligentes a la clase base, manteniendo la seguridad del tipo y el control automático de recursos.
Al igual que con las referencias, si un método es `virtual`, se ejecutará la versión correspondiente al tipo dinámico del objeto.

```cpp
#include <iostream>
#include <memory>

class Animal {
public:
    virtual void comer() const {
        std::cout << "El animal come.\n";
    }

    virtual ~Animal() = default;
};

class Perro : public Animal {
public:
    void comer() const override {
        std::cout << "El perro come su pienso.\n";
    }

    void ladrar() const {
        std::cout << "El perro ladra.\n";
    }
};

class Gato : public Animal {
public:
    // No sobrescribe 'comer', hereda la versión de Animal
    void maullar() const {
        std::cout << "El gato maúlla.\n";
    }
};

int main() {
    // --- Conversión implícita con punteros inteligentes ---
    // std::unique_ptr<Perro> se convierte automáticamente en std::unique_ptr<Animal>
    std::unique_ptr<Perro> ptrPerro = std::make_unique<Perro>();
    std::unique_ptr<Gato> ptrGato = std::make_unique<Gato>();

    std::unique_ptr<Animal> ptrAnimal1 = std::move(ptrPerro); // Conversión implícita
    std::unique_ptr<Animal> ptrAnimal2 = std::move(ptrGato);  // Conversión implícita

    // Ambas llamadas acceden solo a métodos declarados en Animal:
    ptrAnimal1->comer(); // Ejecuta Perro::comer() (sobrescrito)
    ptrAnimal2->comer(); // Ejecuta Animal::comer() (no sobrescrito por Gato)

    // No podemos acceder a los métodos propios de las derivadas:
    // ptrAnimal1->ladrar(); // Error: 'ladrar' no está en Animal
    // ptrAnimal2->maullar(); // Error: 'maullar' no está en Animal

    std::cout << "Conversiones implícitas con punteros inteligentes realizadas correctamente.\n";
    return 0;
}
```

* **Conversión implícita:**: `std::unique_ptr<Perro>` y `std::unique_ptr<Gato>` se convierten automáticamente en `std::unique_ptr<Animal>` gracias a la herencia pública.  No se necesita ningún `dynamic_cast`.
* **Polimorfismo dinámico:**: Como `comer()` es `virtual`, al invocarlo desde `ptrAnimal1` se ejecuta `Perro::comer()`, mientras que `ptrAnimal2` usa la versión de `Animal`, ya que `Gato` no la sobrescribe.
* **Acceso restringido:**: Desde un puntero a `Animal` no pueden llamarse métodos específicos de las derivadas (`ladrar()`, `maullar()`), porque no forman parte de la interfaz común.


## Limitaciones y precauciones

* La conversión **solo funciona de derivada a base**.
* La conversión inversa (de base a derivada) **no es implícita**: se debe usar casting explícito (`dynamic_cast` con herencia polimórfica).
* Si la clase base **no declara destructores virtuales**, destruir objetos derivados a través de punteros base puede causar fugas de memoria o comportamiento indefinido.
* Si no hay métodos virtuales, el puntero base no se comportará polimórficamente, sino que llamará siempre a la versión de la clase base.

