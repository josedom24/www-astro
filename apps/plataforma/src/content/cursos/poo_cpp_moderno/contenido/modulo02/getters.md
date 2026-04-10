---
title: "Métodos getter y setter"
---

En diseño orientado a objetos, los atributos de una clase suelen declararse como **private** o **protected** para cumplir con el principio de **encapsulamiento**, impidiendo el acceso directo desde fuera de la clase.

Para acceder a ellos de forma controlada se utilizan:

* **Getters**: métodos que devuelven el valor de un atributo.
* **Setters**: métodos que permiten modificar el valor de un atributo, aplicando validaciones si es necesario.

## ¿Por qué no hacer los atributos públicos?

Exponer directamente los atributos rompe el **encapsulamiento** y permite estados inválidos:

```cpp
#include <string>
class Persona {
public:
    std::string nombre;
    int edad;
};

int main() {
    Persona persona;
    persona.edad = -99; // Estado inválido
    return 0;
}
```

En este caso, no existe ningún control que impida que un objeto tenga una edad negativa.

## Uso de getters y setters

Declarando los atributos como `private` y exponiendo funciones públicas de acceso y modificación, se protege el estado interno:

```cpp
#include <iostream>
#include <string>

class Persona {
private:
    std::string nombre;
    int edad;

public:
    // Getters: devuelven por referencia const para evitar copias
    const std::string& getNombre() const { return nombre; }
    int getEdad() const { return edad; }

    // Setters con validación
    void setNombre(const std::string& nuevoNombre) { nombre = nuevoNombre; }

    void setEdad(int nuevaEdad) {
        if (nuevaEdad >= 0) {
            edad = nuevaEdad;
        }
    }
};

int main() {
    Persona p;
    p.setNombre("Lucía");
    p.setEdad(28);

    std::cout << p.getNombre() << " tiene " << p.getEdad() << " años.\n";

    return 0;
}
```

* Los atributos son **privados**.
* El getter `getNombre()` devuelve por **referencia constante**, evitando copias innecesarias.
* El método `getEdad()` está marcado como **const**, ya que no modifica el estado del objeto.
* El setter `setEdad()` valida que la edad no sea negativa.

## Ventajas de getters y setters

* Permiten añadir **validación** antes de modificar un atributo.
* Facilitan **registrar cambios** (logs) o lanzar excepciones.
* Refuerzan el **principio de encapsulamiento**.
* Permiten aplicar **lógica de negocio** en el acceso a los atributos.

## Buenas prácticas

* Marcar los **getters como const**.
* Usar **referencias constantes** en getters para tipos complejos, evitando copias costosas.
* Implementar **validación en setters** para proteger la invariancia del objeto.
* **Evitar setters innecesarios**: si un atributo no debe cambiar tras inicializarse (por ejemplo, un identificador único), simplemente no se proporciona el setter.

