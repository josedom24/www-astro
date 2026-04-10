---
title: "Asociaciones entre clases"
---

Una **relación estructural** en programación orientada a objetos es una **relación estable y duradera entre clases o sus instancias**, que forma parte de la estructura del sistema.
En otras palabras: una relación estructural expresa **cómo se conectan los objetos dentro del modelo y cómo una clase mantiene referencias o vínculos hacia otras**.

Una **asociación** es una relación estructural entre dos clases en la que una clase conoce o mantiene un vínculo hacia otra. Esta relación **no implica necesariamente propiedad** sobre el objeto asociado, sino simplemente una conexión estable a lo largo del tiempo.

Las asociaciones son la **base de las relaciones estructurales** en un sistema orientado a objetos, y de ellas se derivan formas más específicas:

* **Agregación**: el objeto asociado puede existir independientemente del contenedor (relación débil).
* **Composición**: el objeto asociado depende completamente del contenedor (relación fuerte).

Ejemplos de asociaciones típicas:

* Un pedido está vinculado a un cliente.
* Un alumno pertenece a una clase.
* Un coche tiene asignado un conductor.

En los apartados siguientes profundizaremos en estas formas particulares de asociación.

## Asociación mediante punteros inteligentes (`std::shared_ptr`)

En C++ moderno, las asociaciones entre clases que implican **compartición de propiedad** se implementan de forma segura mediante **punteros inteligentes con conteo de referencias**, concretamente con `std::shared_ptr`.

Este tipo de asociación es apropiado cuando **varios objetos necesitan acceder y conservar una referencia válida al mismo recurso**, garantizando que el recurso **permanece vivo mientras exista al menos un propietario**.

Este modelo resulta especialmente útil para representar **asociaciones no jerárquicas** en las que distintos objetos **cooperan sobre el mismo recurso sin un único propietario claro**.

Por ejemplo, un **pedido** puede estar asociado a un **cliente**, y múltiples pedidos pueden compartir el mismo cliente sin duplicar ni gestionar manualmente su memoria.
La propiedad del cliente se mantiene compartida entre todas las instancias interesadas, y el recurso se libera automáticamente cuando ya no es necesario.

El siguiente ejemplo ilustra esta forma de asociación mediante `std::shared_ptr`:

```cpp
#include <iostream>
#include <memory>
#include <string>

class Cliente {
public:
    Cliente(std::string nombre) : nombre_(std::move(nombre)) {}
    std::string obtenerNombre() const { return nombre_; }
private:
    std::string nombre_;
};

class Pedido {
public:
    Pedido(int id, std::shared_ptr<Cliente> cliente) 
        : id_(id), cliente_(std::move(cliente)) {}

    void mostrar() const {
        if (cliente_) {
            std::cout << "Pedido " << id_ << " para cliente " 
                      << cliente_->obtenerNombre() << "\n";
        }
    }

private:
    int id_;
    std::shared_ptr<Cliente> cliente_; // asociación compartida
};

int main() {
    auto c = std::make_shared<Cliente>("Luis");
    Pedido p(456, c);
    p.mostrar();

    // Tanto 'c' como 'p' comparten la propiedad del cliente
    return 0;
}
```

En este caso:

* `Pedido` y el puntero `c` comparten el mismo objeto `Cliente`.
* El cliente se destruye automáticamente cuando ya no queda ninguna referencia activa.
* La relación modela una **asociación propietaria compartida**, segura y sin gestión manual de memoria.


## Asociación mediante referencias

En ciertos casos, la relación entre clases puede representarse de forma más **directa y eficiente** mediante **referencias**.
Este enfoque es adecuado cuando la **asociación es obligatoria**, es decir, el objeto asociado **debe existir siempre** mientras la clase asociada esté viva, y no se requiere compartir ni transferir propiedad del recurso.

El uso de referencias en C++ (`T&` o `const T&`) permite expresar una **relación estructural fuerte pero no propietaria**:

* La clase mantiene acceso permanente al objeto asociado.
* Se garantiza que la referencia **no puede ser nula**, evitando verificaciones de validez en tiempo de ejecución.
* La **gestión del ciclo de vida** recae en otro contexto (normalmente en quien crea los objetos), ya que la clase que mantiene la referencia **no destruye** el recurso asociado.

Este tipo de asociación es útil cuando se desea **asegurar la existencia y estabilidad** del vínculo sin introducir sobrecarga ni semántica de propiedad.
Por ejemplo, un **pedido** puede hacer referencia a un **cliente existente**, con la certeza de que el cliente estará disponible durante toda la vida del pedido.

El siguiente ejemplo ilustra este tipo de asociación:

```cpp
#include <iostream>
#include <string>

class Cliente {
public:
    Cliente(std::string nombre) : nombre_(std::move(nombre)) {}
    std::string obtenerNombre() const { return nombre_; }
private:
    std::string nombre_;
};

class Pedido {
public:
    Pedido(int id, const Cliente& cliente) : id_(id), cliente_(cliente) {}

    void mostrar() const {
        std::cout << "Pedido " << id_ << " para cliente " 
                  << cliente_.obtenerNombre() << "\n";
    }

private:
    int id_;
    const Cliente& cliente_; // asociación obligatoria, no propietaria
};

int main() {
    Cliente c("María");
    Pedido p(789, c);
    p.mostrar();
    return 0;
}
```

En este caso:

* `Pedido` mantiene una **referencia constante** al objeto `Cliente`.
* El `Pedido` guarda un **referencia constante**, solo conoce al `Cliente`, lo usa para obtener información, pero no lo controla ni lo modifica.
* La referencia **no puede ser nula ni reasignada**, garantizando una relación válida durante toda la vida del `Pedido`.
* La asociación es **no propietaria**: el `Cliente` es gestionado desde fuera de la clase `Pedido`.
* El modelo es **ligero y seguro**, siempre que se respete la garantía de existencia del objeto referenciado.

Este enfoque resulta especialmente adecuado en contextos donde la **validez de los objetos asociados está controlada por una capa superior**, como gestores de entidades, repositorios o contextos de aplicación.

