---
title: "Ámbito y duración de almacenamiento de variables"
---

Además de declarar e inicializar variables, es importante entender **dónde y cuánto tiempo** existen esas variables en memoria durante la ejecución del programa. Esto depende de su **ámbito** y **duración de almacenamiento**.

* **Ámbito (scope)**: El ámbito de una variable es la región del programa donde la variable es accesible. Existen varios tipos:
   * **Ámbito local (o de bloque)**: Variables declaradas dentro de un bloque `{ ... }` solo son visibles dentro de ese bloque.
   * **Ámbito global**: Variables declaradas fuera de cualquier función o clase son accesibles desde cualquier parte del código posterior a su declaración.
   * **Ámbito de función (parámetros)**: Los parámetros de una función tienen ámbito local a esa función.
* **Duración de almacenamiento (lifetime)**: La duración de almacenamiento es el tiempo durante el cual la variable existe en memoria. Tipos:
   * **Automática (local)**: Variables locales normales tienen duración automática: existen mientras se ejecuta el bloque donde fueron declaradas y se destruyen al salir de ese bloque.
   * **Estática (global)**: Variables con duración estática existen durante toda la ejecución del programa. Se inicializan una sola vez y mantienen su valor entre llamadas.
      * Variables globales tienen duración estática.
      * Variables locales declaradas con la palabra clave `static` también tienen duración estática. La estudiaremos en la sección de Programación Estructurada.
   * **Dinámica**: Variables creadas con operadores de asignación dinámica (`new`/`delete`) existen hasta que se libere la memoria explícitamente. No se tratan aquí en detalle, pues forman parte de gestión avanzada de memoria.

## Ejemplo

```cpp
#include <iostream>

// Variable global:
// - Ámbito: accesible desde cualquier función del programa.
// - Duración: existe durante toda la ejecución del programa.
int contadorGlobal = 0;

int main() {
    // Variable local:
    // - Ámbito: solo es accesible dentro de la función main.
    // - Duración: se crea al entrar en main y se destruye al salir de main.
    int contadorLocal = 0;

    std::cout << "Valor inicial de contadorGlobal: " << contadorGlobal << '\n';
    std::cout << "Valor inicial de contadorLocal: " << contadorLocal << '\n';

    // Modificamos ambas variables
    contadorGlobal += 5;
    contadorLocal += 5;

    std::cout << "Valor modificado de contadorGlobal: " << contadorGlobal << '\n';
    std::cout << "Valor modificado de contadorLocal: " << contadorLocal << '\n';

    return 0;
}
```