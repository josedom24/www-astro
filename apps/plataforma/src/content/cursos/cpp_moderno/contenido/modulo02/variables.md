---
title: "Declaración e inicialización de variables"
---

## Variables

Las **variables** son identificadores que permiten almacenar datos en memoria durante la ejecución de un programa. Cada variable tiene un **tipo** que determina qué clase de datos puede contener, así como la cantidad de memoria que ocupará.

El nombre de una variable puede estar formado por letras, dígitos y subrayados, pero no puede empezar por un dígito. Los nombres se suelen indicar en minúsculas.

## Declaración de variables

Para declarar una variable en C++ es necesario indicar:

* El **tipo** de dato que almacenará.
* Un **nombre identificador** único dentro del ámbito.
* Opcionalmente, un **valor inicial** (inicialización).

Ejemplo básico:

```cpp
int edad;          // Declaración sin inicializar
double salario = 1500.50;  // Declaración con inicialización
```
**Una variable no inicializada tiene un valor indeterminado**, lo que significa que su contenido puede ser cualquier cosa (basura en memoria). Usar ese valor sin inicializar es un error y puede causar comportamientos impredecibles.

## Inicialización de variables

En C++ moderno existen varias formas de inicializar variables. Inicializar una variable correctamente es fundamental para evitar valores indeterminados. 

* **Inicialización por asignación (forma clásica)**: Para inicializar una variable, asignarle un valor usamos el **operador de asignación** `=`. Por ejemplo:

   ```cpp
   int xs = 5;
   double pi = 3.14159;
   char inicial = 'A';
   bool esValido = true;
   ```

   No es aconsejable porque realiza conversiones implícitas, por ejemplo en esta asignación se pierde precisión:

   ```cpp
   int x = 3.14;  // Compila, pero trunca a 3.
   ```

* **Inicialización con paréntesis (constructor):** Se llama directamente al constructor (método que nos permite crear un objeto en programación orientada a objetos). Normalmente, se usa cuando trabajamos con tipos complejos. Ejemplos:

   ```cpp
   int x(5);
   double pi(3.14159);
   char inicial('A');
   bool esValido(true);
   ```

   Un problema que tiene es que podemos confundirla con la declaración de una función.

* **Inicialización uniforme con llaves**: Se empieza a usar desde C++11, y funciona para la inicialización de variables de tipos primitivos y tipos compuestos. 

   ```cpp
   int x{5};
   double pi{3.14159};
   char inicial {'A'};
   bool esValido {true};
   ```

   Previene la conversión implícita no deseada y es la forma recomendad de inicialización. Ejemplo:

   ```cpp
   int x{3.14};  // ERROR: pérdida de precisión.
   ```

   Si no se indica el valor, la variable se inicializará a valores por defecto: los números a 0, las cadenas de caracteres a cadena vacía,...

   ```cpp
   int x{};  // x = 0
   ```



## Inferencia de tipos

Desde C++11, se puede usar la palabra clave `auto` para que el compilador deduzca automáticamente el tipo de la variable a partir del valor con que se inicializa:

```cpp
auto entero{42};       // entero es deducido como int
auto real{3.14};       // real es deducido como double
```

La inferencia solo funciona si la variable se inicializa en la declaración. El compilador **deduce el tipo automáticamente a partir del valor** con el que se inicializa la variable.

Otra forma de inferir el tipo es usando la función `decltype()`, que nos permite **obtener el tipo exacto de una expresión** sin evaluarla. Es muy útil cuando quieres declarar una variable con el mismo tipo que otra expresión o variable, sin escribir el tipo explícitamente. Devuelve exactamente el tipo que tiene la expresión, incluidas referencias, const, etc.

   ```cpp
   int x{5};
   decltype(x) y{10};   // y es int, como x
   ```

## Declaración múltiple

Se pueden declarar varias variables del mismo tipo en una sola línea:

```cpp
int a{1}, b{2}, c{3};
```

Sin embargo, es recomendable evitar esta práctica para mejorar la legibilidad.

## Operadores de asignación

Nos permiten guardar información en las variables. En una variable podemos guardar un literal, otra variable o el resultado de una expresión. Los operadores de asignación son los siguientes:

   * `=`: Asignación simple, por ejemplo:` a=b+7`;
   * Operadores de asignación compuesta: por ejemplo, `+=`, que nos permite sumar y posteriormente asignar. Por ejemplo: `a+=b` es igual que `a=a+b`. También podemos usar los operadores: `-=, *=, /=, %=`,...


## Ejemplo 

```cpp
#include <iostream>

int contador{0};                    //Variable global

int main() {
    int edad{30};                   // Inicialización uniforme
    auto salario{2500.75};          // Inferencia con auto (double)
    decltype(salario) PI{3.14159};  // Inferencia con decltype
    contador+=1;


    std::cout << "Edad: " << edad << "\n";
    std::cout << "Salario: " << salario << "\n";
    std::cout << "Pi: " << PI << "\n";
    std::cout << "Contador: " << contador << "\n";
    
    return 0;
}
```


