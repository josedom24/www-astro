---
title: "Introducción a las plantillas de clases"
---

En el desarrollo de software, es habitual la necesidad de definir clases que operen sobre distintos tipos de datos. Una solución ingenua consistiría en crear múltiples versiones de una misma clase, una por cada tipo necesario, lo cual genera duplicación de código, mayores costes de mantenimiento y pérdida de claridad.

La **programación genérica** en C++ moderno ofrece una solución elegante a este problema mediante el uso de **plantillas (templates)**.
Una plantilla permite definir estructuras de datos y algoritmos en términos de **tipos genéricos**, de forma que el compilador genera automáticamente las versiones concretas necesarias al ser instanciadas.

## Definición e instanciación de una plantilla de clase

Una **plantilla de clase** permite definir una estructura genérica cuyos miembros pueden operar sobre distintos tipos de datos, sin duplicar código.
El tipo concreto se especifica en el momento de la **instanciación**, y el compilador genera automáticamente la versión correspondiente de la clase.

A continuación se muestra un ejemplo completo de una plantilla básica:

```cpp
#include <iostream>
#include <string>

// Definición de una clase plantilla con un parámetro de tipo T
template <typename T>
class Contenedor {
private:
    T valor;  // Atributo genérico del tipo T

public:
    void setValor(const T& v) { valor = v; }  // Asigna el valor
    T getValor() const { return valor; }      // Devuelve el valor almacenado
};

int main() {
    // Instanciación con tipo int
    Contenedor<int> entero;
    entero.setValor(42);
    std::cout << "Valor entero: " << entero.getValor() << "\n";

    // Instanciación con tipo std::string
    Contenedor<std::string> texto;
    texto.setValor("Hola mundo");
    std::cout << "Valor de texto: " << texto.getValor() << "\n";

    return 0;
}
```
* `template <typename T>` declara que la clase depende de un parámetro de tipo genérico `T`.
* `Contenedor<int>` y `Contenedor<std::string>` son **instancias concretas** de la plantilla.
* El compilador genera automáticamente el código específico para cada tipo utilizado.

Este proceso se denomina **instanciación de la plantilla**, y es la base de la **programación genérica** en C++ moderno.


## Características principales

* **Generación automática de código:** el compilador crea las versiones necesarias en función de los tipos utilizados.
* **Seguridad de tipo:** las operaciones se verifican en tiempo de compilación, evitando errores de conversión.
* **Reutilización sin pérdida de rendimiento:** las plantillas permiten escribir código genérico que se expande a código específico, evitando el coste del polimorfismo dinámico.
* **Separación de interfaz y tipo concreto:** los algoritmos o estructuras se diseñan de forma independiente al tipo de dato que manipulan.
* **Ubicación habitual:** las definiciones de plantillas suelen incluirse en archivos de encabezado (`.h` o `.hpp`), ya que el compilador necesita conocer su implementación completa al instanciarlas.

## Ejemplo completo

Veamos un ejemplo donde vamos a crear la plantilla `Acumulador<T>`:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <numeric>  // std::accumulate
#include <sstream>  // std::ostringstream

// Clase plantilla genérica para acumular y mostrar valores
template <typename T>
class Acumulador {
private:
    std::vector<T> datos;  // Contenedor interno

public:
    // Añade un valor
    void agregar(const T& valor) {
        datos.push_back(valor);
    }

    // Devuelve el número de elementos
    std::size_t tamano() const {
        return datos.size();
    }

    // Muestra todos los elementos
    void mostrar() const {
        std::cout << "[ ";
        for (const auto& x : datos)
            std::cout << x << ' ';
        std::cout << "]\n";
    }

    // Devuelve una representación textual del contenido
    std::string comoTexto() const {
        std::ostringstream os;
        for (const auto& x : datos)
            os << x << ' ';
        return os.str();
    }

    // Devuelve la suma o concatenación de los elementos (si el operador + está definido)
    T combinar() const {
        if (datos.empty())
            throw std::runtime_error("No hay elementos para combinar");
        return std::accumulate(std::next(datos.begin()), datos.end(), datos.front());
    }
};

int main() {
    // Acumulador de enteros
    Acumulador<int> numeros;
    numeros.agregar(10);
    numeros.agregar(20);
    numeros.agregar(30);
    numeros.mostrar();
    std::cout << "Suma total: " << numeros.combinar() << "\n\n";

    // Acumulador de cadenas
    Acumulador<std::string> textos;
    textos.agregar("Hola ");
    textos.agregar("mundo ");
    textos.agregar("C++");
    textos.mostrar();
    std::cout << "Concatenación: " << textos.combinar() << "\n\n";
}
```

* **Plantilla genérica única:** la clase `Acumulador<T>` funciona para cualquier tipo que soporte el operador `+`, sin usar especializaciones.
* **Uso de `std::accumulate`:** se aprovecha esta función estándar para sumar o concatenar los elementos del vector, según el tipo.
* **Estructura flexible:** la clase permite acumular datos, mostrarlos y combinarlos sin asumir el tipo concreto del contenido.
* **Diseño simple y extensible:** el código es compacto, reutilizable y se adapta automáticamente a distintos tipos (como `int` o `std::string`).
