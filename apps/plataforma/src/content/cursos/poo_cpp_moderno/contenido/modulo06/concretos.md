---
title: "El problema de devolver tipos concretos y objetos polimórficos"
---

Hasta ahora hemos visto cómo las **interfaces puras** permiten definir contratos de comportamiento y cómo las clases derivadas pueden implementarlas para ofrecer distintas versiones de una misma operación.
Sin embargo, cuando una función o un componente necesita **crear y devolver un objeto** de una jerarquía de clases, aparece una dificultad importante: **¿cómo devolverlo sin exponer el tipo concreto ni comprometer la seguridad o la extensibilidad del código?**

Este apartado analiza los problemas derivados de **devolver tipos concretos o polimórficos de manera incorrecta**, y servirá de base para comprender, en el siguiente apartado, cómo **los punteros inteligentes** permiten resolverlos de forma segura.

## Devolver tipos concretos: un enfoque limitado

Cuando una función devuelve un tipo concreto (por ejemplo, `Circulo` o `Rectangulo`), el código cliente queda **directamente acoplado** a esas clases.
Esto significa que cualquier cambio o ampliación en la jerarquía obliga a modificar el código que las usa.

### Ejemplo: enfoque limitado

```cpp
#include <iostream>
#include <memory>

class Circulo {
public:
    void dibujar() const {
        std::cout << "Dibujando un círculo\n";
    }
};

class Rectangulo {
public:
    void dibujar() const {
        std::cout << "Dibujando un rectángulo\n";
    }
};

// Funciones que devuelven tipos concretos
std::unique_ptr<Circulo> crearCirculo() {
    return std::make_unique<Circulo>();
}

std::unique_ptr<Rectangulo> crearRectangulo() {
    return std::make_unique<Rectangulo>();
}

int main() {
    auto c = crearCirculo();
    auto r = crearRectangulo();

    c->dibujar();
    r->dibujar();
}
```

* Cada función devuelve un tipo distinto (`Circulo`, `Rectangulo`), de modo que el cliente **debe conocer todas las clases concretas**.
* No existe una interfaz común que unifique su tratamiento.
* No es posible almacenar distintas figuras en un mismo contenedor ni procesarlas mediante una función genérica.
* Cualquier nueva figura (`Triangulo`, `Poligono`, etc.) obliga a **modificar el código cliente**.

Este enfoque es válido en programas muy pequeños, pero **no escala** cuando el sistema crece o cuando se busca extensibilidad y bajo acoplamiento.

## La necesidad de devolver interfaces

Para evitar este acoplamiento excesivo, en C++ moderno se sigue el principio **“programar contra interfaces, no contra implementaciones”**. Esto significa que el código cliente debe depender **de un contrato abstracto**, no de una clase concreta.

En lugar de devolver un objeto de tipo `Circulo` o `Rectangulo`, la función debería devolver **un puntero o referencia a la interfaz común**, por ejemplo `Figura`. De ese modo, el cliente solo necesita conocer qué operaciones ofrece la interfaz (`dibujar()`, `mover()`, etc.), no cómo se implementan.

Ventajas de devolver interfaces:

* **Desacoplamiento:** el cliente no necesita incluir los encabezados de las clases concretas.
* **Extensibilidad:** se pueden añadir nuevas figuras sin modificar el código que las utiliza.
* **Reutilización:** distintas partes del programa pueden operar sobre la misma interfaz sin conocer los tipos concretos.
* **Polimorfismo dinámico:** el comportamiento concreto se determina en tiempo de ejecución según el tipo real del objeto.

Devolver interfaces es, por tanto, **la solución conceptual** al problema de acoplamiento; sin embargo, su implementación en C++ presenta **ciertos desafíos técnicos**, que veremos a continuación.

### Devolver por valor: *object slicing*

Cuando se devuelve un objeto **por valor** en una jerarquía de clases, solo se copia la **parte correspondiente a la clase base**, y se pierde la información específica de la clase derivada.
Este fenómeno se denomina ***object slicing*** (literalmente, “recorte del objeto”).

En consecuencia, el comportamiento propio del tipo derivado se pierde, y el objeto resultante se comporta como si fuera únicamente una instancia de la clase base.

```cpp
#include <iostream>

// Clase base (no abstracta)
class Figura {
public:
    virtual void dibujar() const {
        std::cout << "Dibujando una figura genérica\n";
    }

    virtual ~Figura() = default;
};

// Clase derivada
class Circulo : public Figura {
public:
    void dibujar() const override {
        std::cout << "Dibujando un Círculo\n";
    }
};

// Función que devuelve un objeto por valor (provoca object slicing)
Figura crearFiguraPorValor() {
    Circulo c;
    return c;  // Se permite, pero se produce "object slicing"
}

int main() {
    std::cout << "== Ejemplo con devolución por valor ==\n";
    Figura f = crearFiguraPorValor();  // Se copia solo la parte base
    f.dibujar();  // Muestra: "Dibujando una figura genérica"

    return 0;
}

```

* Hemos usado una clase no abstracta, para que se pueda instanciar y se pueda devolver su valor.
* La función `crearFiguraPorValor()` devuelve un objeto de tipo `Figura` **por valor**.
* Aunque dentro de la función se crea un `Circulo`, al devolverlo como `Figura` **solo se conserva la parte base del objeto**.
* La información específica de `Circulo` (sus atributos o comportamiento propio) **se pierde** durante la copia.
* Como resultado, el objeto devuelto se comporta como una `Figura` genérica, sin el comportamiento sobrescrito en `Circulo`.


### Devolver por referencia: referencia colgante

Si se devuelve una **referencia a un objeto local**, esa referencia apuntará a un objeto destruido cuando la función termine. Esto provoca **comportamiento indefinido**, ya que se intenta acceder a memoria que ya no pertenece al programa.

```cpp
#include <iostream>

class Figura {
public:
    virtual void dibujar() const = 0;
    virtual ~Figura() = default;
};

class Circulo : public Figura {
public:
    void dibujar() const override {
        std::cout << "Dibujando un círculo\n";
    }
};

// Función incorrecta: devuelve referencia a un objeto local
Figura& crearFigura() {
    Circulo c;  // Objeto local (vida limitada al ámbito de la función)
    return c;   // Se devuelve una referencia a un objeto que será destruido
}

int main() {
    Figura& f = crearFigura();  // La referencia queda colgante
    f.dibujar();                // Comportamiento indefinido
}
```


* El objeto `c` se crea dentro de la función `crearFigura()`.
* Al salir de la función, `c` se destruye automáticamente.
* La referencia devuelta (`f`) apunta a una zona de memoria que ya no contiene un objeto válido.
* Llamar a `f.dibujar()` produce **comportamiento indefinido**: puede parecer funcionar en algunos entornos, pero el resultado es impredecible.
* Nunca se debe devolver una referencia (ni un puntero) a un objeto local, ya que su **tiempo de vida termina al salir de la función**.


Aunque en C++ es posible devolver **punteros crudos** a objetos dinámicos para lograr **polimorfismo dinámico**, esta práctica **traslada la responsabilidad de la gestión de memoria al código cliente**, lo que puede provocar errores graves como **fugas de memoria** o **liberaciones duplicadas**.

Estas limitaciones muestran que, aunque el polimorfismo dinámico es una herramienta poderosa, **su uso directo en la devolución de objetos no es seguro sin una gestión adecuada de recursos**. En el siguiente apartado veremos cómo el C++ moderno soluciona estos problemas mediante **punteros inteligentes** (`std::unique_ptr` y `std::shared_ptr`), que permiten **devolver interfaces polimórficas** de forma **segura, eficiente y desacoplada**.

