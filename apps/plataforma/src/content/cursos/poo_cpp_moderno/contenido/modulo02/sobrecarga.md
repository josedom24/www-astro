---
title: "Polimorfismo estático: sobrecarga de métodos"
---

El término **polimorfismo** proviene del griego y significa “muchas formas”. En programación orientada a objetos, se refiere a la capacidad de utilizar el mismo nombre para representar múltiples comportamientos diferentes.

Existen dos tipos principales de polimorfismo en C++:

* **Polimorfismo estático**: se resuelve en tiempo de compilación. Se logra mediante la sobrecarga de funciones o métodos y el uso de plantillas.
* **Polimorfismo dinámico**: se resuelve en tiempo de ejecución. Se logra mediante herencia y métodos virtuales.

En este apartado nos centraremos en el **polimorfismo estático aplicado a la sobrecarga de métodos**, es decir, cuando una clase define varias funciones con el mismo nombre pero distinta lista de parámetros.

Características principales:

* El compilador decide en tiempo de compilación qué versión del método debe ejecutarse según el número y tipo de los parámetros.
* No hay coste adicional en tiempo de ejecución.
* Facilita la legibilidad al permitir usar un mismo nombre para operaciones conceptualmente relacionadas.

## Ejemplo: sobrecarga de métodos en una clase

```cpp
#include <iostream>
#include <string>

class Mensaje {
private:
    std::string texto_;

public:
    // Constructor para inicializar el texto del mensaje
    Mensaje(const std::string& texto) : texto_(texto) {}

    // Sobrecarga de métodos mostrar()

    // Versión sin parámetros
    void mostrar() const {
        std::cout << "Mensaje: " << texto_ << std::endl;
    }

    // Versión con parámetro entero: repite el mensaje varias veces
    void mostrar(int veces) const {
        for (int i = 0; i < veces; ++i) {
            std::cout << "Mensaje (" << i + 1 << "): " << texto_ << std::endl;
        }
    }

    // Versión con parámetro string: añade un prefijo al mensaje
    void mostrar(const std::string& prefijo) const {
        std::cout << prefijo << ": " << texto_ << std::endl;
    }
};

int main() {
    Mensaje m("Hola mundo");

    m.mostrar();                   // Llama a la versión sin parámetros
    m.mostrar(3);                   // Llama a la versión con un entero
    m.mostrar("Aviso importante");  // Llama a la versión con un string

    return 0;
}
```

* La clase `Mensaje` define **tres versiones** del método `mostrar()`.
* El compilador decide cuál ejecutar según los argumentos proporcionados.
  * `m.mostrar();`: sin parámetros.
  * `m.mostrar(3);`: con entero.
  * `m.mostrar("Aviso importante");`: con string.
* Todas las funciones se agrupan bajo el mismo nombre porque expresan la misma acción: “mostrar” un mensaje, pero en formas distintas.

## Consideraciones importantes

* Dos métodos sobrecargados deben diferenciarse por el número o tipo de parámetros.
* No se puede diferenciar solo por el tipo de retorno.
* La sobrecarga es muy útil para mantener una **interfaz clara y coherente**, evitando nombres distintos para operaciones conceptualmente iguales.

