---
title: "Integración en un programa principal"
---

Hasta ahora hemos construido un sistema completo formado por:

* Una **jerarquía polimórfica de dispositivos** (`Dispositivo`, `Sensor`, `Actuador`);
* Un **controlador central** (`Controlador`) que los gestiona mediante composición y RAII;
* Un **mecanismo de eventos genéricos** (`EventoLectura`, `EventoError`, `EventoAccion`) procesados con `std::variant` y `std::visit`.

En este apartado reuniremos todos estos componentes en un **programa principal interactivo**, que permitirá ejecutar acciones desde un **menú simple**.

## Estructura final del proyecto

```
/proyecto_dispositivos
│
├── Dispositivos.h
├── Controlador.h
├── Eventos.h
└── main.cpp
```

## Programa principal: `main.cpp`

El programa ofrece un pequeño menú para:

1. Mostrar los dispositivos registrados.
2. Leer los sensores.
3. Activar los actuadores.
4. Procesar los eventos generados.
5. Salir del sistema.

Esto permite observar el funcionamiento completo del sistema paso a paso.

```cpp
#include "Controlador.h"
#include "Eventos.h"
#include <vector>
#include <ctime>

void mostrarMenu() {
    std::cout << "\n===== Sistema de Dispositivos Inteligentes =====\n";
    std::cout << "1. Mostrar dispositivos registrados\n";
    std::cout << "2. Leer sensores\n";
    std::cout << "3. Activar actuadores\n";
    std::cout << "4. Procesar eventos\n";
    std::cout << "0. Salir\n";
    std::cout << "Seleccione una opción: ";
}

int main() {
    srand(static_cast<unsigned>(time(nullptr)));

    Controlador controlador;
    std::vector<Evento> eventos; // Registro de sucesos del sistema

    // --- Registro inicial de dispositivos ---
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de temperatura"));
    controlador.agregarDispositivo(std::make_unique<Sensor>("Sensor de humedad"));

    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Ventilador", [&eventos] {
            std::cout << "Ventilador encendido\n";
            eventos.push_back(EventoAccion{"Ventilador"});
        }));

    controlador.agregarDispositivo(std::make_unique<Actuador>(
        "Alarma", [&eventos] {
            std::cout << "Alarma activada\n";
            eventos.push_back(EventoAccion{"Alarma"});
        }));

    int opcion = -1;
    do {
        mostrarMenu();
        std::cin >> opcion;

        switch (opcion) {
            case 1:
                controlador.mostrarDispositivos();
                break;

            case 2:
                std::cout << "\n--- Lectura de sensores ---\n";
                for (const auto& d : controlador.getDispositivos()) {
                    if (auto s = dynamic_cast<Sensor*>(d.get())) {
                        auto lectura = s->leer();
                        if (lectura)
                            eventos.push_back(EventoLectura{s->getNombre(), *lectura});
                        else
                            eventos.push_back(EventoError{s->getNombre()});
                    }
                }
                break;

            case 3:
                std::cout << "\n--- Activación de actuadores ---\n";
                controlador.activarActuadores();
                break;

            case 4:
                std::cout << "\n--- Procesamiento de eventos ---\n";
                for (const auto& e : eventos)
                    procesarEvento(e);
                break;

            case 0:
                std::cout << "Saliendo del sistema...\n";
                break;

            default:
                std::cout << "Opción no válida.\n";
                break;
        }

    } while (opcion != 0);

    return 0;
}
``` 

* **Inicialización del sistema**: Se crean los dispositivos iniciales y se registran en el controlador. Los actuadores usan lambdas que añaden un `EventoAccion` cuando se activan.
* **Menú principal**:
   * Opción 1: muestra la lista de dispositivos registrados.
   * Opción 2: realiza lecturas de los sensores, generando `EventoLectura` o `EventoError`.
   * Opción 3: activa los actuadores, ejecutando sus lambdas configuradas.
   * Opción 4: recorre el vector de eventos y los procesa con `procesarEvento()`.
   * Opción 0: finaliza el programa.
* **Gestión de eventos**:
   Todos los sucesos (lecturas, errores o acciones) se registran en el vector `eventos`, que puede procesarse en cualquier momento.

## Conclusión

La incorporación de un menú convierte el sistema en una **aplicación interactiva**, reforzando los conceptos clave de POO moderna:

| Concepto                        | Aplicación                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| **Encapsulación y RAII**        | El controlador gestiona los dispositivos y su ciclo de vida.                       |
| **Polimorfismo dinámico**       | Los sensores y actuadores se tratan de forma uniforme.                             |
| **Inyección de comportamiento** | Los actuadores ejecutan acciones definidas con lambdas.                            |
| **Polimorfismo estático**       | Los eventos se gestionan mediante `std::variant` y `std::visit`.                   |
| **Modularidad**                 | Cada componente (dispositivo, controlador, evento) se define en su propio archivo. |

Este menú marca el cierre natural del proyecto: un sistema completo, seguro, extensible y **plenamente coherente con los principios de diseño moderno en C++**.
