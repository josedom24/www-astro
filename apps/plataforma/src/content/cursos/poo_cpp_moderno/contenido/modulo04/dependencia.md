---
title: "Dependencia entre clases"
---

La dependencia es la relación más débil entre clases. Se da cuando una clase usa otra de forma puntual, normalmente como parte de la implementación de un método, sin conservarla como parte de su estado.

En otras palabras, una clase depende de otra si necesita conocerla para cumplir una tarea, pero no es dueña de ella ni la almacena.

Características principales:

* Relación temporal y local.
* Se describe como “usa”.
* No hay propiedad ni ciclo de vida compartido.
* Es común que un cambio en la clase usada afecte a la dependiente.

## Uso como parámetro

La forma más común de dependencia es recibir un objeto como argumento en un método:

```cpp
#include <iostream>
#include <string>

class Documento {
public:
    Documento(std::string texto) : texto_(texto) {}
    std::string obtenerTexto() const { return texto_; }

private:
    std::string texto_;
};

class Impresora {
public:
    // Dependencia puntual: recibe un Documento solo para imprimirlo
    void imprimir(const Documento& doc) const {
        std::cout << "Imprimiendo: " << doc.obtenerTexto() << "\n";
    }
};

int main() {
    Documento d("Informe mensual");
    Impresora impresora;
    impresora.imprimir(d); // relación de dependencia
    return 0;
}
```

En este ejemplo:

* `Impresora` depende de `Documento`, pero solo dentro del método `imprimir`.
* No existe un atributo de tipo `Documento` en la clase.
* El uso de `const Documento&` es eficiente y evita copias innecesarias.

## Uso local dentro de un método

Otra forma de dependencia es cuando una clase crea un objeto de otra clase solo dentro de un método.

```cpp
#include <iostream>
#include <string>

class Documento {
public:
    Documento(std::string texto) : texto_(texto) {}
    std::string obtenerTexto() const { return texto_; }

private:
    std::string texto_;
};

class Impresora {
public:
    void imprimir(const Documento& doc) const {
        std::cout << "Imprimiendo: " << doc.obtenerTexto() << "\n";
    }
};

class Aplicacion {
public:
    void generarYImprimir() const {
        Documento doc("Acta de la reunión"); // creado localmente
        Impresora impresora;                 // creado localmente
        impresora.imprimir(doc);             // uso inmediato
    }
};

int main() {
    Aplicacion app;
    app.generarYImprimir();
    return 0;
}
```

Aquí:

* `Aplicacion` usa `Documento` e `Impresora`, pero solo dentro del método `generarYImprimir`.
* No guarda referencias ni punteros a ellos.
* Al terminar el método, los objetos locales se destruyen automáticamente.

## Uso con punteros inteligentes temporales

En ocasiones, la dependencia se expresa con punteros o punteros inteligentes, cuando el recurso puede no existir o su ciclo de vida es breve.

```cpp
#include <iostream>
#include <memory>
#include <string>

class Documento {
public:
    Documento(std::string texto) : texto_(std::move(texto)) {
        std::cout << "Documento creado: " << texto_ << "\n";
    }
    ~Documento() {
        std::cout << "Documento destruido: " << texto_ << "\n";
    }
    std::string obtenerTexto() const { return texto_; }

private:
    std::string texto_;
};

class Impresora {
public:
    // Dependencia temporal con shared_ptr
    void imprimir(std::shared_ptr<Documento> doc) const {
        if (doc) {
            std::cout << "Imprimiendo documento: " << doc->obtenerTexto() << "\n";
        }
    }
};

class Aplicacion {
public:
    void ejecutar() const {
        auto doc = std::make_shared<Documento>("Reporte trimestral");
        Impresora impresora;
        impresora.imprimir(doc); // dependencia puntual
    }
};

int main() {
    Aplicacion app;
    app.ejecutar();
    std::cout << "Fin de main\n";
    return 0;
}
```

En este caso:

* `Impresora` depende de `Documento`, pero no lo almacena, solo lo usa mientras dura la llamada.
* `Aplicacion` crea un `shared_ptr` temporal y lo pasa a `imprimir`.
* El documento se libera automáticamente cuando el último `shared_ptr` que lo referencia desaparece.

