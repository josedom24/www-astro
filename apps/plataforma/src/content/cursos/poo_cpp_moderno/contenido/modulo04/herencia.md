---
title: "Herencia: clases base y derivadas"
---

La **herencia** es uno de los pilares fundamentales de la programación orientada a objetos (POO). Permite definir una nueva clase a partir de otra existente, de modo que la nueva clase hereda atributos y comportamientos de la clase original, pudiendo además **agregar nuevas funcionalidades** o **modificar las existentes**.

## Ventajas de la herencia

* **Reutilización de código**: se evitan duplicaciones al compartir atributos y métodos comunes.
* **Organización jerárquica**: facilita estructurar conceptos en jerarquías claras.
* **Polimorfismo**: permite usar objetos derivados como objetos base en contextos genéricos.

## Clases base y derivadas

En herencia hablamos de dos tipos de clases:

* **Clase base** (o superclase): la clase que define atributos y métodos comunes.
* **Clase derivada** (o subclase): la clase que hereda de la base, extendiendo o especializando su comportamiento.

La herencia representa una relación de tipo **"es-un" (is-a)**:

* Un `Gato` es un `Animal`.
* Un `Círculo` es una `Figura`.
* Un `Coche` es un `Vehículo`.

La herencia más común y recomendada en C++ es la **herencia pública**, en la que:

* Los miembros `public` y `protected` de la clase base permanecen accesibles con las mismas reglas en la clase derivada.
* Los miembros `private` de la clase base **no son accesibles directamente** por la clase derivada.

El modificador **protected** se emplea para permitir que las clases derivadas accedan a ciertos atributos o métodos internos, sin exponerlos en la interfaz pública.

Ejemplo básico:

```cpp
#include <iostream>

// Clase base
class Base {
public:
    void funcionBase() {
        std::cout << "Función de la clase base" << std::endl;
    }
};

// Clase derivada
class Derivada : public Base {
public:
    void funcionDerivada() {
        std::cout << "Función específica de la clase derivada" << std::endl;
    }
};

int main() {
    Derivada obj;
    obj.funcionBase();     // Método heredado de Base
    obj.funcionDerivada(); // Método propio de Derivada
    return 0;
}
```

## Constructores en la herencia

Las clases derivadas deben **invocar explícitamente el constructor de la clase base** en su lista de inicialización.
Si no se indica nada, se llama automáticamente al **constructor por defecto de la base** (si existe).

```cpp
#include <iostream>
#include <string>

// Clase base
class Animal {
private:
    std::string nombre;

public:
    Animal(const std::string& n) : nombre{n} {}

    void mostrarNombre() const {
        std::cout << "Nombre: " << nombre << std::endl;
    }
};

// Clase derivada
class Perro : public Animal {
private:
    std::string raza;

public:
    Perro(const std::string& n, const std::string& r)
        : Animal{n}, raza{r} {}

    void mostrar() const {
        mostrarNombre();  // Método heredado de Animal
        std::cout << "Raza: " << raza << std::endl;
    }
};

int main() {
    Perro p("Toby", "Labrador");
    p.mostrar();
    return 0;
}
```

En este ejemplo, el constructor de `Perro` invoca al de `Animal` en su lista de inicialización.

## Reescritura de métodos en clases derivadas

Una clase derivada puede **redefinir un método heredado** de la base.
Esto se conoce como **reescritura (overriding)** y permite especializar el comportamiento.

```cpp
#include <iostream>

class Animal {
public:
    void hacerSonido() const {
        std::cout << "Sonido genérico de animal" << std::endl;
    }
};

class Perro : public Animal {
public:
    // Reescritura del método hacerSonido()
    void hacerSonido() const {
        std::cout << "Guau guau" << std::endl;
    }
};

int main() {
    Perro p;
    p.hacerSonido();  // Llama a la versión de Perro, no a la de Animal
    return 0;
}
```

Si se desea invocar explícitamente el método de la clase base desde la derivada, se puede usar el **operador de resolución de ámbito**:

```cpp
Animal::hacerSonido();
```

### Ocultamiento de nombres

En C++, si una clase derivada define un método con el mismo nombre que uno de la clase base, **todas las versiones de la base con ese nombre quedan ocultas**, incluso aunque tengan distinta firma.

Ejemplo:

```cpp
#include <iostream>
#include <string>

class Base {
public:
    void f(int x) {
        std::cout << "Base::f(int): " << x << "\n";
    }

    void f(double x) {
        std::cout << "Base::f(double): " << x << "\n";
    }
};

// Clase derivada que oculta las funciones f() de Base
class Derivada : public Base {
public:
    void f(const std::string& texto) {
        std::cout << "Derivada::f(std::string): " << texto << "\n";
    }
};

int main() {
    Derivada d;

    // Solo se puede llamar a la versión de Derivada
    d.f("Hola");        // Correcto
    // d.f(10);         // Error: las versiones de Base están ocultas
    // d.f(3.14);       // Error: también están ocultas

    return 0;
}

```

Para **evitar el ocultamiento y reexponer las versiones de la clase base**, se puede añadir una directiva `using` dentro de la clase derivada:

```cpp
#include <iostream>
#include <string>

class Base {
public:
    void f(int x) {
        std::cout << "Base::f(int): " << x << "\n";
    }

    void f(double x) {
        std::cout << "Base::f(double): " << x << "\n";
    }
};

class Derivada : public Base {
public:
    using Base::f; // Reexpone las sobrecargas de la base

    void f(const std::string& texto) {
        std::cout << "Derivada::f(std::string): " << texto << "\n";
    }
};

int main() {
    Derivada d;

    d.f("Hola");   // Llama a Derivada::f(std::string)
    d.f(10);       // Llama a Base::f(int)
    d.f(3.14);     // Llama a Base::f(double)

    return 0;
}
```

* En la primera versión, la clase derivada oculta las sobrecargas de la base.
* En la segunda versión, la directiva `using Base::f;` reexpone los métodos sobrecargados de `Base`, permitiendo su uso junto con los de `Derivada`.

## Destructores en la herencia

* Cuando se destruye un objeto derivado, **primero se ejecuta el destructor de la derivada y después el de la base**.
* Lo veremos má adelante, pero adelantamos el siguiente concepto: si la clase base gestiona recursos (memoria, archivos, sockets, etc.) y va a ser usada mediante punteros o referencias polimórficas, su destructor debe ser virtual. Es decir, es obligatorio redefinirla en la clase derivada. Así garantizamos que:
    * Se llamen todos los destructores en orden correcto (de derivada a base).
    * Se liberen correctamente todos los recursos (RAII).
    * No haya fugas de memoria ni comportamiento indefinido.

## Herencia múltiple

En C++, una clase puede heredar de varias clases base al mismo tiempo. A esta característica se la conoce como **herencia múltiple**.

```cpp
class ClaseDerivada : public Base1, public Base2 {
    // ...
};
```

Aunque el lenguaje la permite, **su uso no es recomendable en la mayoría de los casos**, ya que introduce complejidad adicional y puede provocar problemas de ambigüedad (como el llamado *problema del diamante*, cuando dos clases intermedias heredan de una misma base).

En la práctica moderna, la herencia múltiple se utiliza solo en casos muy concretos, principalmente para combinar **interfaces (clases abstractas puras)**. Para el resto de situaciones, se recomienda emplear **herencia simple** junto con **composición** para modelar las relaciones entre clases de forma más clara y segura.

