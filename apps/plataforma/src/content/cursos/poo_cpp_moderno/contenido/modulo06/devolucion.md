---
title: "Devolución de interfaces mediante punteros inteligentes"
---

En el apartado anterior se analizó por qué devolver **tipos concretos** conduce a un código **fuertemente acoplado**, difícil de extender y de mantener.
También se mostró que, aunque devolver objetos polimórficos parece una alternativa más flexible, en C++ presenta **problemas técnicos** como el *object slicing*, las referencias colgantes y la gestión manual de memoria.

La solución moderna y segura es **devolver interfaces abstractas a través de punteros inteligentes**.
De este modo, una función puede crear un objeto de una clase concreta y devolverlo **como interfaz base**, ocultando completamente los detalles de su implementación y garantizando una gestión automática de los recursos.

Recordemos que uno de los principios fundamentales del diseño orientado a objetos es **“programar contra interfaces, no contra implementaciones”**.
Cuando una función devuelve una interfaz —y no una clase concreta— el código cliente no recibe *lo que el objeto es*, sino **lo que el objeto puede hacer**: las operaciones definidas en la interfaz.
Esto permite trabajar con diferentes tipos de objetos de manera uniforme, sin conocer su clase real, manteniendo así **bajo acoplamiento** y **alta extensibilidad**.

Este enfoque combina tres ideas esenciales del diseño en C++ moderno:

1. **Polimorfismo dinámico:** el comportamiento se resuelve en tiempo de ejecución según el tipo real del objeto.
2. **RAII y punteros inteligentes:** los recursos se gestionan automáticamente sin intervención del programador.
3. **Desacoplamiento:** el cliente trabaja con la interfaz abstracta, sin depender de las clases concretas.

De esta manera, las funciones pueden crear y devolver objetos de distintos tipos **de forma segura, flexible y coherente con los principios del diseño orientado a objetos**.

## Devolver una interfaz mediante `std::unique_ptr`

Cuando el objeto devuelto tiene **una única propiedad** (nadie más necesita compartirlo), se utiliza `std::unique_ptr`. Este tipo de puntero inteligente transfiere la propiedad de manera exclusiva y destruye automáticamente el objeto al salir del ámbito.

```cpp
#include <iostream>
#include <memory>

// Interfaz base
class Forma {
public:
    virtual void dibujar() const = 0;
    virtual ~Forma() = default;
};

// Implementaciones concretas
class Circulo : public Forma {
public:
    void dibujar() const override {
        std::cout << "Dibujando un círculo\n";
    }
};

class Rectangulo : public Forma {
public:
    void dibujar() const override {
        std::cout << "Dibujando un rectángulo\n";
    }
};

// Función que devuelve la interfaz
std::unique_ptr<Forma> crearForma(bool esCirculo) {
    if (esCirculo)
        return std::make_unique<Circulo>();
    else
        return std::make_unique<Rectangulo>();
}

int main() {
    auto forma1 = crearForma(true);   // Crea un círculo
    auto forma2 = crearForma(false);  // Crea un rectángulo

    forma1->dibujar();  // Llamada polimórfica: Circulo::dibujar()
    forma2->dibujar();  // Llamada polimórfica: Rectangulo::dibujar()
}
```

* La función `crearForma()` devuelve un `std::unique_ptr<Forma>`, ocultando el tipo concreto del objeto creado.
* El cliente recibe un puntero a la interfaz `Forma` y puede usarlo sin conocer si se trata de un `Circulo` o un `Rectangulo`.
* El polimorfismo dinámico garantiza que la llamada a `dibujar()` invoque la implementación adecuada.
* Gracias a **RAII**, el objeto se destruye automáticamente cuando el puntero sale del ámbito, sin necesidad de `delete`.

## Devolver una interfaz mediante `std::shared_ptr`

En algunos escenarios, varios componentes pueden necesitar **compartir la misma instancia polimórfica** (por ejemplo, un recurso gráfico o un servicio común).
En estos casos, se utiliza `std::shared_ptr`, que mantiene un **conteo de referencias** y destruye el objeto cuando la última referencia desaparece.

```cpp
#include <iostream>
#include <memory>

// Interfaz base
class Forma {
public:
    virtual void dibujar() const = 0;
    virtual ~Forma() = default;
};

// Implementaciones concretas
class Circulo : public Forma {
public:
    void dibujar() const override {
        std::cout << "Dibujando un círculo\n";
    }
};

class Rectangulo : public Forma {
public:
    void dibujar() const override {
        std::cout << "Dibujando un rectángulo\n";
    }
};

// Función que devuelve una interfaz compartida
std::shared_ptr<Forma> crearForma(bool esCirculo) {
    if (esCirculo)
        return std::make_shared<Circulo>();
    else
        return std::make_shared<Rectangulo>();
}

int main() {
    auto forma1 = crearForma(true);   // Círculo
    auto forma2 = crearForma(false);  // Rectángulo

    // Dos punteros compartiendo el mismo objeto
    auto formaCompartida = forma1;

    forma1->dibujar();  // Circulo
    forma2->dibujar();  // Rectangulo

    std::cout << "Referencias compartidas al círculo: "
              << forma1.use_count() << "\n";
}
```

* `crearForma()` devuelve un `std::shared_ptr<Forma>`, lo que permite compartir la misma instancia entre varios punteros.
* Cada vez que se copia el puntero, el contador interno aumenta; cuando todas las referencias desaparecen, el objeto se destruye automáticamente.
* Esto es útil para recursos compartidos entre múltiples componentes.
* El método `use_count()` permite consultar cuántas referencias apuntan al mismo objeto.

