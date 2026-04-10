---
title: "Implementación del controlador del sistema"
---

En este apartado construiremos la clase **`Controlador`**, encargada de **gestionar y coordinar** los distintos dispositivos del sistema (sensores y actuadores).
Para mantener el proyecto bien organizado, trabajaremos con varios archivos, reutilizando el código ya creado en el apartado anterior.

## Estructura del proyecto

```
/proyecto_dispositivos
│
├── Dispositivos.h    contiene la jerarquía de clases (vista en el apartado 9.2)
├── Controlador.h     definición de la clase Controlador
└── main.cpp          programa principal
```

## Archivo `Dispositivos.h`

En este fichero encontramos la jerarquía de clases definida en el apartado anterior:

* `Dispositivo`: clase base abstracta.
* `Sensor`: clase derivada que realiza lecturas con posible error (`std::optional`).
* `Actuador`: clase derivada que ejecuta acciones configurables mediante `std::function`.

## Archivo `Controlador.h`

Este archivo define la clase `Controlador`, que **mantiene un conjunto de dispositivos** (sensores y actuadores) y ofrece métodos para gestionarlos.
Además, se añade el método `getDispositivos()` que permite obtener una referencia constante al vector interno, útil para futuras ampliaciones del sistema (por ejemplo, el manejo de eventos genéricos en el siguiente apartado).

```cpp
#ifndef CONTROLADOR_H
#define CONTROLADOR_H

#include "Dispositivos.h"
#include <vector>
#include <memory>

class Controlador {
private:
    std::vector<std::unique_ptr<Dispositivo>> dispositivos;

public:
    // Agrega un dispositivo al sistema
    void agregarDispositivo(std::unique_ptr<Dispositivo> d) {
        dispositivos.push_back(std::move(d));
    }

    // Devuelve una referencia constante a la colección de dispositivos
    const std::vector<std::unique_ptr<Dispositivo>>& getDispositivos() const {
        return dispositivos;
    }

    // Muestra información general de todos los dispositivos
    void mostrarDispositivos() const {
        std::cout << "\n--- Dispositivos registrados ---\n";
        for (const auto& d : dispositivos)
            d->mostrarInfo();
    }

    // Ejecuta las lecturas de todos los sensores registrados
    void leerSensores() const {
        std::cout << "\n--- Lectura de sensores ---\n";
        for (const auto& d : dispositivos) {
            if (auto s = dynamic_cast<Sensor*>(d.get())) {
                auto lectura = s->leer();
                if (lectura)
                    std::cout << s->getNombre() << ": " << *lectura << '\n';
                else
                    std::cout << s->getNombre() << ": error de lectura\n";
            }
        }
    }

    // Activa todos los actuadores del sistema
    void activarActuadores() const {
        std::cout << "\n--- Activación de actuadores ---\n";
        for (const auto& d : dispositivos) {
            if (auto a = dynamic_cast<Actuador*>(d.get()))
                a->activar();
        }
    }
};

#endif // CONTROLADOR_H
```

* `std::vector<std::unique_ptr<Dispositivo>>`: almacena punteros inteligentes a los dispositivos, garantizando la liberación automática de memoria.
* `agregarDispositivo()`: añade un nuevo dispositivo al sistema transfiriendo su propiedad mediante `std::move()`.
* `getDispositivos()`: devuelve una referencia constante al vector interno, **sin permitir modificación**, pero posibilitando su uso externo para inspección o iteración.
* `mostrarDispositivos()`: recorre todos los dispositivos y llama al método virtual `mostrarInfo()`.
* `leerSensores()`: usa `dynamic_cast` para identificar si un dispositivo es un `Sensor` y obtener su lectura de forma segura.
* `activarActuadores()`: identifica los objetos del tipo `Actuador` y ejecuta la acción configurada con una lambda.

## Archivo `main.cpp`

El programa principal crea el controlador, registra varios dispositivos y ejecuta sus operaciones principales.

```cpp
#include "Controlador.h"
#include <ctime>

int main() {
    srand(static_cast<unsigned>(time(nullptr))); // Inicializa el generador aleatorio

    Controlador controlador;

    // --- Registro de dispositivos ---
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de temperatura"));
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de humedad"));

    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Ventilador", [] { std::cout << "Ventilador encendido\n"; }));

    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Alarma", [] { std::cout << "Alarma activada\n"; }));

    // --- Operaciones principales ---
    controlador.mostrarDispositivos();
    controlador.leerSensores();
    controlador.activarActuadores();

    return 0;
}
```

* `srand(static_cast<unsigned>(time(nullptr)))`: inicializa el generador aleatorio usado por los sensores para simular lecturas.
* `Controlador controlador;`: instancia principal del sistema encargado de gestionar todos los dispositivos.
* `std::make_unique`: crea punteros inteligentes sin necesidad de usar `new`, garantizando seguridad y claridad.
* `std::move`: transfiere la propiedad del recurso al vector interno del controlador.
* `[] { ... }`: lambdas que definen el comportamiento de cada actuador (por ejemplo, “encender ventilador” o “activar alarma”).

