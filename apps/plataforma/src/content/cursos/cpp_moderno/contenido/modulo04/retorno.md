---
title: "Valores de retorno de una función"
---

En C++, las funciones pueden devolver un valor tras su ejecución. Si no devuelven ningún valor se decalaran con el tipo de datos `vood`. Para devolver una valor, utilizamos la instrucción `return` y veremos que existen varias formas de hacerlo:


## Retorno por valor

La forma más simple y habitual de devolver un valor. **La función devuelve una copia** del valor calculado, lo que es seguro y fácil de entender. Se puede considerar que la función es una expresión del tipo de datos que devuelve. Por ejemplo, esta función la podemos considerar un entero:

```cpp
#include <iostream>

// Función que calcula el cuadrado de un número
int cuadrado(int x) {
    return x * x;
}

int main() {
    int numero;

    std::cout << "Ingresa un número: ";
    std::cin >> numero;

    int resultado = cuadrado(numero);  // Llamada a la función

    std::cout << "El cuadrado de " << numero << " es " << resultado << std::endl;

    return 0;
}
```

Hay que tener en cuenta que si el valor devuelto es grande (por ejemplo, un `std::vector`), puede haber un coste asociado a la copia. 

## Retorno por referencia

La función devuelve **una referencia a un valor existente**, en lugar de una copia. Esta forma tiene sentido cuando el valor que se devuelve **existe fuera de la función** y seguirá existiendo después de que la función termine y cuando se desea hacer modificaciones del valor original.

Veamos un ejemplo:

```cpp
#include <iostream>

// Variable global
int global = 10;

// Función que devuelve una referencia a la variable global
int& obtenerGlobal() {
    return global;
}

int main() {
    std::cout << "Valor inicial de global: " << global << std::endl;

    // Modificamos el valor de global a través de la referencia devuelta
    obtenerGlobal() = 42;

    std::cout << "Valor de global después de modificarlo: " << global << std::endl;

    return 0;
}
```
Recuerda que puedes devolver una referencia de una variable global, o estática (usando el modificador `static`). De una variable local a la función no puedes devolver referencia.


## Retorno por referencia constante

Si no se desea permitir la modificación directa del valor, pero se quiere evitar la copia, se puede devolver una **referencia constante**:

```cpp
#include <iostream>
#include <string>

// Función que devuelve una referencia constante a un string estático
const std::string& obtenerNombre() {
    static std::string nombre = "Carlos";
    return nombre;
}

int main() {
    const std::string& nombre = obtenerNombre();  // Llamada a la función

    std::cout << "El nombre es: " << nombre << std::endl;

    return 0;
}
```

En este caso, debe garantizarse que el valor referenciado siga existiendo tras finalizar la función (en el ejemplo, se usa `static` para lograrlo).

Aunque también es posible devolver punteros, lo que nos otorga una gran flexibilidad, no lo veremos en este capítulo, ya que exige precaución, al ser el programador responsable de liberar la memoria si es necesario. Además, en C++ moderno se usan mecanismos para que la gestión de la memoria dinámica se haga de forma más efectiva.