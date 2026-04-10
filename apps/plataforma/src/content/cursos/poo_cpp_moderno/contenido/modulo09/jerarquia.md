---
title: "Clases base y derivadas: diseño de la jerarquía de dispositivos"
---

El primer paso en la construcción del sistema es definir la **jerarquía de clases** que representará los diferentes tipos de dispositivos.
Partimos del principio de **programar a una interfaz, no a una implementación**, de modo que todas las clases concretas compartan un comportamiento común definido en una **clase base abstracta**.

## Clase base `Dispositivo`

Todos los sensores y actuadores comparten un conjunto mínimo de características:

* Tienen un **nombre** que los identifica.
* Pueden **mostrar información básica** sobre sí mismos.
* Se destruyen de forma segura mediante **herencia polimórfica** (destructor virtual).

Para capturar este comportamiento común, definimos la clase `Dispositivo` como una **clase abstracta**, con al menos un método virtual puro.

```cpp
#include <iostream>
#include <string>

// Clase base abstracta
class Dispositivo {
protected:
    std::string nombre;  // Atributo común a todos los dispositivos

public:
    // Constructor explícito que inicializa el nombre
    explicit Dispositivo(std::string n) : nombre(std::move(n)) {}

    // Destructor virtual para permitir destrucción polimórfica
    virtual ~Dispositivo() = default;

    // Método virtual puro: cada tipo de dispositivo implementará su propia versión
    virtual void mostrarInfo() const = 0;
};
```

* La clase define una **interfaz común** para todos los dispositivos.
* `virtual ~Dispositivo()` garantiza la destrucción correcta cuando se usa un puntero a la clase base.
* El método `mostrarInfo()` es **virtual puro**, por lo que `Dispositivo` no puede instanciarse directamente.


## Clase derivada `Sensor`

Un **sensor** es un tipo de dispositivo que puede realizar **lecturas de valores**.
En este proyecto, simularemos esas lecturas de forma aleatoria, usando `std::optional<double>` para representar el posible fallo de una lectura.

```cpp
#include <optional>
#include <cstdlib> // rand()
#include <ctime>   // time()

class Sensor : public Dispositivo {
public:
    using Lectura = std::optional<double>;

    explicit Sensor(const std::string& n)
        : Dispositivo(n) {}

    // Simula la lectura de un valor, con un 10% de probabilidad de fallo
    Lectura leer() const {
        double valor = rand() % 100;
        if (valor < 90)  // 90% de éxito
            return valor;
        else
            return std::nullopt;  // Lectura fallida
    }

    void mostrarInfo() const override {
        std::cout << "Sensor: " << nombre << '\n';
    }
};
```

* `std::optional` permite expresar de forma segura que una lectura puede **no devolver valor**.
* La clase hereda de `Dispositivo` y redefine el método `mostrarInfo()`.
* No es necesario liberar recursos manualmente, gracias al principio **RAII**: el destructor de `Sensor` se ejecutará automáticamente.

## Clase derivada `Actuador`

Un **actuador** ejecuta una acción concreta, que puede variar según el tipo de dispositivo.
Para hacerlo más flexible, el comportamiento se define mediante una **función inyectada** en el constructor, usando `std::function<void()>`.
Esto permite usar **expresiones lambda** para configurar el comportamiento sin crear nuevas subclases.

```cpp
#include <functional>

class Actuador : public Dispositivo {
    std::function<void()> accion;  // Función que define el comportamiento
public:
    Actuador(const std::string& n, std::function<void()> a)
        : Dispositivo(n), accion(std::move(a)) {}

    void activar() const {
        if (accion)
            accion();  // Ejecuta la acción definida
    }

    void mostrarInfo() const override {
        std::cout << "Actuador: " << nombre << '\n';
    }
};
```
* `std::function<void()>` permite almacenar **cualquier función o lambda** que no devuelva valor.
* La acción puede definirse en tiempo de ejecución, ofreciendo **comportamiento dinámico**.
* Esta técnica ejemplifica la **inyección de comportamiento mediante composición**, más flexible que la herencia pura.

## Ejemplo de uso

A continuación se muestra un programa que crea y utiliza objetos de tipo `Sensor` y `Actuador` a través de punteros a la clase base `Dispositivo`.
Esto demuestra el **polimorfismo dinámico** en acción.

```cpp
#include <memory>
#include <vector>

int main() {
    srand(static_cast<unsigned>(time(nullptr))); // Inicializa el generador aleatorio

    std::vector<std::unique_ptr<Dispositivo>> dispositivos;

    // Agregar sensores
    dispositivos.push_back(std::make_unique<Sensor>("Temperatura"));
    dispositivos.push_back(std::make_unique<Sensor>("Humedad"));

    // Agregar actuador con una acción lambda
    dispositivos.push_back(std::make_unique<Actuador>(
        "Alarma", []() { std::cout << "¡Alarma activada!\n"; }));

    // Mostrar información de todos los dispositivos
    for (const auto& d : dispositivos) {
        d->mostrarInfo();

        if (auto s = dynamic_cast<Sensor*>(d.get())) {
            auto lectura = s->leer();
            if (lectura)
                std::cout << " Lectura: " << *lectura << '\n';
            else
                std::cout << " Error de lectura.\n";
        }
        else if (auto a = dynamic_cast<Actuador*>(d.get())) {
            a->activar();
        }
    }
}
```
* Los objetos se almacenan en un contenedor de `std::unique_ptr<Dispositivo>`, aplicando **RAII** y **propiedad exclusiva**.
* El uso de `dynamic_cast` permite identificar el tipo concreto del dispositivo en tiempo de ejecución.
* Las acciones del actuador se definen mediante **lambdas**, inyectando comportamiento dinámicamente.

## Resumen

* Se ha diseñado una jerarquía de clases clara y extensible.
* El polimorfismo permite tratar sensores y actuadores de forma uniforme.
* Se han aplicado herramientas modernas de C++:

  * **`std::optional`** para lecturas seguras,
  * **`std::function` y lambdas** para comportamiento flexible,
  * **punteros inteligentes** para gestionar la memoria.

En el siguiente apartado construiremos la clase `Controlador`, que gestionará los dispositivos de forma centralizada aplicando composición, RAII y punteros inteligentes.

