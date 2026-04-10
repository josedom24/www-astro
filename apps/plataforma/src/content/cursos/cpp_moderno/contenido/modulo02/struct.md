---
title: "Tipos definidos por el usuario: `struct`"
---

Un `struct` (abreviatura de *structure*, en inglés) es un **tipo de dato definido por el programador**, que combina varios elementos, llamados **miembros**, en un solo objeto.

Cada miembro puede ser de un tipo distinto, y al agruparlos dentro de una estructura, se facilita el manejo y la organización de la información.

Veamos un ejemplo:

```cpp
struct Punto {
    double x;
    double y;
};
```

En este ejemplo, definimos un nuevo tipo de dato llamado `Punto`, que representa un punto en un plano bidimensional mediante dos coordenadas: `x` e `y` de tipo `double`.

## Acceso a los miembros de un `struct`

Para utilizar un `struct`, primero se debe declarar una variable de ese tipo. Luego, se accede a sus miembros mediante el **operador punto (`.`)**. Por ejemplo:

```cpp
#include <iostream>

struct Punto {
    double x;
    double y;
};

int main() {
    Punto p;
    p.x = 3.5;
    p.y = 4.2;

    std::cout << "Coordenadas: (" << p.x << ", " << p.y << ")" << std::endl;

    return 0;
}
```

Podemos usar los diferentes tipos de inicialización. Por ejemplo, usando **inicialización uniforme**:

```cpp
Punto p{3.5, 4.2};
```

## Ejemplo completo

Veamos un ejemplo completo usando una estructura llamada `Libro`, que representa un libro con título, autor y número de páginas:

```cpp
#include <iostream>
#include <string>

// Definición de un struct llamado Libro
struct Libro {
    std::string titulo;    // Título del libro
    std::string autor;     // Autor del libro
    int paginas;           // Número de páginas
};

int main() {
    // Declaración de una variable de tipo Libro
    Libro libro1;

    // Asignación de valores a los miembros usando el operador punto (.)
    libro1.titulo = "Cien años de soledad";
    libro1.autor = "Gabriel García Márquez";
    libro1.paginas = 417;

    // Mostrar la información del libro en consola
    std::cout << "Título: " << libro1.titulo << std::endl;
    std::cout << "Autor: " << libro1.autor << std::endl;
    std::cout << "Número de páginas: " << libro1.paginas << std::endl;

    // Inicialización uniforme de un struct
    Libro libro2{"Don Quijote de la Mancha", "Miguel de Cervantes", 863};

    std::cout << "\nTítulo: " << libro2.titulo << std::endl;
    std::cout << "Autor: " << libro2.autor << std::endl;
    std::cout << "Número de páginas: " << libro2.paginas << std::endl;

    return 0;
}
```

* `struct Libro` agrupa información relevante sobre un libro: título, autor y páginas.
* Se puede asignar valores a cada miembro con el operador punto.
* Se puede inicializar directamente al declarar la variable con la sintaxis uniforme `{...}`.


## Relación con la Programación Orientada a Objetos (POO)

Las estructuras (`struct`) en C++ son una herramienta fundamental para agrupar múltiples datos relacionados bajo un mismo nombre. Su uso permite organizar la información de forma clara y facilita el modelado de entidades sencillas dentro de un programa.

Aunque en C++ moderno los `struct` pueden incorporar **constructores**, **métodos** y otras características avanzadas, en este apartado nos hemos centrado en su función básica: **agrupar datos de manera simple y directa**.

Los conceptos de **constructores**, **métodos**, y el diseño de tipos más complejos y protegidos pertenecen al ámbito de la **Programación Orientada a Objetos (POO)**, que estudiaremos en detalle más adelante, cuando introduzcamos formalmente el concepto de **`class`**.


