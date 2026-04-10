---
title: "Estructuras alternativas: switch"
---

La instrucción `switch` permite seleccionar entre varias opciones de ejecución según el valor de una **expresión entera** o de tipo carácter (`int`, `char`). Es una estructura alternativa múltiple que simplifica la escritura cuando hay que tomar decisiones basadas en múltiples valores concretos.

La sintaxis general de esta instrucción es:

```cpp
switch (expresión) {
    case valor1:
        // instrucciones para valor1
        break;    // rompe el switch (opcional pero recomendable)
    case valor2:
        // instrucciones para valor2
        break;
    // ...
    default:       // opción por defecto (opcional)
        // instrucciones si ningún case coincide
}
```

* La **expresión** debe ser un valor entero o un carácter.
* Cada etiqueta `case` indica un valor concreto con el que se compara la expresión.
* Cuando la expresión coincide con un `case`, se ejecutan las instrucciones desde ese punto hasta que se encuentra un `break` o termina el bloque `switch`.
* La instrucción `break` es importante para evitar que se ejecuten los `case` siguientes.
* El bloque `default` es opcional y se ejecuta si ningún `case` coincide con el valor de la expresión.

Cuando se evalúa la expresión del `switch`:

* Se busca el primer `case` que coincida con el valor.
* Se ejecutan todas las instrucciones desde ese `case` hasta el primer `break` encontrado o hasta el final del `switch`.
* Si no hay ningún `case` que coincida y existe `default`, se ejecutan sus instrucciones.

Veamos un ejemplo. El siguiente programa lee una nota numérica y muestra su clasificación en texto:

```cpp
#include <iostream>

int main() {
    int nota{};
    std::cout << "Dime tu nota: ";
    std::cin >> nota;

    switch (nota) {
        case 1:
        case 2:
        case 3:
        case 4:
            std::cout << "Suspenso";
            break;
        case 5:
            std::cout << "Suficiente";
            break;
        case 6:
        case 7:
            std::cout << "Bien";
            break;
        case 8:
            std::cout << "Notable";
            break;
        case 9:
        case 10:
            std::cout << "Sobresaliente";
            break;
        default:
            std::cout << "Nota incorrecta";
            break;
    }

    std::cout << std::endl << "Programa terminado" << std::endl;
    return 0;
}
```

* Siempre incluye `break` al final de cada `case` para evitar ejecuciones no deseadas en los siguientes casos.
* El `default` es útil para capturar valores fuera de rango o no contemplados.
* La expresión y los valores de `case` deben ser del mismo tipo (o compatibles).
* Aunque el `switch` solo acepta tipos enteros o `char`, para otros tipos como `string` se usan estructuras condicionales `if-else`.
