---
title: "Clases y punteros inteligentes"
---

Los punteros inteligentes no solo se utilizan con tipos primitivos, sino también con **clases**. De hecho, son una de las formas más seguras y expresivas de gestionar **objetos dinámicos** en la programación orientada a objetos moderna.

Cuando un puntero inteligente gestiona un objeto de una clase:

* Se usa el operador `->` para acceder a sus métodos y atributos.
* La memoria del objeto se libera automáticamente al finalizar su ámbito.

## Uso de `std::unique_ptr` con clases

`std::unique_ptr` representa **propiedad exclusiva** sobre el objeto.
Solo un puntero puede poseer la instancia, lo que lo hace ideal para clases que no deben compartirse.

```cpp
#include <iostream>
#include <memory>

class Dispositivo {
public:
    void encender() const {
        std::cout << "Dispositivo encendido\n";
    }
    void apagar() const {
        std::cout << "Dispositivo apagado\n";
    }
};

int main() {
    // Creación de un objeto dinámico de tipo Dispositivo
    std::unique_ptr<Dispositivo> d = std::make_unique<Dispositivo>();

    // Acceso a métodos mediante ->
    d->encender();
    d->apagar();

    // No es necesario liberar memoria manualmente
    return 0; // d se destruye y libera automáticamente el objeto
}
```

* `std::make_unique<Dispositivo>()` reserva memoria y construye el objeto.
* `d->encender()` accede al método del objeto gestionado.
* No se requiere `delete`, ya que la liberación es automática.
* Si se desea transferir la propiedad, debe hacerse mediante `std::move`.

## Uso de `std::shared_ptr` con clases

Cuando varios objetos necesitan **compartir una misma instancia**, se emplea `std::shared_ptr`.
Cada copia incrementa un contador de referencias y la memoria se libera cuando dicho contador llega a cero.

```cpp
#include <iostream>
#include <memory>
#include <string>

class Usuario {
    std::string nombre;
public:
    explicit Usuario(std::string n) : nombre(std::move(n)) {}
    void saludar() const {
        std::cout << "Hola, soy " << nombre << '\n';
    }
};

int main() {
    std::shared_ptr<Usuario> u1 = std::make_shared<Usuario>("Ana");
    std::shared_ptr<Usuario> u2 = u1;  // Ambos comparten el mismo objeto

    u1->saludar();
    u2->saludar();

    std::cout << "Número de referencias: " << u1.use_count() << '\n';

    return 0; // El objeto se destruye cuando el contador llega a cero
}

```

* Ambos punteros (`u1` y `u2`) apuntan al mismo objeto `Usuario`.
* El método `use_count()` indica cuántos `shared_ptr` comparten la instancia.
* Cuando el último puntero desaparece, el objeto se destruye automáticamente.

