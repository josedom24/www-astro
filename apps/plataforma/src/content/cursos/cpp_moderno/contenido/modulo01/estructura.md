---
title: "Estructura de un programa en C++"
---

Un programa en C++ se compone de los siguientes elementos:

* **Instrucciones de Preprocesador**: Son directivas que se procesan antes de la compilación. La más común es la inclusión de archivos de cabeceras, que nos permiten usar funcionalidades extras en nuestros programas, mediante la directiva `#include`.
* **Función main()**: Las instrucciones de un programa se agrupan en funciones. Todo programa en C++ debe contener una función llamada `main`, que representa el punto de entrada del programa, es decir, al ejecutar el programa son las instrucciones de esta función las que se empiezan a ejecutar de manera **secuencial**.  
* **Instrucciones**: Son las líneas del programa que están agrupadas dentro de una función e indican la operación que hay que realizar. Existen distintos tipos: declaración de variables, instrucciones de asignación, instrucciones alternativas, instrucciones repetitivas,...
* **Comentarios**: Los comentarios son anotaciones que el compilador ignora y que sirven para documentar el código:
    * **Comentarios de una línea:** Se inician con `//`.
    * **Comentarios de múltiples líneas:** Se delimitan con `/*` y `*/`.

## Sintaxis básica de un programa C++

La sintaxis de C++ define la forma en que se deben escribir las instrucciones. Algunos aspectos relevantes son:

* Toda instrucción finaliza con un punto y coma `;`.
* Las llaves `{}` delimitan bloques de código.
* El lenguaje es **sensible a mayúsculas y minúsculas**. Hay ciertas convenciones al nombrar, por ejemplo el nombre de las variables se suele poner siempre en minúsculas, mientras que el nombre de las constantes se suele poner en mayúsculas.
* Los identificadores (nombre de variables, constantes, funciones,...) deben comenzar con una letra o guion bajo.
* Si se viola la sintaxis, el compilador genera un error de sintaxis y detiene la compilación.
* Se debe incluir solo las funcionalidades extras necesarias mediante la inclusión de archivos de cabeceras adecuadas.

## Ejemplo: Programa "Hola Mundo"

A continuación, se presenta un programa completo en C++ moderno, seguido de la explicación detallada de cada línea.

```cpp
#include <iostream>  // Incluye la biblioteca para operaciones de entrada y salida
using namespace std;
/*
 Este programa imprime un mensaje por pantalla.
 Es un ejemplo básico de programa en C++ moderno.
*/

int main() {  // Función principal: punto de inicio del programa
   cout << "Hola, Mundo" << endl;  // Imprime un mensaje en pantalla
   // Indica que el programa finalizó correctamente, devolviendo un valor entero igual a 0 al sistema operativo
   return 0;  
}
```

* La primera línea es una directiva de preprocesador que indica al compilador que incluya el archivo de  cabecera `iostream`, la cual proporciona funcionalidades para realizar operaciones de entrada y salida estándar, como imprimir en pantalla o leer del teclado.
* La segunda línea, es otra directiva del preprocesador, que nos permite usar el espacio de nombres estándar (`std`). Como podemos tener diferentes elementos en el lenguaje que se llamen igual se utiliza espacios de nombres para agruparlas. El espacio de nombres de las funciones de entrada / salida como `cout` o `cin` están definidos en el espacio de nombres `std`, por lo tanto, si indicamos que vamos a usarlos no será necesario nombrarlo cuando escribamos las instrucciones. Si no indicamos que vamos a usar el espacio de nombres `std` la instrucción que escribe en pantalla quedaría de la siguiente forma:
    ```
    std::cout << "Hola Mundo!!!" << std::endl; 
    ```
* `int main()`: Es la función principal del programa. Al iniciar el programa, se ejecutan de forma secuencial las instrucciones que tiene definida entre llaves `{}`. La función principal devuelve un valor entero (`int`) al sistema operativo. Normalmente, se devuelve el valor `0` si el programa termina con éxito. Si el programa va a tener parámetros en la línea de comandos, nos podemos encontrar esta función definida de esta manera:
    ```
    int main(int argc, char *argv[])
    ```
* `cout << "Hola, Mundo" << endl;`: Instrucción que envía el texto `"Hola, Mundo!!!"` al flujo de salida estándar, generalmente la pantalla.
    * `cout` es el objeto de salida estándar de la biblioteca `std`.
    * El operador `<<` dirige la información al flujo de salida.
    * `"Hola, Mundo!!!"` es una cadena de texto literal.
    * `endl` inserta un salto de línea y fuerza el vaciado del búfer de salida.
* En la última línea se finaliza la ejecución de la función `main()` con la instrucción `return`, además se devuelve el valor `0`, lo cual indica que el programa concluyó correctamente.
* Por último indicar que el programa tiene comentarios de una línea y de múltiples líneas.
