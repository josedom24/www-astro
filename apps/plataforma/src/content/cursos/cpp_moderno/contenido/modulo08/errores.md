---
title: "Gestión de errores en C++"
---

La gestión de errores es una parte esencial del desarrollo de software robusto y fiable. En C++, como en muchos otros lenguajes, los errores pueden clasificarse según el momento en que se detectan: **errores de compilación** y **errores en tiempo de ejecución**. Cada uno tiene características propias y exige diferentes estrategias para su tratamiento.

## Errores de compilación

Los errores de compilación son aquellos que el compilador detecta durante el proceso de traducción del código fuente a código máquina. Son errores **estáticos**, lo que significa que el programa ni siquiera llega a ejecutarse. Algunas causas típicas de errores de compilación son:

* Errores de sintaxis (por ejemplo, falta de un punto y coma).
* Uso de variables no declaradas.
* Incompatibilidad de tipos.
* Llamadas incorrectas a funciones (parámetros erróneos, nombres mal escritos).

Ejemplo:

```cpp
int main() {
    int x = "texto"; // Error de tipo: se esperaba un entero
}
```

En este ejemplo, el compilador detecta un intento de asignar una cadena a una variable de tipo `int`. El error se identifica antes de la ejecución, y el programa no puede compilarse hasta que se corrija.

Características:

* Son **fáciles de localizar**, ya que el compilador indica la línea afectada y la causa del error.
* Son **críticos** para la corrección del programa: deben resolverse completamente para que pueda ejecutarse.

## Errores en tiempo de ejecución

Los errores en tiempo de ejecución (también llamados **errores dinámicos**) son más sutiles: el programa compila correctamente, pero falla al ejecutarse debido a condiciones inesperadas. Estos errores pueden ser causados por:

* Datos inválidos proporcionados por el usuario.
* Recursos externos inaccesibles (archivos, red, etc.).
* Cálculos imposibles (división por cero).
* Acceso fuera de límites en contenedores.

Ejemplo:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {1, 2, 3};
    int x = v.at(10); // Error en tiempo de ejecución: acceso fuera de rango
    return 0;
}
```

En este caso, la función `at()` detecta que el índice 10 no es válido y lanza una **excepción**, que detiene el programa si no se maneja. Si en lugar de `at()` se usara el operador `[]`, el comportamiento sería **indefinido**: el programa podría fallar, devolver basura o incluso parecer funcionar.

Características:

* Son **difíciles de detectar a simple vista**, ya que dependen de los datos y del flujo del programa.
* Son **potencialmente peligrosos**, especialmente si no se controlan adecuadamente.


