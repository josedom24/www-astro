---
title: "Manejo de eventos genéricos mediante `std::variant` y `std::visit`"
---

Hasta ahora, el sistema está formado por una jerarquía de clases (`Dispositivo`, `Sensor`, `Actuador`) gestionadas por la clase `Controlador`.
Cada tipo de dispositivo tiene su comportamiento específico, implementado mediante **herencia** y **métodos virtuales**.

En este apartado introduciremos una alternativa **moderna y flexible** para manejar información diversa: los **eventos genéricos** representados con `std::variant` y procesados con `std::visit`.

Esta técnica permite **unificar distintos tipos de datos** en una sola variable, garantizando seguridad de tipo en tiempo de compilación, sin necesidad de una jerarquía de clases adicional.

## Objetivo

Modelar distintos **eventos del sistema** —como lecturas de sensores, errores o acciones ejecutadas— mediante un único tipo genérico (`Evento`) que pueda contener uno de varios tipos concretos.

Posteriormente, todos estos eventos se procesarán de forma centralizada mediante `std::visit`.

## Definición de eventos

Creamos una cabecera llamada `Eventos.h` que define los posibles tipos de evento y su manejo.

```cpp
#ifndef EVENTOS_H
#define EVENTOS_H

#include <string>
#include <variant>
#include <iostream>

// ---------------------------------------------------------------------------
// Tipos de eventos concretos
// ---------------------------------------------------------------------------

struct EventoLectura {
    std::string nombre;
    double valor;
};

struct EventoError {
    std::string nombre;
};

struct EventoAccion {
    std::string nombre;
};

// Variante
using Evento = std::variant<EventoLectura, EventoError, EventoAccion>;

// ---------------------------------------------------------------------------
// Procesa cada evento
// ---------------------------------------------------------------------------
struct ProcesadorEventos {
    void operator()(const EventoLectura& ev) const {
        std::cout << "[Lectura] " << ev.nombre << ": " << ev.valor << '\n';
    }

    void operator()(const EventoError& ev) const {
        std::cout << "[Error] Fallo en " << ev.nombre << '\n';
    }

    void operator()(const EventoAccion& ev) const {
        std::cout << "[Acción] " << ev.nombre << " ejecutado\n";
    }
};

// ---------------------------------------------------------------------------
// Función que procesa eventos genéricos mediante std::visit
// ---------------------------------------------------------------------------
void procesarEvento(const Evento& e) {
    std::visit(ProcesadorEventos{}, e);
}

#endif // EVENTOS_H
```

* Se definen **tres estructuras simples** que modelan distintos eventos del sistema: `EventoLectura`, `EventoError` y `EventoAccion`.
* `using Evento = std::variant<...>` crea un tipo genérico que puede contener cualquiera de esos tres.
* `std::visit()` ejecuta sobre el evento el functor `ProcesadorEventos{}`, que ha sobreescrito el `operator()` según el tipo de evento que reciba.
* Según el tipo real contenido en el `std::variant`, C++ llama automáticamente al `operator()` correspondiente:

## Integración con el sistema

Podemos usar estos eventos para **registrar o notificar lo que ocurre** al interactuar con los sensores y actuadores definidos en los apartados anteriores.

Por ejemplo, podemos registrar los eventos generados por el controlador en el archivo `main.cpp`:

```cpp
#include "Controlador.h"
#include "Eventos.h"
#include <vector>
#include <ctime>

int main() {
    srand(static_cast<unsigned>(time(nullptr)));

    Controlador controlador;
    std::vector<Evento> eventos; // Almacena los eventos generados

    // --- Registro de dispositivos ---
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de temperatura"));
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de humedad"));
    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Ventilador", [&eventos] {
            eventos.push_back(EventoAccion{"Ventilador"});
        }));
    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Alarma", [&eventos] {
            eventos.push_back(EventoAccion{"Alarma"});
        }));

    // --- Simulación de lecturas y activación de actuadores ---
    std::cout << "\n--- Lecturas de sensores ---\n";
    for (const auto& d : controlador.getDispositivos()) {
        if (auto s = dynamic_cast<Sensor*>(d.get())) {
            auto lectura = s->leer();
            if (lectura)
                eventos.push_back(EventoLectura{s->getNombre(), *lectura});
            else
                eventos.push_back(EventoError{s->getNombre()});
        }
        else if (auto a = dynamic_cast<Actuador*>(d.get())) {
            a->activar();
        }   
    }

    // --- Procesamiento de eventos ---
    std::cout << "\n--- Procesamiento de eventos ---\n";
    for (const auto& e : eventos)
        procesarEvento(e);

    return 0;
}
```

* Se añade un **vector de eventos** que almacena los sucesos ocurridos durante la ejecución.
* Los **sensores** generan:
  * `EventoLectura` si la lectura es exitosa.
  * `EventoError` si falla.
* Los **actuadores** ejecutan lambdas que **emiten un `EventoAccion`** al ser activados.
* Finalmente, el sistema recorre el vector `eventos` y llama a `procesarEvento()` para mostrar los resultados.


