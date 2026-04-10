---
title: "Ámbito y duración de las variables en funciones"
---

Recordemos dos conceptos importantes sobre las variables:

* El **ámbito** de una variable define la región del código donde dicha variable es accesible.
* La **duración de almacenamiento (lifetime)** es el tiempo durante el cual la variable existe en memoria.

Recordemos los tipos de variables:

## Variables locales

* Se declaran dentro de una función o bloque `{}`.
* **Ámbito local**: solo son accesibles **dentro de la función o bloque** en el que se definen.
* **Duración automática o local**: se crean cuando el flujo de ejecución entra en el ámbito y se destruyen automáticamente al salir.
* Estudiaremos en el siguiente apartado que los **parámetros de una función** en C++ **se comportan como variables locales**.
    
Ejemplo:

```cpp
#include <iostream>

// Función sin parámetros
void mostrarContador() {
    // Variable local: solo existe dentro de esta función
    int contador = 0;  

    // Cada vez que se llama a la función, se crea de nuevo
    contador++;

    std::cout << "Valor del contador local: " << contador << std::endl;
}

int main() {
    // Llamamos varias veces a la misma función
    mostrarContador(); // Imprime 1
    mostrarContador(); // Imprime 1 otra vez (porque la variable se reinicia)
    mostrarContador(); // Imprime 1 otra vez

    return 0;
}
```

## Variables estáticas

* Se definen utilizando la palabra reservada `static`.
* **Ámbito local**: solo son accesibles **dentro de la función o bloque** en el que se definen.
* **Duración estática o global**: existen durante **toda la ejecución del programa** (no se destruye al salir de la función).
* Se inicializa **solo una vez**, la primera vez que se llama a la función y **conserva su valor** en siguientes llamadas.

Ejemplo:

```cpp
#include <iostream>

// Función sin parámetros
void mostrarContador() {
    // Variable estática local:
    // - Solo accesible dentro de esta función
    // - Persiste durante toda la ejecución del programa
    static int contador = 0;  

    contador++; // Incrementa su valor acumulado

    std::cout << "Valor del contador estático: " << contador << std::endl;
}

int main() {
    mostrarContador(); // Imprime 1
    mostrarContador(); // Imprime 2
    mostrarContador(); // Imprime 3

    return 0;
}
```

## Variables globales

* Se declaran **fuera de cualquier función o clase**, normalmente al inicio del archivo.
* **Ámbito global**: Son accesibles desde cualquier función del mismo archivo.
* **Duración estática o global**: Su duración es **todo el tiempo de ejecución del programa**.
* El uso inadecuado puede dificultar la gestión clara de los recursos.

Ejemplo:

```cpp
#include <iostream>

int global = 10;  // Variable global

void mostrarGlobal() {
    std::cout << "El valor de la variable global es: " << global << std::endl;
}

int main() {
    mostrarGlobal();  // Imprime el valor actual de 'global'

    global = 20;  // Modificamos el valor de la variable global

    mostrarGlobal();  // Imprime el nuevo valor de 'global'

    return 0;
}
```


