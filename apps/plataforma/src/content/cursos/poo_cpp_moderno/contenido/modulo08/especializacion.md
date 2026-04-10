---
title: "Especialización de plantillas de clase"
---

Las plantillas en C++ permiten definir clases genéricas que funcionan con distintos tipos.
Sin embargo, a veces es necesario **adaptar su comportamiento para tipos concretos**.
Esto se logra mediante la **especialización de plantillas**, que permite redefinir total o parcialmente la implementación para casos específicos.

## Especialización total

La **especialización total** consiste en proporcionar una versión completamente diferente de la clase plantilla **para un tipo concreto**.

```cpp
#include <iostream>
#include <string>

// Versión genérica
template <typename T>
class Caja {
public:
    void mostrar(const T& valor) const {
        std::cout << "Contenido genérico: " << valor << '\n';
    }
};

// Especialización total para std::string
template <>
class Caja<std::string> {
public:
    void mostrar(const std::string& valor) const {
        std::cout << "Texto: \"" << valor << "\"\n";
    }
};

int main() {
    Caja<int> c1;
    c1.mostrar(42);              // Contenido genérico: 42

    Caja<std::string> c2;
    c2.mostrar("Hola mundo");    // Texto: "Hola mundo"

    return 0;
}
```

Aquí `Caja` tiene un comportamiento genérico, pero se redefine completamente cuando el tipo es `std::string`.

## Especialización parcial

La **especialización parcial** modifica el comportamiento **para un conjunto de tipos**. Generalmente, se usa con tipos dependientes de otros parámetros (por ejemplo, `std::vector<T>`,` std::array<T>`, etc.).
Por ejemplo, podemos tratar los vectores de forma diferente:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <sstream>

// Clase plantilla genérica para acumular valores de tipo T
template <typename T>
class Acumulador {
private:
    std::vector<T> datos;  // Contenedor interno

public:
    // Añade un valor al acumulador
    void agregar(const T& valor) {
        datos.push_back(valor);
    }

    // Devuelve la cantidad de elementos
    std::size_t tamano() const {
        return datos.size();
    }

    // Muestra todos los elementos en una sola línea
    void mostrar() const {
        std::cout << "[ ";
        for (const auto& x : datos)
            std::cout << x << ' ';
        std::cout << "]\n";
    }

    // Convierte el contenido a una cadena de texto
    std::string comoTexto() const {
        std::ostringstream os;
        for (const auto& x : datos)
            os << x << ' ';
        return os.str();
    }
};

// Especialización parcial para tipos vectoriales: Acumulador<std::vector<T>>
template <typename T>
class Acumulador<std::vector<T>> {
private:
    std::vector<std::vector<T>> datos;  // Contiene varios vectores del mismo tipo

public:
    // Agrega un vector completo al acumulador
    void agregar(const std::vector<T>& vec) {
        datos.push_back(vec);
    }

    // Devuelve la cantidad de vectores almacenados
    std::size_t tamano() const {
        return datos.size();
    }

    // Muestra los vectores almacenados
    void mostrar() const {
        std::cout << "Contenido de vectores:\n";
        for (const auto& v : datos) {
            std::cout << "[ ";
            for (const auto& x : v)
                std::cout << x << ' ';
            std::cout << "]\n";
        }
    }

    // Combina todos los vectores en uno solo
    std::vector<T> combinar() const {
        std::vector<T> resultado;
        for (const auto& v : datos)
            resultado.insert(resultado.end(), v.begin(), v.end());
        return resultado;
    }
};

int main() {
    // Acumulador genérico (para strings)
    Acumulador<std::string> palabras;
    palabras.agregar("Hola");
    palabras.agregar("mundo");
    palabras.agregar("C++");
    palabras.mostrar();
    std::cout << "Como texto: " << palabras.comoTexto() << "\n\n";

    // Acumulador especializado para vectores
    Acumulador<std::vector<int>> listas;
    listas.agregar({1, 2, 3});
    listas.agregar({4, 5});
    listas.mostrar();

    auto combinado = listas.combinar();
    std::cout << "Vector combinado: [ ";
    for (int x : combinado)
        std::cout << x << ' ';
    std::cout << "]\n";
}
```

* **Plantilla genérica principal (`Acumulador<T>`):** permite acumular valores de cualquier tipo `T`, con operaciones comunes como agregar, mostrar y convertir a texto.
* **Especialización parcial (`Acumulador<std::vector<T>>`):** define un comportamiento específico cuando el tipo es un vector de cualquier tipo `T`, conservando el carácter genérico gracias al parámetro de plantilla interno.
* **Diferencia con la especialización total:** esta versión no se limita a un tipo concreto (como `int`), sino que sirve para *todos los vectores posibles* (`std::vector<int>`, `std::vector<double>`, `std::vector<std::string>`, etc.).
* **Nuevo comportamiento especializado:** en lugar de acumular valores individuales, almacena varios vectores y permite combinarlos en un solo vector mediante el método `combinar()`.

