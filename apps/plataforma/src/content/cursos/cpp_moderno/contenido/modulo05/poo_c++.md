---
title: "Definición de clases y creación de objetos"
---

## Definición de clases

Una **clase** es una plantilla o molde que define:

* **Atributos** (también llamados **miembros de datos**): variables que representan el estado de los objetos.
* **Métodos** (también llamados **funciones miembro**): funciones que representan el comportamiento de los objetos.

La clase encapsula estos elementos y define cómo los objetos deben comportarse. Veamos un ejemplo:

```cpp
#include <iostream>

class Rectangulo {
public:
    double base;
    double altura;


    // Método para calcular el área
    double calcularArea() const {
        return base * altura;
    }

    // Método para establecer las dimensiones (si se desea cambiar después de la creación)
    void establecerDimensiones(double b, double h) {
        base = b;
        altura = h;
    }
};

int main() {
    // Crear el objeto con el constructor y pasar las dimensiones directamente
    Rectangulo r1;
    r1.base=3.0;
    r1.altura=5.0;

    std::cout << "Área del rectángulo: " << r1.calcularArea() << std::endl;

    // Si se desea cambiar las dimensiones después de la creación
    r1.establecerDimensiones(7.0, 4.0);
    std::cout << "Área del rectángulo actualizado: " << r1.calcularArea() << std::endl;

    return 0;
}
```

En este ejemplo:

* `base` y `altura` son **atributos públicos**.
* Los métodos `establecerDimensiones` y `calcularArea` son **públicos** y permiten manipular el estado del objeto y realizar cálculos.
* Los métodos, al ser funciones miembro, pueden recibir argumentos y retornar valores como cualquier función en C++. Las distintas formas de paso de argumentos y retorno de valores es igual a las estudiadas con las funciones.

## Creación e inicialización de objetos

Un **objeto** es una **instancia concreta de una clase**. Cada objeto tiene su propio estado (valores de los atributos) y puede ejecutar los métodos definidos por la clase. En el ejemplo:

```cpp
    Rectangulo r1;
    r1.base=3.0;
    r1.altura=5.0;
```

En este caso:

* Se crea un objeto `r1` de tipo `Rectangulo`.
* Como los atributos son públicos, se pueden inicializar. Para acceder a los atributos utilizamos el punto.

## Introducción a los constructores y destructores

Un **constructor** es un método especial cuyo nombre coincide con el de la clase y que **no tiene tipo de retorno**. Se ejecuta automáticamente al crear un objeto y se utiliza para inicializar sus atributos.

Tipos de constructores:

* **Constructor por defecto**: no recibe argumentos e inicializan los atributos a valores por defecto.
* **Constructor parametrizado**: recibe argumentos para inicializar atributos.

Un **destructor** es un método especial que se ejecuta automáticamente cuando un objeto sale de su ámbito de vida (final de un bloque de código). No lo vamos a declarar y vamos a dejar que se ejecute el método destructor creado por defecto.

Veamos un ejemplo definiendo los constructores:

```cpp
#include <iostream>

class Rectangulo {
public:
    double base;
    double altura;

    // Constructor por defecto
    Rectangulo() {
        base = 0.0;
        altura = 0.0;
    }

    // Constructor con parámetros
    Rectangulo(double b, double h) {
        base = b;
        altura = h;
    }

    // Método para calcular el área
    double calcularArea() const {
        return base * altura;
    }

    // Método para establecer las dimensiones usando inicialización uniforme
    void establecerDimensiones(double b, double h) {
        base = b;
        altura = h;
    }
};

int main() {
    // Crear un objeto usando el constructor por defecto
    Rectangulo r1;
    std::cout << "Área del rectángulo r1 (por defecto): " << r1.calcularArea() << std::endl;

    // Crear un objeto usando el constructor con parámetros
    Rectangulo r2(5.0, 3.0);
    std::cout << "Área del rectángulo r2 (con parámetros): " << r2.calcularArea() << std::endl;

    // Modificar las dimensiones de r1 usando el método establecerDimensiones
    r1.establecerDimensiones(7.0, 4.0);
    std::cout << "Área del rectángulo r1 después de actualizar dimensiones: " << r1.calcularArea() << std::endl;

    return 0;
}
```
* En este caso se crea el `Rectangulo r1` usando el constructor por defecto: `Rectangulo r1()` y se crea el `Rectangulo r2` usando el constructor con argumentos: `Rectangulo r2(5.0, 3.0);`.


## Constructores con lista de inicialización 

Los **constructores con lista de inicialización** son una forma especial de inicializar directamente los miembros de una clase.
En el ejemplo anterior, no se usó los constructores con lista de incialización, por lo tanto:

* Todos los miembros se construyen primero con su constructor por defecto (o con una inicialización por defecto implícita).
* Luego, en el cuerpo del constructor, se asigna un nuevo valor a esos miembros.

Al usar **listas de incialización**, los atributos se construyen directamente con el valor que les pasas en la lista. Por ejemplo:

```cpp
#include <iostream>

class Rectangulo {
public:
    double base;
    double altura;

    // Constructor por defecto usando lista de inicialización
    Rectangulo() : base{0.0}, altura{0.0} {}

    // Constructor con parámetros usando lista de inicialización
    Rectangulo(double b, double h) : base{b}, altura{h} {}

    // Método para calcular el área
    double calcularArea() const {
        return base * altura;
    }

    // Método para establecer las dimensiones
    void establecerDimensiones(double b, double h) {
        base = b;
        altura = h;
    }
};

int main() {
    // Crear un objeto usando el constructor por defecto
    Rectangulo r1;  // No hace falta poner los () se ejecuta el constructor por defecto.
    std::cout << "Área del rectángulo r1 (por defecto): " << r1.calcularArea() << std::endl;

    // Crear un objeto usando el constructor con parámetros
    Rectangulo r2(5.0, 3.0);
    std::cout << "Área del rectángulo r2 (con parámetros): " << r2.calcularArea() << std::endl;

    // Modificar las dimensiones de r1 usando el método establecerDimensiones
    r1.establecerDimensiones(7.0, 4.0);
    std::cout << "Área del rectángulo r1 después de actualizar dimensiones: " << r1.calcularArea() << std::endl;

    return 0;
}

```

