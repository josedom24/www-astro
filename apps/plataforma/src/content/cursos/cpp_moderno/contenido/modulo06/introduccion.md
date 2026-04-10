---
title: "Gestión dinámica de memoria y estructuras dinámicas"
---

En la programación moderna, es fundamental comprender **cómo se gestiona la memoria** y cómo se pueden construir y utilizar estructuras que se adaptan dinámicamente a las necesidades del programa.
C++ es un lenguaje que permite tanto una gestión manual de la memoria (como en C), como una gestión segura y automática gracias a sus mecanismos modernos, en particular el **Resource Acquisition Is Initialization (RAII)** y las **estructuras dinámicas de la STL**.

## Tipos de memoria en tiempo de ejecución

Al ejecutar un programa en C++, los datos que maneja se almacenan en diferentes regiones de memoria. Las dos más importantes son:

### Memoria automática (stack)

* Almacena **variables locales** (por ejemplo, dentro de funciones) y **parámetros de funciones**.
* La memoria se reserva y libera automáticamente.
* Muy rápida, pero limitada en tamaño.
* Vida útil: **desde la entrada hasta la salida del bloque donde se declara la variable**.
* **Las variables globales y estáticas** que tienen **duración global** y se guardan en una memoria llamada **estática** con características similares, pero en este caso estas variables duran toda la ejecución del programa.

```cpp
void ejemplo() {
    int x = 42; // memoria en el stack
}
```

### Memoria dinámica (heap)

* Se utiliza cuando no se conoce de antemano el tamaño o duración de los datos.
* El programador debe reservarla explícitamente (`new`) y liberarla (`delete`).
* Más flexible, pero más lenta y propensa a errores si no se gestiona bien.

```cpp
int* ptr = new int(42); // memoria en el heap
delete ptr;             // liberación manual
```

Requiere una gestión cuidadosa: si la memoria no se libera correctamente, pueden producirse fugas de memoria (memory leaks) o accesos indebidos a memoria liberada.

## ¿Qué es una estructura dinámica?

Una **estructura dinámica** es una estructura de datos cuyo tamaño o contenido puede **variar durante la ejecución del programa**. Se construyen usando memoria dinámica y enlaces entre elementos (punteros o referencias).

Ejemplos clásicos de estructuras dinámicas:

* Listas enlazadas
* Árboles binarios
* Pilas y colas con tamaño variable
* Diccionarios o mapas


## Gestión tradicional de memoria (C y C++ clásico)

En el C tradicional (y también en C++ clásico), la memoria dinámica se gestionaba de forma **manual**, lo cual requería:

* Reservar memoria con `new` o `malloc`.
* Liberarla con `delete` o `free`.
* Tener cuidado de no liberar dos veces, ni olvidar liberar (fugas), acceder a memoria liberada,...
* Controlar correctamente la propiedad del recurso, es decir la **propiedad** se refiere **a quién es responsable de liberar un recurso dinámico**. En este caso la propiedad del recurso la tiene el **programador**, que es el responsable de la liberación del recurso.

Este enfoque era **poderoso pero propenso a errores**, y exigía mucho cuidado por parte del programador.

```cpp
struct Nodo {
    int valor;
    Nodo* siguiente;
};

Nodo* cabeza = new Nodo{1, nullptr};
delete cabeza;
```

## El enfoque moderno: RAII

C++ moderno promueve un enfoque distinto: **RAII (Resource Acquisition Is Initialization)**.
La idea principal es que **la gestión del recurso debe estar ligada a la vida de un objeto**. Así:

* El recurso se adquiere en el constructor.
* Se libera automáticamente en el destructor.
* La gestión o propiedad se delega a objetos bien definidos, no al programador directamente.

Los recursos que podemos gestionar con RAII pueden ser de distinto tipo:

* Memoria dinámica.
* Archivos abiertos.
* Conexiones de red o a bases de datos.
* Handles o descriptores de dispositivos, entre otros.

## Aplicación práctica: las estructuras dinámicas de la STL

La **Biblioteca Estándar de C++ (STL)** proporciona estructuras dinámicas que gestionan la memoria dinámica usando el principio de **RAII**, por lo tanto, estas estructuras son **seguras, eficientes y fáciles de usar**. Por ejemplo:

* `std::string`: cadena de caracteres.
* `std::array`: arrays con tamaño definido.
* `std::vector`: arrays dinámico.
* `std::list`: lista doblemente enlazada.
* `std::map`, `std::unordered_map`: diccionarios.


Estas clases **gestionan internamente la memoria dinámica** de forma segura, y liberando recursos automáticamente cuando los objetos salen de su ámbito.

Ejemplo con `std::vector`:

```cpp
#include <vector>

int main() {
    std::vector<int> numeros;
    numeros.push_back(10);
    numeros.push_back(20);
    // No hay necesidad de liberar memoria manualmente
}
```

En este ejemplo:

* La memoria se gestiona dinámicamente según el crecimiento del vector
* El destructor de `std::vector` libera toda la memoria cuando `numeros` sale de ámbito
* El programador **no necesita usar `new` ni `delete`**

Las ventajas de este enfoque son:

* Código más limpio y legible.
* Menor riesgo de errores (fugas, doble liberación).
* Mejor integración con otras funciones del lenguaje (constructores, excepciones).
* Fácil de mantener y escalar.
