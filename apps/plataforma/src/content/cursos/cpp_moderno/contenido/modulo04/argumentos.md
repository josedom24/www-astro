---
title: "Paso de argumentos a funciones"
---

## Parámetros y argumentos

El paso de argumentos a funciones es el mecanismo mediante el cual se proporcionan valores o referencias a los parámetros de una función para que esta pueda utilizarlos durante su ejecución.

* **Parámetro:** es la **variable** que se declara en la definición de la función, sirve como "nombre local" para los datos que se recibirán. Se comporta como una **variable local**, es decir, su **ámbito es local** y su **duración automática**.

* **Argumento:** es el **valor real** que se proporciona cuando se llama a la función. Este valor se puede indicar con un literal, con una variable y como el resultado de evaluar una expresión.

Ejemplo:

```cpp
#include <iostream>

void saludar(std::string nombre) { // 'nombre' es un parámetro
    std::cout << "Hola, " << nombre << std::endl;
}

int main() {
    saludar("Carlos"); // "Carlos" es el argumento
    return 0;
}
```

El parámetro `nombre` actúa como una **variable local**, por lo tanto:

* Solo es accesible en la función `saludar()`. Desde la función `main()` no podemos utilizarla.
* Una vez finalizada la ejecución de la función `saludar()` la variable `nombre` se destruye.

## Tipos de pasos de argumentos

En C++, al definir y llamar funciones es fundamental entender cómo se transmiten los datos, ya que de ello dependen aspectos clave como:

* La **eficiencia** del programa.
* La **posibilidad de modificar** los datos originales.
* Evitar **copias innecesarias**, especialmente cuando se trabaja con estructuras complejas, objetos grandes o contenedores de datos voluminosos. Las copias pueden **incrementar el consumo de memoria**, generar un **mayor tiempo de ejecución** e **introducir errores** si no se controlan adecuadamente las operaciones de copia.

Teniendo en cuanta esto, tenemos varias formas de pasar argumentos a las funciones:

1. **Por valor:** se realiza una copia del recurso. Es seguro, pero puede ser costoso en memoria y tiempo para objetos grandes.
2. **Por referencia:** permite que la función **modifique directamente** el recurso original, evitando la copia.
3. **Por referencia constante:** permite que la función **lea** los datos sin modificarlos y sin realizar copias innecesarias.
4. **Por punteros:** cuando se requiere manipulación explícita de memoria o control fino de estructuras dinámicas, asegurando una gestión adecuada de los recursos.

### Paso de argumentos por valor

La función recibe una **copia** del argumento. Trabaja sobre esa copia, y el valor original no se puede modificar.

```cpp
#include <iostream>

void incrementar(int x) {
    std::cout << x << '\n';
    x = x + 1;
}

int main() {
    int a = 5;
    incrementar(a);
    // a sigue valiendo 5
    std::cout << a;
    return 0;
}
```

* El uso del paso de argumentos por valor es sencillo y seguro, y como hemos visto el argumento que se envía a la función no se modifica, podemos decir que es un **parámetro de solo lectura**.
* Sin embargo, puede ser ineficiente si el argumento es un objeto complejo (por ejemplo, `std::vector`, `std::string`, estructuras grandes), ya que se pueden generar copias innecesarias, lo que impacta en el rendimiento y el consumo de recursos.

### Paso de argumentos por referencia

Se utiliza el operador `&` para que la función reciba una **referencia** al argumento original. No se realiza copia, y cualquier modificación afecta directamente al argumento original.

```cpp
#include <iostream>

void incrementar(int& x) {
    std::cout << x << '\n';
    x = x + 1;
}

int main() {
    int a = 5;
    incrementar(a);
    // a ahora vale 6
    std::cout << a;
    return 0;
}
```

* Este método es muy eficiente, ya que evitamos la copia. 
* Permite modificar el argumento original, podemos decir que trabajamos con **parámetros de lectura/escritura**.
* Recomendado cuando queremos modificar objetos complejos como `std::string`, `std::vector`, estructuras de datos, etc.


### Paso de argumentos por referencia constante 

Si no es necesario modificar el argumento original, pero tampoco queremos hacer una copia costosa, se usa una **referencia constante** (`const &`). Es muy habitual en C++ moderno.

```cpp
#include <iostream>

void mostrar(const std::string& texto) {
    std::cout << texto << std::endl;
}

int main() {
    std::string mensaje = "¡Hola desde la función mostrar!";
    mostrar(mensaje);  // Llamada a la función con una variable

    // También se puede llamar directamente con un literal:
    mostrar("Este es otro mensaje.");

    return 0;
}
```

* Como hemos comentado, evita la copia, lo que mejora la eficiencia.
* Garantiza que el argumento no podrá modificarse dentro de la función.
* Recomendado para objetos complejos como `std::string`, `std::vector`, estructuras de datos, etc.

### Paso de argumento por puntero

También se pueden pasar punteros, transmitiendo la **dirección de memoria** del argumento y posibilitando también la modificación de los argumentos. 

```cpp
void incrementar(int* x) {
    if (x) {
        std::cout << x << '\n';
        *x = *x + 1;
    }
}

int main() {
    int a = 5;
    incrementar(&a);
    std::cout << a;
    return 0;
}
```

* Esta manera de pasar los argumentos con punteros nos da más flexibilidad para trabajar con recursos dinámicos.
* Sin embargo, requiere atención para evitar punteros nulos o no inicializados.

