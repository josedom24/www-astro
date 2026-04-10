---
title: "Conversión segura de tipos polimórficos con `dynamic_cast`"
---

En una jerarquía de clases con herencia y polimorfismo, es frecuente que un mismo puntero o referencia de tipo base apunte a objetos de distintas clases derivadas.
En algunas situaciones concretas puede ser necesario **comprobar el tipo dinámico del objeto** y convertirlo de forma segura a su tipo derivado real.

Para ello, C++ proporciona el operador **`dynamic_cast`**, que realiza **conversiones polimórficas en tiempo de ejecución**, garantizando la seguridad del tipo.

`dynamic_cast` se usa para convertir punteros o referencias **desde una clase base hacia una clase derivada** cuando no se conoce con certeza el tipo real del objeto.

Solo se puede aplicar a clases **polimórficas**, es decir, aquellas que tienen **al menos un método virtual**.

## Sintaxis general

```cpp
dynamic_cast<tipo_derivado*>(puntero_base);
dynamic_cast<tipo_derivado&>(referencia_base);
```

* Si la conversión es válida:
  * Devuelve un puntero o referencia al tipo derivado.
* Si la conversión **no es válida**:
  * Devuelve `nullptr` (en el caso de punteros).
  * Lanza una excepción `std::bad_cast` (en el caso de referencias).


## Ejemplo con punteros

```cpp
#include <iostream>
#include <memory>

class Sensor {
public:
    // Método virtual 
    virtual void leer() const {
        std::cout << "Leyendo sensor genérico...\n";
    }

    virtual ~Sensor() = default;
};

class SensorTemperatura : public Sensor {
public:
    void leer() const override {
        std::cout << "Leyendo temperatura...\n";
    }
    void calibrar() const {
        std::cout << "Calibrando sensor de temperatura.\n";
    }
};

class SensorHumedad : public Sensor {
public:
    void leer() const override {
        std::cout << "Leyendo humedad...\n";
    }
};

int main() {
    std::unique_ptr<Sensor> sensor = std::make_unique<SensorTemperatura>();

    // Conversión segura desde base a derivada
    if (auto temp = dynamic_cast<SensorTemperatura*>(sensor.get())) {
        temp->leer();       // Correcto
        temp->calibrar();   // Acceso a métodos propios del derivado
    } else {
        std::cout << "El objeto no es un SensorTemperatura.\n";
    }

    return 0;
}

```

* `Sensor` es una clase base **polimórfica** (posee al menos un método `virtual`).
* `sensor` es un `unique_ptr<Sensor>` que apunta a un objeto `SensorTemperatura`.
* `dynamic_cast<SensorTemperatura*>(sensor.get())` comprueba en tiempo de ejecución si el objeto apuntado es realmente un `SensorTemperatura`.
* Si lo es, devuelve un puntero válido al tipo derivado; si no, devuelve `nullptr`.
* Si no convertimos `sensor` al tipo de la base derivada `SensorTemperatura` no podríamos usar su método `calibrar()`.


## Ejemplo con referencias

```cpp
#include <iostream>
#include <typeinfo>

class Dispositivo {
public:
    virtual void info() const { std::cout << "Dispositivo genérico\n"; }
    virtual ~Dispositivo() = default;
};

class Camara : public Dispositivo {
public:
    void info() const override { std::cout << "Cámara de seguridad\n"; }
};

void procesar(Dispositivo& d) {
    try {
        Camara& c = dynamic_cast<Camara&>(d);
        c.info();
    } catch (const std::bad_cast& e) {
        std::cout << "Conversión fallida: " << e.what() << '\n';
    }
}

int main() {
    Camara cam;
    Dispositivo base;
    procesar(cam);   // Conversión válida
    procesar(base);  // Conversión inválida: lanza std::bad_cast
}
```
* `Dispositivo` es una clase base **polimórfica** (tiene un método `virtual`).
* `Camara` hereda de `Dispositivo` y redefine el método `info()`.
* En `procesar()`, `dynamic_cast<Camara&>(d)` intenta convertir la referencia a `Camara`.
* Si el objeto referenciado **es una `Camara`**, la conversión tiene éxito.
* Si no lo es, **lanza una excepción** `std::bad_cast`, que se captura en el bloque `catch`.
