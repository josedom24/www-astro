---
title: "Ejercicios con funciones"
---

## Ejercicio 1

Define una función `EscribirCentrado`que reciba una cadena de texto como parámetro y lo imprima centrado en pantalla, asumiendo una anchura fija de 80 columnas. La función debe imprimir espacios antes del texto para centrarlo y, justo debajo, una línea con el carácter `=` que tenga la misma longitud que el texto.

## Ejercicio 2

Crea una función `bool EsMultiplo(int a, int b)` que devuelva `true` si `a` es múltiplo de `b`. En el programa principal, pide al usuario dos números enteros y utiliza esta función para indicar si alguno es múltiplo del otro.

## Ejercicio 3

Define una función `inline` llamada `CalcularMedia` que reciba dos valores `double` (temperatura máxima y mínima) y devuelva la temperatura media. El programa principal debe pedir el número de días y, para cada día, pedir las temperaturas máxima y mínima, calculando y mostrando la media usando esta función.

## Ejercicio 4

Crea una función `std::string ConvertirEspaciado(const std::string& texto)` que reciba un texto y devuelva una cadena nueva donde cada carácter esté separado por un espacio adicional. Por ejemplo, `"Hola"` se transformará en `"H o l a "`.

## Ejercicio 5

Escribe un programa que lea palabras desde teclado hasta que el usuario escriba `"fin"`. Durante la lectura, determina **la palabra lexicográficamente mayor y la menor** sin almacenar todas las palabras en memoria.

Define dos funciones:

```cpp
std::string CalcularMax(const std::string& palabra_actual, const std::string& max_actual);
std::string CalcularMin(const std::string& palabra_actual, const std::string& min_actual);
```

Al finalizar, muestra la palabra máxima y la mínima introducidas.


## Ejercicio 6

Define una función:

```cpp
double CalcularPromedio(double suma, int cantidad);
```

* `suma` es la suma acumulada de los números introducidos.
* `cantidad` es el número de valores válidos introducidos.
* La función devuelve el promedio (media aritmética) de los valores.

En el programa principal:

* Pide al usuario que introduzca números reales uno a uno hasta que introduzca un valor negativo (que no se incluirá en el cálculo).
* Mantén la **suma acumulada** y el **contador** de números introducidos mientras se leen los valores.
* Llama a la función `CalcularPromedio` para calcular y mostrar el promedio.


## Ejercicio 7

Crea una función recursiva `int CalcularMCD(int a, int b)` que calcule el máximo común divisor de dos enteros `a` y `b` usando el método de Euclides. El programa pedirá dos números y mostrará su MCD.

## Ejercicio 8

Define una función `constexpr int Potencia(int base, unsigned int exponente)` que calcule la potencia `base` elevado a `exponente` usando recursión. Comprueba su uso en tiempo de compilación y en tiempo de ejecución.

## Ejercicio 9

Lee edades enteras desde teclado una a una hasta que el usuario introduzca un número negativo (que no se incluirá en el conteo).

Durante la lectura, utiliza **funciones lambda** para determinar y contar cuántas edades corresponden a cada grupo:

* **Menores de edad:** < 18
* **Adultos:** 18 - 64
* **Mayores:** >= 65

Al finalizar, muestra el conteo de cada grupo.


## Ejercicio 10

Define una estructura Fraccion que contenga un numerador y un denominador. Implementa las siguientes funciones:

* `leerFraccion()`: devuelve una fracción válida introducida por el usuario.
* `simplificar(Fraccion&)`: simplifica una fracción usando el MCD (usa una función mcd auxiliar).
* `sumar(Fraccion, Fraccion)`: devuelve la suma de dos fracciones.
* `escribirFraccion(const Fraccion&)`: imprime la fracción de forma simplificada.

Realiza un programa que permita sumar dos fracciones introducidas por el usuario y muestre el resultado.