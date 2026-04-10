---
title: "Agregación entre clases"
---

La agregación es un **tipo particular de asociación** en programación orientada a objetos que representa una **relación débil y no exclusiva** entre dos clases. En esta relación, una clase (denominada **agregadora**) mantiene una referencia o vínculo hacia otra clase (denominada **agregada**), pero no asume la propiedad ni el control exclusivo sobre el ciclo de vida del objeto agregado.

En otras palabras:

* El objeto agregado puede existir independientemente del objeto agregador.
* La agregación implica una relación de "tiene un" o "usa un", pero sin una dependencia estricta en la existencia.
* La destrucción del objeto agregador no conlleva necesariamente la destrucción del objeto agregado.
* La relación es estructuralmente más estable que una dependencia simple, ya que el objeto agregador conserva una referencia o vínculo durante su vida útil.

Esta relación es útil para modelar escenarios en los que un objeto está compuesto o utiliza a otro, pero sin poseerlo en exclusiva ni encargarse de su ciclo de vida. Un ejemplo clásico es un vehículo que tiene un motor: el motor puede existir antes, después o incluso compartirse entre distintos vehículos.


## Agregación mediante referencias

El agregador recibe y almacena una referencia al objeto agregado, garantizando que siempre existe mientras el agregador está vivo.

```cpp
#include <iostream>

// Clase Motor
class Motor {
public:
    void arrancar() const {
        std::cout << "Motor arrancado.\n";
    }
};

// Clase Vehiculo que agrega Motor mediante referencia
class Vehiculo {
private:
    Motor& motor_;  // referencia, no propietario
public:
    // El constructor obliga a recibir una referencia válida a Motor
    Vehiculo(Motor& motor) : motor_(motor) {}

    void encender() const {
        motor_.arrancar();
    }
};

int main() {
    Motor motorPrincipal;      // Motor creado de forma independiente
    Vehiculo coche(motorPrincipal); // Vehículo con referencia al motor

    coche.encender();          // El coche utiliza el motor para arrancar

    return 0;
}
```

* Con referencia `Motor&` el **vehículo siempre tiene un motor válido**, no puede ser `nullptr`.
* La referencia no es constante, por lo que `Vehiculo` puede usar y modificar al `Motor`.
* La relación sigue siendo **agregación**: el `Vehiculo` no es dueño del `Motor`.
* La **vida del motor** está garantizada fuera de `Vehiculo`.
* Ventajas: La referencia siempre es válida y no puede ser nula.
* Desventajas: La referencia debe inicializarse obligatoriamente en el constructor.


### Agregación con punteros inteligentes no propietarios (std::weak_ptr)

La agregación no implica propiedad, por lo que se puede representar con `std::weak_ptr`, que mantiene una referencia débil sin afectar al conteo de referencias ni a la propiedad.

```cpp
#include <iostream>
#include <memory>

// Clase Motor
class Motor {
public:
    void arrancar() const {
        std::cout << "Motor arrancado.\n";
    }
};

// Clase Vehiculo que agrega Motor mediante weak_ptr (no propietario)
class Vehiculo {
private:
    std::weak_ptr<Motor> motor_;  // referencia débil, no propietaria
public:
    Vehiculo(std::shared_ptr<Motor> motor) : motor_(motor) {}

    void encender() const {
        if (auto motor_shared = motor_.lock()) {
            motor_shared->arrancar();
        } else {
            std::cout << "El motor ya no existe.\n";
        }
    }
};

int main() {
    std::shared_ptr<Motor> motor = std::make_shared<Motor>();

    Vehiculo coche(motor);   // El vehículo observa el motor (no lo posee)
    coche.encender();        // Motor arrancado
    motor.reset();           // Liberamos el motor explícitamente
    coche.encender();        // El motor ya no existe

    return 0;
}
```

* `Vehiculo` guarda un `std::weak_ptr<Motor>`, que **no incrementa el conteo de referencias**.
* El motor se gestiona con un `std::shared_ptr`, pero cuando se hace `motor.reset()`, el recurso se libera.
* `Vehiculo` evita el acceso a memoria inválida comprobando con `.lock()`, que devuelve un `shared_ptr` temporal si el motor aún existe.
* Ventajas: Seguridad frente a punteros colgantes y compatible con gestión automática de memoria.
* Desventajas: Requiere que el objeto agregado se gestione con `std::shared_ptr`.

