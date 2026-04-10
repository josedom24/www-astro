---
title: "Composición de objetos"
---

En la Programación Orientada a Objetos (POO), uno de los mecanismos fundamentales para modelar relaciones entre entidades del mundo real es la **composición**, también conocida como relación **"tiene un"** (**has-a**). Esta técnica permite construir clases complejas a partir de otras clases, fomentando el diseño modular y la reutilización de código.

La **composición** implica que una clase contiene como atributos a objetos de otras clases. Esta relación se describe informalmente como:

* "Un coche **tiene un** motor."
* "Una persona **tiene una** dirección."
* "Un pedido **tiene una** fecha."

Las ventajas de la composición son:

* Permite construir clases complejas a partir de otras más simples.
* Favorece la reutilización y el diseño modular.
* Refleja relaciones del mundo real de forma natural.
* Mejora la legibilidad y mantenibilidad del código.

En términos de C++, se dice que una clase **compone** otras clases cuando declara objetos de esas clases como **atributos**.

## Clases que contienen objetos de otras clases

Para lograr la composición en C++, simplemente se declara como atributo un objeto de otra clase dentro de la definición de una clase. Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

class Direccion {
private:
    std::string calle;
    std::string ciudad;

public:
    // Constructor por defecto usando lista de inicialización
    Direccion() : calle{""}, ciudad{""} {}

    // Constructor con parámetros usando lista de inicialización
    Direccion(const std::string& c, const std::string& ciu)
        : calle{c}, ciudad{ciu} {}

    void mostrar() const {
        std::cout << "Calle: " << calle << ", Ciudad: " << ciudad << std::endl;
    }
};

class Persona {
private:
    std::string nombre;
    Direccion direccion;  // Composición: una Persona tiene una Direccion

public:
    // Constructor usando lista de inicialización para todos los miembros
    Persona(const std::string& n, const Direccion& d)
        : nombre{n}, direccion{d} {}

    void mostrar() const {
        std::cout << "Nombre: " << nombre << std::endl;
        direccion.mostrar();
    }
};

int main() {
    Direccion dir("Calle Mayor 123", "Madrid");
    Persona p("Juan", dir);

    p.mostrar();

    return 0;
}

```

* Cuando se crea un objeto de tipo `Persona`, automáticamente se construye también el objeto `Direccion` contenido en su interior.
* El destructor de `Direccion` se invoca automáticamente cuando se destruye el objeto `Persona`.
* La composición garantiza que los objetos contenidos existen mientras exista el objeto que los compone.
