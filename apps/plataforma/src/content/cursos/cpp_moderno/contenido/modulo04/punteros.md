---
title: "Gestión de memoria con punteros"
---

En C++, los **punteros** y las **referencias** son dos herramientas esenciales que permiten acceder y manipular los datos guardados en memoria de **forma indirecta**. Estos mecanismos proporcionan un mayor control sobre la memoria y los recursos, y constituyen la base para trabajar de forma eficiente con estructuras dinámicas, memoria dinámica y funciones que necesitan modificar datos externos.

## Dirección de memoria

Para comprender los punteros, es necesario recordar que cada variable que declaramos en un programa C++ se almacena en una posición concreta de la memoria RAM del ordenador. Cada una de esas posiciones tiene asociada una **dirección de memoria**, que permite localizarla.

Al declarar una variable, además de indicar el nombre de la variable y su tipo de datos (que determina el espacio de memoria ocupado) podemos acceder a la **dirección de memoria** donde se ubica y donde guardaremos su valor.

## Los Operadores `&` y `*`

En C++, existen dos operadores fundamentales para trabajar con direcciones de memoria:

* **`&` (operador de dirección):** devuelve la dirección de memoria de una variable.
* **`*` (operador de desreferenciación):** permite acceder al contenido de una dirección de memoria.

Ejemplo práctico:

```cpp
#include <iostream>

int main() {
    int edad = 10;

    std::cout << &edad << std::endl;   // Muestra la dirección de memoria de 'edad'
    std::cout << *&edad << std::endl;  // Muestra el contenido de esa dirección (valor de 'edad')
    *&edad = 12;                       // Modifica el contenido de la variable usando su dirección
    std::cout << edad << std::endl;    // Comprueba que el valor de 'edad' ha cambiado

    return 0;
}
```

## Punteros

Un **puntero** es una variable especial que almacena la **dirección de memoria** de otra variable. Se dice que el puntero "apunta" a esa variable, y a través de él se puede acceder y modificar su contenido.

Para declarar un puntero, se indica el tipo de dato al que va a apuntar, seguido del operador `*`. Veamos un ejemplo:

```cpp
#include <iostream>

int main() {
    // Declaramos una variable entera
    int edad = 10;

    // Declaramos un puntero a entero
    int* ptr;

    // El puntero apunta a la dirección de 'edad'
    ptr = &edad;

    // Mostramos la dirección de memoria de 'edad' usando el puntero
    std::cout << "Dirección de memoria almacenada en ptr: " << ptr << std::endl;

    // Accedemos al contenido apuntado por ptr (valor de 'edad')
    std::cout << "Valor de 'edad' a través del puntero: " << *ptr << std::endl;

    // Modificamos el valor de 'edad' usando el puntero
    *ptr = 12;

    // Comprobamos que el valor de 'edad' ha cambiado
    std::cout << "Nuevo valor de 'edad' después de modificarlo con ptr: " << edad << std::endl;

    return 0;
}
```

## Punteros y gestión de memoria

Los **punteros** permiten trabajar directamente con direcciones de memoria, lo que proporciona un control preciso sobre los recursos del sistema. Esta capacidad resulta imprescindible para:

* **Reservar y liberar memoria dinámica** utilizando los operadores `new` y `delete`.
* **Construir estructuras dinámicas** como listas enlazadas, árboles, grafos o vectores de tamaño variable.
* Optimizar el rendimiento evitando **copias innecesarias** de datos, especialmente en estructuras grandes.
* **Manipular parámetros de funciones** de forma eficiente, permitiendo modificar el valor de las variables originales.

Sin embargo, el uso de punteros exige una gestión rigurosa para evitar errores frecuentes:

* **Punteros colgantes:** se produce cuando un puntero apunta a memoria que ya ha sido liberada.
* **Fugas de memoria:** ocurren cuando se reserva memoria dinámicamente, pero no se libera correctamente, lo que consume recursos de forma permanente.
* **Acceso indebido:** desreferenciar punteros no inicializados o nulos puede provocar fallos graves en la ejecución del programa.

Dominar el uso responsable de punteros es un aspecto clave para escribir programas seguros y eficientes en C++.

