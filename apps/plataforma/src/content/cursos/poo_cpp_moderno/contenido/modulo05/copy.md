---
title: "Copia de objetos: superficiales y profundas"
---

La copia de objetos constituye un aspecto esencial de la programación orientada a objetos, ya que permite duplicar el estado de un objeto existente en otro nuevo. En C++ moderno, esta operación puede realizarse de forma automática o personalizada mediante dos mecanismos fundamentales del lenguaje: el **constructor de copia** y el **operador de asignación por copia**.

## Mecanismos de copia

* El **constructor de copia** se utiliza cuando se crea un nuevo objeto a partir de otro del mismo tipo. Este mecanismo se activa, por ejemplo, al inicializar un objeto con otro existente o al pasar un objeto por valor a una función. Su propósito es construir un nuevo objeto que contenga el mismo estado que el original.
* El **operador de asignación por copia** se emplea cuando un objeto ya existente recibe el estado de otro objeto del mismo tipo. En este caso, el operador debe gestionar adecuadamente la copia para evitar errores, especialmente cuando los objetos comparten recursos internos. Este operador es una **sobrecarga del operador de asignación (`=`)**; aunque el tema de sobrecarga de operadores se estudiará más adelante, aquí se hace uso de esta capacidad del lenguaje para definir el comportamiento específico de la asignación entre objetos de la clase.

## Tipos de copia

El modo en que se copian los datos de un objeto determina si la copia es **superficial** o **profunda**.

* **Copia superficial (shallow copy):** Consiste en duplicar directamente los valores de los atributos del objeto, incluidos los punteros. Si el objeto gestiona recursos dinámicos, ambos objetos terminan apuntando al mismo recurso. Esto puede provocar errores graves como liberaciones múltiples del mismo recurso (*double delete*) o accesos a memoria ya liberada.

* **Copia profunda (deep copy):** Implica duplicar no solo los atributos, sino también los recursos a los que estos apuntan. Cada objeto mantiene su propia copia independiente del recurso, lo que evita interferencias o conflictos entre ellos. Este enfoque es esencial cuando los objetos gestionan memoria u otros recursos exclusivos.

## Copias profundas con los contenedores de la STL

En C++ moderno, muchas clases de la biblioteca estándar (como `std::vector` o `std::string`) implementan automáticamente copias profundas, lo que simplifica el trabajo del programador y reduce los errores comunes asociados a la gestión manual de memoria.

En este ejemplo vemos como los `std::vector` **duplican sus datos internos al copiarse**. Esto significa que modificar una copia **no afecta** al original.

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a{1, 2, 3};
    std::vector<int> b = a;  // Constructor de copia (copia profunda)

    a[1] = 99;  // Modificamos solo 'a'

    std::cout << "a: ";
    for (int v : a) std::cout << v << " ";  // 1 99 3
    std::cout << "\n";

    std::cout << "b: ";
    for (int v : b) std::cout << v << " ";  // 1 2 3
    std::cout << "\n";
}
```
* Cada `std::vector` mantiene su propio almacenamiento interno, por lo que los cambios en `a` no afectan a `b`.
* Esto demuestra que la copia efectuada por `std::vector` es **profunda**.


## Copia superficial y copia profunda con punteros inteligentes

En el ejemplo anterior, hemos visto que las clases de la biblioteca estándar (`std::vector`, `std::string`, etc.) ya implementan copias profundas automáticas. Sin embargo, cuando una clase gestiona recursos dinámicos mediante punteros, es necesario definir explícitamente cómo debe copiarse ese recurso.
A continuación se presentan dos versiones equivalentes de una clase `Buffer`: la primera realiza **una copia superficial**, y la segunda **una copia profunda**, ambas empleando punteros inteligentes.

### Ejemplo 1: Copia superficial con `std::shared_ptr`

En este caso, ambos objetos **comparten el mismo recurso** a través de un puntero compartido (`std::shared_ptr`).
Esto significa que modificar los datos desde un objeto afecta también al otro.

```cpp
#include <iostream>
#include <memory>
#include <vector>

class BufferSuperficial {
private:
    std::shared_ptr<std::vector<int>> datos;

public:
    // Constructor por defecto
    BufferSuperficial()
        : datos(std::make_shared<std::vector<int>>()) {}

    // Constructor con datos iniciales (por vector)
    explicit BufferSuperficial(const std::vector<int>& v)
        : datos(std::make_shared<std::vector<int>>(v)) {}

    // Constructor de copia (superficial)
    BufferSuperficial(const BufferSuperficial& other)
        : datos(other.datos) {
        std::cout << "Constructor de copia (superficial)\n";
    }

    // Operador de asignación por copia (superficial)
    BufferSuperficial& operator=(const BufferSuperficial& other) {
        if (this != &other) {
            datos = other.datos;
            std::cout << "Asignación por copia (superficial)\n";
        }
        return *this;
    }

    void modificar(size_t i, int valor) {
        if (i < datos->size()) (*datos)[i] = valor;
    }

    void mostrar() const {
        for (int v : *datos) std::cout << v << " ";
        std::cout << "\n";
    }
};

int main() {
    BufferSuperficial b1(std::vector<int>{1, 2, 3});
    BufferSuperficial b2 = b1;
    BufferSuperficial b3;
    b3 = b1;

    std::cout << "== Estado inicial ==\n";
    b1.mostrar();
    b2.mostrar();
    b3.mostrar();

    b1.modificar(1, 99);

    std::cout << "\n== Después de modificar b1 ==\n";
    b1.mostrar();
    b2.mostrar();
    b3.mostrar();
}

```

* En este ejemplo, todos los objetos (`b1`, `b2`, `b3`) comparten el mismo recurso gestionado por `std::shared_ptr`.
* El recuento de referencias aumenta con cada copia, pero los datos son comunes.
* Por tanto, se trata de una **copia superficial**.

### Ejemplo 2: Copia profunda con `std::unique_ptr`

En este segundo ejemplo, cada objeto mantiene **su propia copia independiente del recurso**.
Para lograrlo, el constructor y el operador de copia deben clonar explícitamente el contenido.

```cpp
#include <iostream>
#include <memory>
#include <vector>

class BufferProfundo {
private:
    std::unique_ptr<std::vector<int>> datos;

public:
    // Constructor por defecto
    BufferProfundo()
        : datos(std::make_unique<std::vector<int>>()) {}

    // Constructor con datos iniciales (por vector)
    explicit BufferProfundo(const std::vector<int>& v)
        : datos(std::make_unique<std::vector<int>>(v)) {}

    // Constructor de copia (copia profunda)
    BufferProfundo(const BufferProfundo& other)
        : datos(std::make_unique<std::vector<int>>(*other.datos)) {
        std::cout << "Constructor de copia (profunda)\n";
    }

    // Operador de asignación por copia (copia profunda)
    BufferProfundo& operator=(const BufferProfundo& other) {
        if (this != &other) {
            datos = std::make_unique<std::vector<int>>(*other.datos);
            std::cout << "Asignación por copia (profunda)\n";
        }
        return *this;
    }

    void modificar(size_t i, int valor) {
        if (i < datos->size()) (*datos)[i] = valor;
    }

    void mostrar() const {
        for (int v : *datos) std::cout << v << " ";
        std::cout << "\n";
    }
};

int main() {
    BufferProfundo b1(std::vector<int>{1, 2, 3});
    BufferProfundo b2 = b1;  // Constructor de copia (duplica datos)
    BufferProfundo b3(std::vector<int>{4, 5, 6});
    b3 = b1;                 // Asignación por copia (duplica datos)

    std::cout << "== Estado inicial ==\n";
    b1.mostrar();
    b2.mostrar();
    b3.mostrar();

    b1.modificar(1, 99);  // Modifica solo su copia

    std::cout << "\n== Después de modificar b1 ==\n";
    b1.mostrar();
    b2.mostrar();  // No se ve afectado
    b3.mostrar();  // No se ve afectado
}

```

* Aquí, cada objeto posee su propio recurso dinámico gestionado por `std::unique_ptr`.
* Durante la copia, el contenido del vector es duplicado explícitamente, garantizando independencia entre objetos.
* Esta es una **copia profunda**.


